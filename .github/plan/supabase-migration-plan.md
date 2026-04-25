# Supabase Migration Plan

**Goal:** Migrate from static JSON files to Supabase as the primary data source, starting with the projects data.

**Target date:** TBD  
**Status:** 📋 Planning

---

## Key Architectural Decisions

### 1. Read-only architecture
- **Next.js app performs GET operations only**
- No INSERT/UPDATE/DELETE from the application
- All data modifications done directly in Supabase dashboard or SQL editor
- Simplifies security, no auth needed initially
- RLS policies block all writes from app (defense-in-depth)

### 2. Standard column pattern for all tables
Every table will include these columns:

```sql
is_visible   BOOLEAN NOT NULL DEFAULT true   -- Show/hide without deletion
order_index  INTEGER                         -- Manual sort (null = auto-sort)
created_at   TIMESTAMPTZ DEFAULT now()       -- Audit trail
updated_at   TIMESTAMPTZ DEFAULT now()       -- Audit trail
```

This pattern will be applied to:
- ✅ `projects` (this migration)
- 🔜 `certificates` (future)
- 🔜 `accomplishments` (future)
- 🔜 Any other data tables

### 3. Hybrid sorting strategy
```
ORDER BY order_index ASC NULLS LAST,  -- Manual pins first
         stars DESC,                   -- Then by popularity
         date_created DESC             -- Then by recency
```

---

## Phase 1: Setup & Infrastructure

### 1.1 Install Supabase client

```bash
npm install @supabase/supabase-js
```

### 1.2 Environment configuration

Create/update `.env.local` at project root:

```env
# Supabase (client-side read-only access)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-only Supabase key (for seeding scripts only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **Architecture note:** The app only performs **read operations**. All data modifications (INSERT/UPDATE/DELETE) will be done directly in the Supabase dashboard or SQL editor. The `SUPABASE_SERVICE_ROLE_KEY` is only used for one-time seeding scripts.

### 1.3 Create Supabase client utility

**File:** `lib/supabase/client.ts` (new)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Read-only client for fetching data
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**File:** `lib/supabase/server.ts` (new, for seeding scripts only)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client for seeding scripts (NOT used in the app)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

---

## Phase 2: Database schema — `projects` table

### 2.0 Migration file structure

Create a `supabase/` folder to organize all migrations and seeds:

```
supabase/
├── migrations/
│   ├── 001_create_projects_table.sql
│   ├── 002_create_certificates_table.sql    # Future
│   └── 003_create_accomplishments_table.sql # Future
└── seeds/
    ├── projects_seed_template.sql
    ├── certificates_seed_template.sql        # Future
    └── accomplishments_seed_template.sql     # Future
```

**Naming convention:**
- Migrations: `NNN_description.sql` (sequential numbering)
- Seeds: `{table}_seed_template.sql`

**Why this approach:**
- Version controlled schema changes
- Easy to recreate database from scratch
- Reusable seed templates for common operations
- Clear migration history
- Can be run in any Supabase project (dev/staging/prod)

### 2.1 Table structure

Based on `scripts/github.json` structure:

| Column            | Type                  | Constraints                       | Notes                                |
| ----------------- | --------------------- | --------------------------------- | ------------------------------------ |
| `id`              | `uuid`                | `PRIMARY KEY DEFAULT uuid_generate_v4()` | Auto-generated                       |
| `project`         | `text`                | `NOT NULL, UNIQUE`                | Project name (currently the URL slug)|
| `description`     | `text`                | nullable                          | Project description                  |
| `language`        | `text`                | nullable                          | Primary language (e.g., "Python")    |
| `date_created`    | `timestamptz`         | `NOT NULL DEFAULT now()`          | Creation date (ISO 8601)             |
| `stars`           | `integer`             | `NOT NULL DEFAULT 0`              | GitHub stars or manual count         |
| `images`          | `text[]`              | nullable, `DEFAULT '{}'`          | Array of image paths                 |
| `website`         | `text`                | nullable                          | Live URL                             |
| `topics`          | `text[]`              | nullable, `DEFAULT '{}'`          | Tags/topics                          |
| `repository_link` | `text`                | nullable                          | GitHub repo URL                      |
| `is_visible`      | `boolean`             | `NOT NULL DEFAULT true`           | Controls public visibility (draft mode) |
| `order_index`     | `integer`             | nullable                          | Manual sort order (null = auto-sort by stars/date) |
| `created_at`      | `timestamptz`         | `DEFAULT now()`                   | Record creation (audit)              |
| `updated_at`      | `timestamptz`         | `DEFAULT now()`                   | Record last modified (audit)         |

### 2.2 SQL migration — `supabase/migrations/001_create_projects_table.sql`

Create this file and run it in Supabase SQL Editor:

**File:** `supabase/migrations/001_create_projects_table.sql`

```sql
-- Migration: Create projects table
-- Date: 2026-04-25
-- Description: Initial projects table with visibility control and manual ordering

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project TEXT NOT NULL UNIQUE,
  description TEXT,
  language TEXT,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  stars INTEGER NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  website TEXT,
  topics TEXT[] DEFAULT '{}',
  repository_link TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_projects_project ON public.projects(project);
