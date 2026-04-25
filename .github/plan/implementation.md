# Implementation Notes

This document explains how each surface of the site is wired together — the components, hooks, data, and side effects involved per route.

## App shell

`pages/_app.jsx` wires the global shell:

```5:17:pages/_app.jsx
function MyApp({ Component, pageProps }) {
	return (
		<AnimatePresence>
			<div className=" bg-secondary-light dark:bg-primary-dark transition duration-300">
				<DefaultLayout>
					<Component {...pageProps} />
				</DefaultLayout>
				<UseScrollToTop />
			</div>
		</AnimatePresence>
	);
}
```

`DefaultLayout` injects `PagesMetaHead` defaults, the header, and the footer around every page.

### Header (`components/shared/AppHeader.jsx`)

- Hydration-safe theme switcher: `isClient` flag prevents SSR/CSR mismatch when reading `localStorage`.
- Sun/Moon icon swaps based on `useThemeSwitcher()` state.
- Mobile hamburger toggles a vertical link list; desktop shows links inline.
- Nav items: `Home / About / Projects / Certificates / Accomplishments / Contact`.

### Footer (`components/shared/AppFooter.jsx`)

- 5 social links (Globe → Vercel & GitHub Pages portfolios, GitHub, LinkedIn, Facebook).

## Routes

### `/` — `pages/index.jsx`

Renders `<AppBanner />` centered with `min-height: calc(100vh - 200px)`. The banner contains:

- Name as `<h1>`.
- A dynamically imported `Typewriter` (`ssr: false`) that cycles through "IT Consultant", "Fullstack Developer", "Software Engineer".
- "Download CV" button → `/files/resume.pdf` (HTML `download` attr).

### `/about` — `pages/about.jsx`

Three Framer Motion `opacity` fade sections:

1. **`AboutMeBio`** — profile image + 5 paragraphs from `aboutMeData`.
2. **`AboutCounter`** — two stats:
   - "Years of experience" — calculated from `2019-09-01` to today, animated with `useDecimalCountUp(years, 2, v => v.toFixed(1))`.
   - "Projects Developed & Involved" — hard-coded end value `18` driven by `react-countup`'s `useCountUp`.
3. **`AboutMainStack`** — heading "Current Stack" then a 4-column grid of `AboutMainStackSingle` tiles backed by `mainStackData`.

### `/projects` — `pages/projects/index.jsx` → `ProjectsGrid`

Client-side flow:

1. `useEffect` calls `fetch('/api/projects')` → populates `projects` state.
2. Derives unique `languages` (treating null language as `"Unknown"`).
3. Filters by:
   - `searchProject` — substring match across `project`, `language`, `topics`, `website`, `repository_link`.
   - `selectedLanguage` — exact match (or `null` when "Unknown" is selected).
4. Paginates 9 per page; renders `<` 1 2 3 ... `>` controls.
5. Each card is `<ProjectSingle />` — a `motion.div` linking to `/projects/${project.project}`.

**Data source:** Supabase via `/api/projects` (filters `is_visible = true`, sorts by `order_index` → `stars` → `date_created`).

### `/projects/[project]` — `pages/projects/[project].jsx`

- `getServerSideProps` queries Supabase to find the project by `project` name (URL slug).
- Filters by `is_visible = true` to prevent direct access to hidden/draft projects.
- Returns `{ notFound: true }` if project doesn't exist or isn't visible.
- Renders header (title, date, language, topics), description, "View Repository" + "Visit Website" buttons.
- If `project.images` exists, renders a 3-column gallery; clicking opens a full-screen `Image` modal with click-outside-to-close.
- **Image paths:** Supports both local (`/images/...`) and external (`https://...`) URLs automatically.

**Data source:** Direct Supabase query via `lib/supabase/client.ts` in `getServerSideProps`.

### `/certificates` — `pages/certificates/index.jsx` → `CertificatesGrid`