CREATE INDEX idx_projects_language ON public.projects(language);
CREATE INDEX idx_projects_date_created ON public.projects(date_created DESC);
CREATE INDEX idx_projects_is_visible ON public.projects(is_visible);
CREATE INDEX idx_projects_order_index ON public.projects(order_index NULLS LAST);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read VISIBLE projects only
CREATE POLICY "Visible projects are viewable by everyone"
  ON public.projects
  FOR SELECT
  USING (is_visible = true);

-- Policy: No writes from the app (all modifications via Supabase dashboard)
CREATE POLICY "No direct inserts from app"
  ON public.projects
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No direct updates from app"
  ON public.projects
  FOR UPDATE
  USING (false);

CREATE POLICY "No direct deletes from app"
  ON public.projects
  FOR DELETE
  USING (false);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration 001: projects table created successfully';
END $$;
```

**To run:**
1. Copy entire contents of `supabase/migrations/001_create_projects_table.sql`
2. Open Supabase Dashboard → SQL Editor
3. Paste and click "Run"
4. Verify output shows success message

### 2.3 Seed template — `supabase/seeds/projects_seed_template.sql`

Create this file for manual data entry via SQL:

**File:** `supabase/seeds/projects_seed_template.sql`

```sql
-- Seed Template: Projects
-- Use this template when adding projects manually via SQL
-- Copy, fill in values, and run in SQL Editor

-- Single project insert
INSERT INTO public.projects (
  project,
  description,
  language,
  date_created,
  stars,
  images,
  website,
  topics,
  repository_link,
  is_visible,
  order_index
) VALUES (
  'Project Name',                                    -- Required: unique name
  'Project description goes here',                   -- Optional
  'Python',                                          -- Optional: primary language
  '2024-01-01T00:00:00Z',                           -- Required: ISO 8601 timestamp
  0,                                                 -- Default: 0 stars
  ARRAY['/images/projects/image1.png'],             -- Optional: array of image paths
  'https://example.com',                             -- Optional: live URL
  ARRAY['React', 'TypeScript', 'AWS'],              -- Optional: array of tags
  'https://github.com/user/repo',                    -- Optional: GitHub URL
  true,                                              -- true = visible, false = hidden
  NULL                                               -- NULL = auto-sort, or set number (1, 2, 3...)
);

-- ============================================================================
-- EXAMPLES
-- ============================================================================

-- Example 1: Featured project (pinned to position 1)
INSERT INTO public.projects (project, description, language, date_created, is_visible, order_index)
VALUES (
  'Taja AI',
  'AI-powered video-to-social-media converter',
  'Python',
  '2024-04-19T10:38:20Z',
  true,
  1  -- Pin to top
);

-- Example 2: Hidden draft project
INSERT INTO public.projects (project, description, is_visible, order_index)
VALUES (
  'Secret Project',
  'Work in progress...',
  false,  -- Hidden from public
  NULL
);

-- Example 3: Simple project (auto-sort by stars/date)
INSERT INTO public.projects (project, description, language, date_created)
VALUES (
  'My Portfolio',
  'Personal portfolio website',
  'JavaScript',
  now()
);

-- ============================================================================
-- BULK UPDATE OPERATIONS
-- ============================================================================

-- Pin multiple projects to top positions
UPDATE public.projects SET order_index = 1 WHERE project = 'Taja AI';
UPDATE public.projects SET order_index = 2 WHERE project = 'AutoDoser';
UPDATE public.projects SET order_index = 3 WHERE project = 'Environmental DB';

-- Hide all projects with 0 stars
UPDATE public.projects 
SET is_visible = false 
WHERE stars = 0;

-- Auto-number all visible projects (10, 20, 30... with gaps)
WITH numbered AS (
  SELECT 
    id, 
    ROW_NUMBER() OVER (ORDER BY stars DESC, date_created DESC) * 10 AS new_index
  FROM public.projects
  WHERE is_visible = true
)
UPDATE public.projects p
SET order_index = n.new_index
FROM numbered n
WHERE p.id = n.id;

-- Remove all manual ordering (back to auto-sort)
UPDATE public.projects SET order_index = NULL;
```

### 2.4 Create the migration files

```bash
# Create folder structure
mkdir -p supabase/migrations supabase/seeds

# Create migration file
touch supabase/migrations/001_create_projects_table.sql

# Create seed template file
touch supabase/seeds/projects_seed_template.sql
```

Then copy the SQL from sections 2.2 and 2.3 into these files.

**Add to `.gitignore`** (optional — exclude actual seed data, keep templates):
```gitignore
# Supabase seed data (keep templates, ignore actual seeds)
supabase/seeds/*_data.sql
```

### 2.3 Data seeding script

**File:** `scripts/seed-projects.ts` (new)

```typescript
import { createClient } from '@supabase/supabase-js'
import githubProjects from './github.json'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedProjects() {
  console.log(`Seeding ${githubProjects.length} projects...`)

  const { data, error } = await supabase
    .from('projects')
    .upsert(
      githubProjects.map((p: any, index: number) => ({
        project: p.project,
        description: p.description,
        language: p.language,
        date_created: p.date_created,
        stars: p.stars,
        images: p.images || [],
        website: p.website,
        topics: p.topics || [],
        repository_link: p.repository_link,
        is_visible: true,  // Default all existing projects to visible
        order_index: null, // Null = auto-sort by stars/date (or use: index + 1 to preserve current order)
      })),
      { onConflict: 'project' }  // Update if project name already exists
    )

  if (error) {
    console.error('Error seeding projects:', error)
    process.exit(1)
  }

  console.log(`✅ Successfully seeded ${data?.length || githubProjects.length} projects`)
}

seedProjects()
```

**Note:** `order_index: null` means projects will auto-sort by stars then date. If you want to preserve the current order from `github.json`, change it to `order_index: index + 1` (1-indexed) or `order_index: index * 10` (gaps for future insertions).


**Add to `package.json` scripts:**

```json
{
  "scripts": {
    "seed:projects": "tsx scripts/seed-projects.ts"
  }
}
```

**Install `tsx` for TypeScript execution:**

```bash
npm install -D tsx
```

---

## Phase 3: Code migration

### 3.1 Replace `/api/github` with `/api/projects`

**File:** `pages/api/projects.ts` (new)

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_visible', true)  // Only fetch visible projects
    .order('order_index', { ascending: true, nullsFirst: false })  // Custom order first (nulls last)
    .order('stars', { ascending: false })      // Then by stars (desc)
    .order('date_created', { ascending: false }) // Then by date (desc)

  if (error) {
    console.error('Supabase error:', error)
    return res.status(500).json({ error: 'Failed to fetch projects' })
  }

  return res.status(200).json(projects)
}
```

> **Sort behavior:** Projects with an `order_index` will appear first (in ascending order: 1, 2, 3...), followed by projects without `order_index` (null) sorted by stars then date. This gives you manual control over featured projects while auto-sorting the rest.

### 3.2 Update `ProjectsGrid.jsx`

**Before:**
```javascript
const response = await fetch("/api/github");
```

**After:**
```javascript
const response = await fetch("/api/projects");
```

### 3.3 Update `pages/projects/[project].jsx`

**Before (getServerSideProps):**

```javascript
import githubRepos from "../../scripts/github.json";

export async function getServerSideProps({ query }) {
  const { project } = query;
  const foundProject = githubRepos.find((p) => p.project === project);
  // ...
}
```

**After:**

```javascript
import { supabase } from '../../lib/supabase/client'

export async function getServerSideProps({ query }) {
  const { project } = query;

  const { data: foundProject, error } = await supabase
    .from('projects')
    .select('*')
    .eq('project', project)
    .eq('is_visible', true)  // Only fetch if visible
    .single()

  if (error || !foundProject) {
    return { notFound: true }
  }

  return {
    props: {
      project: foundProject,
    },
  }
}
```

**Optional:** Migrate to `getStaticPaths` + `getStaticProps` for static generation:

```javascript
export async function getStaticPaths() {
  const { data: projects } = await supabase
    .from('projects')
    .select('project')
    .eq('is_visible', true)  // Only generate paths for visible projects

  const paths = (projects || []).map((p) => ({
    params: { project: p.project },
  }))

  return {
    paths,
    fallback: 'blocking',  // ISR: regenerate on-demand
  }
}

export async function getStaticProps({ params }) {
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('project', params.project)
    .eq('is_visible', true)  // Only show if visible
    .single()

  if (!project) {
    return { notFound: true }
  }

  return {
    props: { project },
    revalidate: 3600,  // Revalidate every hour
  }
}
```

---

## Phase 4: Testing & validation

### 4.1 Manual testing checklist

- [ ] `/projects` page loads with all **visible** projects
- [ ] Hidden projects (`is_visible = false`) do **not** appear in the list
- [ ] Search functionality works (client-side filtering)
- [ ] Language filter works (client-side filtering)
- [ ] Pagination works (9 items per page)
- [ ] Clicking a project card navigates to `/projects/[project]`
- [ ] Project detail page renders with all fields (title, description, images, links)
- [ ] Hidden project URL returns 404 (e.g., `/projects/hidden-project` should not be accessible)
- [ ] Image gallery/modal works on detail page
- [ ] **Sort order test:** Projects with `order_index` appear first (1, 2, 3...), then projects without `order_index` sorted by stars/date
- [ ] **Custom order test:** Manually set `order_index` on a few projects in Supabase (e.g., 1, 2, 3) → verify they appear at the top in that order
- [ ] **Visibility toggle test:** Manually set a project to `is_visible = false` in Supabase → verify it disappears from both list and detail pages

### 4.2 Performance comparison

Document response times:

| Metric                          | Before (JSON) | After (Supabase) |
| ------------------------------- | ------------- | ---------------- |
| `/api/github` (200ms p50)       | ___ ms        | ___ ms           |
| `/api/projects` (200ms p50)     | N/A           | ___ ms           |
| `/projects/[project]` SSR       | ___ ms        | ___ ms           |
| Time to Interactive (TTI)       | ___ ms        | ___ ms           |

### 4.3 Rollback plan

If issues arise, revert to JSON:

1. Keep `scripts/github.json` in place (don't delete until migration is stable).
2. Restore old API route: rename `pages/api/projects.ts` → `pages/api/projects.ts.bak` and restore `pages/api/github.js`.
3. Revert component changes via `git revert`.

---

## Phase 5: Cleanup & future improvements

### 5.1 Immediate cleanup (after stable migration)

- [ ] Delete `scripts/github.json` (archive first)
- [ ] Delete `pages/api/github.js`
- [ ] Update `.gitignore` to exclude any local seed data
- [ ] Update `architecture.md`, `implementation.md`, `structure.md` to reflect Supabase
- [ ] Add Supabase connection health check endpoint (`/api/health`)
- [ ] Document the read-only architecture pattern in project docs

### 5.2 Apply `order_index` pattern to other tables

When migrating certificates, accomplishments, and other data, follow this workflow:

#### Step 1: Create migration file

**File:** `supabase/migrations/002_create_certificates_table.sql`

```sql
-- Migration: Create certificates table
-- Date: [date]
-- Description: Certificates with visibility control and manual ordering

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image TEXT,
  skills TEXT[] DEFAULT '{}',
  highlight BOOLEAN DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,    -- Standard
  order_index INTEGER,                          -- Standard
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_certificates_is_visible ON public.certificates(is_visible);
CREATE INDEX idx_certificates_order_index ON public.certificates(order_index NULLS LAST);
CREATE INDEX idx_certificates_highlight ON public.certificates(highlight);

-- RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible certificates are viewable by everyone"
  ON public.certificates FOR SELECT
  USING (is_visible = true);

CREATE POLICY "No direct writes from app"
  ON public.certificates FOR ALL
  USING (false) WITH CHECK (false);

-- Auto-update trigger
CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DO $$
BEGIN
  RAISE NOTICE 'Migration 002: certificates table created successfully';
END $$;
```

#### Step 2: Create seed template

**File:** `supabase/seeds/certificates_seed_template.sql`

```sql
-- Seed Template: Certificates
-- Use this template when adding certificates manually via SQL

INSERT INTO public.certificates (
  title,
  image,
  skills,
  highlight,
  is_visible,
  order_index
) VALUES (
  'Certificate Title',
  '/images/certificates/cert.jpg',
  ARRAY['Skill 1', 'Skill 2'],
  false,           -- true = highlighted (yellow title)
  true,            -- true = visible, false = hidden
  NULL             -- NULL = auto-sort, or set number
);

-- Example: Highlighted certificate (pinned to top)
INSERT INTO public.certificates (title, image, highlight, order_index)
VALUES ('AWS Certification', '/images/certificates/aws.jpg', true, 1);

-- Bulk: Hide all non-highlighted certificates
UPDATE public.certificates 
SET is_visible = false 
WHERE highlight = false;
```

#### Step 3: Create API endpoint

**File:** `pages/api/certificates.ts`

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('is_visible', true)
    .order('order_index', { ascending: true, nullsFirst: false })
    .order('highlight', { ascending: false })  // Highlighted first
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
```

#### Example: Accomplishments table

**File:** `supabase/migrations/003_create_accomplishments_table.sql`

```sql
CREATE TABLE IF NOT EXISTS public.accomplishments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TEXT NOT NULL,
  card_title TEXT NOT NULL,
  image TEXT,
  images TEXT[] DEFAULT '{}',
  card_detailed_text TEXT,
  icon TEXT,                                    -- Icon name (e.g., 'MdWork')
  icon_style JSONB,                             -- {background, color}
  content_style JSONB,                          -- {background, color}
  is_visible BOOLEAN NOT NULL DEFAULT true,     -- Standard
  order_index INTEGER,                          -- Standard
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Standard indexes + RLS + triggers...
```

**Benefits:**
- Consistent API pattern across all tables
- Easy to curate featured items
- Simple hide/show without deletion
- Predictable sort order logic
- Reusable migration templates

### 5.3 Future enhancements (when write operations are needed)

**Phase A: Read-only features (no auth required)**
- **GitHub sync automation** — schedule a Vercel Cron job or GitHub Action to run `GenerateGithubInfo.py` and upsert into Supabase (use service role key in CI/CD).
- **Image uploads to Supabase Storage** — migrate `images[]` paths from local files to Supabase Storage and serve from CDN.
- **Full-text search** — enable Postgres full-text search on `description` and `topics` for richer search.
- **Analytics** — track project views by logging to a `project_views` table (write-only from API route).
- **Scheduled publishing** — add `publish_at` timestamp with a cron job that sets `is_visible = true` when the time arrives.

**Phase B: Admin UI (requires auth + write permissions)**

When you're ready to enable write operations from the app:

1. **Add authentication** — Supabase Auth (email/password, magic link, or OAuth)
2. **Update RLS policies** — allow authenticated admins to INSERT/UPDATE/DELETE:
   ```sql
   CREATE POLICY "Admins can manage projects"
     ON public.projects
     FOR ALL
     USING (auth.uid() IN (SELECT user_id FROM admin_users))
     WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));
   ```
3. **Build `/admin/projects` page** with:
   - CRUD form for projects
   - Toggle for `is_visible` 
   - **Drag-and-drop reordering** to set `order_index` (using `@dnd-kit/core` or `react-beautiful-dnd`)
   - "Pin to top" button (assigns lowest `order_index`)
   - Bulk actions (mass hide/show, auto-number order)
   - Live preview (shows how the public page will look)
4. **Create admin dashboard** — `/admin` with navigation to manage all tables
5. **Audit logging** — track who changed what and when

**Phase C: Advanced features**
- **Draft/review workflow** — separate `status` column (draft/published/archived)
- **Multi-user permissions** — role-based access (editor, publisher, admin)
- **Version history** — track changes over time
- **Batch operations API** — bulk import/export via CSV or JSON

---

## Data management workflow (read-only architecture)

Since the app only performs GET operations, all data modifications happen in the Supabase dashboard:

### Adding a new project

1. Go to Supabase Dashboard → Table Editor → `projects`
2. Click "Insert row"
3. Fill in fields:
   - `project` — unique name (required)
   - `description`, `language`, `website`, `repository_link` — as needed
   - `images` — array like `{"/images/projects/pic1.png", "/images/projects/pic2.png"}`
   - `topics` — array like `{"React", "TypeScript", "AWS"}`
   - `is_visible` — `true` to show, `false` to hide
   - `order_index` — number (1, 2, 3...) to pin at top, or leave null for auto-sort
4. Click "Save"
5. Changes appear immediately (no deploy needed with ISR/SSR)

### Hiding a project

```sql
UPDATE projects 
SET is_visible = false 
WHERE project = 'my-project-name';
```

### Reordering projects

```sql
-- Pin top 3 projects
UPDATE projects SET order_index = 1 WHERE project = 'Taja AI';
UPDATE projects SET order_index = 2 WHERE project = 'AutoDoser';
UPDATE projects SET order_index = 3 WHERE project = 'Environmental DB';

-- Remove manual ordering (back to auto-sort)
UPDATE projects SET order_index = NULL WHERE project = 'Some Project';
```

### Bulk operations

```sql
-- Hide all PHP projects
UPDATE projects 
SET is_visible = false 
WHERE language = 'PHP';

-- Auto-number all visible projects by current order (10, 20, 30...)
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY stars DESC, date_created DESC) * 10 AS new_index
  FROM projects
  WHERE is_visible = true
)
UPDATE projects p
SET order_index = n.new_index
FROM numbered n
WHERE p.id = n.id;
```

---

## Risks & mitigations

| Risk                                      | Mitigation                                           |
| ----------------------------------------- | ---------------------------------------------------- |
| Supabase API rate limits                  | Cache responses in Next.js (ISR); use CDN           |
| Increased latency vs. local JSON          | Supabase edge functions, connection pooling; typically <100ms |
| Lost data during migration                | Backup `github.json`; dry-run seed script first      |
| Breaking change in Supabase client API    | Pin `@supabase/supabase-js` version; test upgrades   |
| Manual data entry errors                  | Validate in dashboard; future: admin UI with validation |
| No version control for data changes       | Export periodic backups; future: audit log table     |

---

## Definition of done

- [x] Plan documented (this file)
- [ ] Supabase project created
- [ ] `projects` table schema deployed
- [ ] Data seeded from `github.json`
- [ ] `/api/projects` endpoint live
- [ ] `ProjectsGrid` + `[project].jsx` migrated & tested
- [ ] Performance benchmarked
- [ ] Documentation updated (`architecture.md`, `implementation.md`, `changelog.md`)
- [ ] Old JSON + API route removed (or archived)

---

## Timeline estimate

| Phase                  | Estimated time |
| ---------------------- | -------------- |
| Phase 1: Setup         | 30 min         |
| Phase 2: Schema        | 45 min         |
| Phase 3: Code migration| 1.5 hours      |
| Phase 4: Testing       | 1 hour         |
| Phase 5: Cleanup       | 30 min         |
| **Total**              | **~4 hours**   |

> Actual time may vary based on unforeseen issues (auth setup, debugging RLS, etc.).