- Filters `certificatesData` by title (search input).
- Optional "Only Highlighted" checkbox restricts to `cert.highlight === true` (yellow titles).
- Card grid (3 columns desktop) → click opens a centered modal with the full image plus skill chips.

### `/accomplishments` — `pages/accomplishments.jsx`

- Renders `react-vertical-timeline-component` driven by `accomplishmentsData`.
- Each entry has `date`, `cardTitle`, `cardDetailedText`, an `icon` component (`MdWork` / `MdSchool` / `MdStar` / `GrRobot`), and either `image` (single) or `images` (carousel).
- Clicking an entry opens a modal:
  - If `images.length > 1`, shows previous/next chevrons (`MdArrowBackIosNew` / `MdArrowForwardIos`) and cycles via modular arithmetic.
  - Otherwise shows the lone `image`.

### `/contact` — `pages/contact.jsx`

- Two-column flex on `lg+`, stacked on mobile (`flex-col-reverse`).
- **`ContactForm`** uses `emailjs.sendForm` **twice** (notification + confirmation templates) and races them with `Promise.all`. On success → `Modal` (success). On failure → `Modal` (error with `error.text`).
- **`ContactDetails`** is a static list of 3 contact items.

### `/api/github` — `pages/api/github.js` (LEGACY)

```1:11:pages/api/github.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'scripts', 'github.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    res.status(200).json(data);
}
```

Reads the committed JSON synchronously per request. Cheap because the file ships in the bundle; the synchronous `readFileSync` is fine on serverless because Node holds the file handle hot.

**⚠️ LEGACY:** This endpoint is being phased out in favor of `/api/projects` (Supabase-powered).

### `/api/projects` — `pages/api/projects.ts` (NEW - Supabase)

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase/client';
import type { Tables } from '../../lib/supabase/client';

type Project = Tables<'projects'>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_visible', true)
      .order('order_index', { ascending: true, nullsFirst: false })
      .order('stars', { ascending: false })
      .order('date_created', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Key features:**
- **Type safety:** Uses auto-generated TypeScript types from Supabase schema
- **Visibility filter:** Only returns projects where `is_visible = true`
- **Hybrid sorting:** 
  1. `order_index` (manual pins) — NULLS LAST
  2. `stars` (popularity) — descending
  3. `date_created` (recency) — descending
- **Read-only:** No authentication required (RLS enforces read-only access)

**Data flow:**
1. Client → `/api/projects`
2. API → Supabase (read-only client)
3. Supabase → Filtered & sorted `projects`
4. API → JSON response

## Supabase Integration

The portfolio uses **Supabase (PostgreSQL)** for project data with a **read-only architecture** — the Next.js app only performs GET operations.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
├─────────────────────────────────────────────────────────────┤
│  Read-Only Flow (GET):                                       │
│  ┌──────────────┐      ┌──────────────┐     ┌────────────┐ │
│  │ ProjectsGrid │─────▶│ /api/projects│────▶│  Supabase  │ │
│  │  (client)    │      │   (typed)    │     │  (public   │ │
│  └──────────────┘      └──────────────┘     │   RLS)     │ │
│                                              └────────────┘ │
│  ┌──────────────┐                           ┌────────────┐ │
│  │ [project].jsx│──────────────────────────▶│  Supabase  │ │
│  │ (SSR query)  │                           │  (public   │ │
│  └──────────────┘                           │   RLS)     │ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            Admin Flow (INSERT/UPDATE/DELETE):                │
│  ┌────────────┐      ┌──────────────────────────────────┐  │
│  │ Supabase   │──────│  Table Editor / SQL Editor       │  │
│  │ Dashboard  │      │  (Manual data management)        │  │
│  └────────────┘      └──────────────────────────────────┘  │
│                                                              │
│  ┌────────────┐                                             │
│  │ Seed Script│──────▶ supabaseAdmin (service role)        │
│  │ (one-time) │        bypasses RLS for bulk import        │
│  └────────────┘                                             │
└─────────────────────────────────────────────────────────────┘
```

### Client Utilities

#### `lib/supabase/client.ts` (Browser-safe)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
```

**Used by:**
- `/api/projects.ts` — Fetches visible projects
- `pages/projects/[project].jsx` — SSR project detail query

#### `lib/supabase/server.ts` (Server-only)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```

**Used by:**
- `scripts/seed-projects.js` — Bypasses RLS for bulk import

### Database Schema

**Table:** `projects`

| Column            | Type        | Constraints                     | Description                          |
|-------------------|-------------|---------------------------------|--------------------------------------|
| `id`              | UUID        | PRIMARY KEY, `uuid_generate_v4()`| Auto-generated unique identifier     |
| `project`         | TEXT        | UNIQUE, NOT NULL                | Project name (URL slug)              |
| `description`     | TEXT        | NOT NULL                        | Project description                  |
| `language`        | TEXT        | NOT NULL                        | Primary programming language         |
| `date_created`    | TIMESTAMPTZ | NOT NULL                        | Creation date (ISO 8601)             |
| `stars`           | INTEGER     | DEFAULT 0                       | GitHub stars count                   |
| `images`          | TEXT[]      | DEFAULT '{}'                    | Image paths (local or external URLs) |
| `website`         | TEXT        | nullable                        | Live website URL                     |
| `topics`          | TEXT[]      | DEFAULT '{}'                    | Tech stack tags                      |
| `repository_link` | TEXT        | NOT NULL                        | GitHub repository URL                |
| `is_visible`      | BOOLEAN     | NOT NULL, DEFAULT true          | Visibility control (draft mode)      |
| `order_index`     | INTEGER     | nullable, DEFAULT null          | Manual sort order (1, 2, 3...)       |
| `created_at`      | TIMESTAMPTZ | DEFAULT now()                   | Record creation timestamp            |
| `updated_at`      | TIMESTAMPTZ | DEFAULT now()                   | Auto-updated on change               |

**Indexes:**
- `idx_projects_project` — UNIQUE index on `project` (URL lookups)
- `idx_projects_language` — Index on `language` (filtering)
- `idx_projects_date_created` — Index on `date_created` (sorting)
- `idx_projects_is_visible` — Index on `is_visible` (filtering)
- `idx_projects_order_index` — Index on `order_index` NULLS LAST (hybrid sort)

**Row Level Security (RLS):**
- **SELECT:** Public read access for `is_visible = true` projects only
- **INSERT/UPDATE/DELETE:** Blocked for all users (admin via dashboard only)

**Triggers:**
- `updated_at` auto-updates on any row modification

### Type Generation

TypeScript types are auto-generated from the Supabase schema:

```bash
npm run db:types
```

This runs:
```bash
npx supabase gen types typescript --linked > lib/supabase/database.types.ts
```

**Result:** Full type safety for all Supabase queries:
```typescript
const { data, error } = await supabase
  .from('projects')  // ✅ Type-checked table name
  .select('*')
  .eq('is_visible', true);  // ✅ Type-checked column & value
```

### Data Seeding

**Script:** `scripts/seed-projects.js`

Imports existing `github.json` data into Supabase:

```bash
npm run db:seed
```

**Process:**
1. Reads `scripts/github.json`
2. Transforms data (adds `is_visible: true`, `order_index: null`)
3. Bulk inserts via `supabaseAdmin` (bypasses RLS)
4. Logs success summary

**One-time operation** — run once after initial Supabase setup.

### Setup Checklist

See `SUPABASE_SETUP.md` for full instructions:

1. ✅ Create Supabase project
2. ✅ Update `.env` with credentials
3. ✅ Run `supabase/migrations/001_create_projects_table.sql` in SQL Editor
4. ✅ Link project: `npx supabase link --project-ref xxxxx`
5. ✅ Generate types: `npm run db:types`
6. ✅ Seed data: `npm run db:seed`
7. ✅ Test: `npm run dev` → `/projects`

### Image Path Management

The `images` column supports **local paths** AND **external URLs**:

```sql
-- Local (Vercel CDN)
images = ARRAY['/images/projects/screenshot.png']

-- External CDN (requires next.config.js setup)
images = ARRAY['https://cdn.yoursite.com/screenshot.png']

-- Mixed (recommended)
images = ARRAY[
  '/images/projects/thumbnail.png',        -- Fast local hero
  'https://cdn.yoursite.com/gallery.png'   -- CDN for large files
]
```

**See:** `supabase/IMAGE_PATHS.md` for detailed guide.

## Hooks

### `hooks/useThemeSwitcher.jsx`

- Initializes `theme` from `localStorage.theme` (guarded by `typeof window !== 'undefined'`).
- `activeTheme` is the **opposite** of the current theme — i.e. it represents the *next* theme so the toggle UI says "click to switch to X".
- On every change: removes the `activeTheme` class from `<html>`, adds the current `theme`, and persists.

### `hooks/useScrollToTop.jsx`

- Adds a scroll listener on mount; flips `showScroll` when `window.pageYOffset` crosses 400.
- Returns a JSX `<FiChevronUp className="scrollToTop" />` (styled in `globals.css`) that smooth-scrolls to top on click.

### `components/hooks/useDecimalCountUp.jsx`

- Pure `requestAnimationFrame` linear interpolation from 0 → `endValue` over `duration` seconds.
- Returns a ref to attach to a `<span>`; writes `formattingFn(currentValue)` to `innerText` each frame.

## Reusable primitives

- **`PagesMetaHead`** — `<Head>` wrapper with `title`, `keywords`, `description` (defaults shipped).
- **`Modal`** — generic modal with `success` / `error` variant (green vs red title).
- **`Button`** — bare `<button>{title}</button>` — styling lives on the wrapping `<span>`.
- **`FormInput`** — labeled, required `<input />` with shared classes.

## Data pipeline

### `scripts/GenerateGithubInfo.py`

1. `GET /users/JPhlpL/repos?per_page=100&visibility=public` with `Authorization: token <PAT>`.
2. Skips forks, normalizes each repo to `{ project, description, language, date_created, stars, website, topics, repository_link }`.
3. Sorts by `stars` desc and writes to `github_repos.json`.

> The current `scripts/github.json` is the (slightly modified) artifact of this script. The site reads it via `/api/github`.

### `scripts/generateGithubContributionChart.py`

GraphQL query against `contributionsCollection` → emits `github_contributions.json` with:

- `total_contributions`
- `contributions_by_year`
- `contributions_by_month`
- `activity_overview` (commits, PRs, issues, code reviews, repos contributed to)

This dataset is **not yet wired to a page** — it's available for future use.

Both scripts read `GITHUB_TOKEN` from `.env.local` via `python-dotenv`.

## Environment variables

Used in the browser (must be `NEXT_PUBLIC_*` for Next.js to expose them):

| Var                                             | Purpose                              |
| ----------------------------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID`                | EmailJS service ID                   |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_NOTIFICATION`     | Template sent to the site owner      |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_CONFIRMATION`     | Template echoed back to the sender   |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`                | EmailJS public key                   |

Server-only (Python data scripts):

| Var             | Purpose                                                  |
| --------------- | -------------------------------------------------------- |
| `GITHUB_TOKEN`  | Personal access token for GitHub REST + GraphQL fetches  |

> ⚠ `components/contact/.env` currently holds the EmailJS keys at the **wrong location** — Next.js reads `.env.local` / `.env` from the project root, not from a component subfolder. See `plan.md`.

## Conventions

- File naming: `PascalCase.jsx` for components, `camelCase.js`/`.jsx` for hooks and data.
- Styling: utility-first Tailwind. Dark mode classes are written inline (`dark:bg-...`).
- Animation: per-section `motion.div` with `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}` is the dominant idiom.
- Accessibility: `aria-label` on most interactive elements; semantic `<nav>`, `<form>`, `<section>` used throughout.
