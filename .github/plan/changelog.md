# Changelog

A living history of changes, improvements, and plans for the portfolio application. This log tracks both completed work (via git commits) and ongoing planning/design decisions.

Format inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased] — In Progress

### 2026-04-25 02:56 — Implementation: Supabase migration (COMPLETED)

**Status:** ✅ Code complete — Ready for user setup and testing

**Objective:** Migrate from static JSON files to Supabase as the primary data source for projects.

**Changes implemented:**

- **Phase 1 — Infrastructure setup (COMPLETED):**
  - ✅ Installed `@supabase/supabase-js` v2.x
  - ✅ Installed `supabase` CLI as dev dependency for type generation
  - ✅ Created `lib/supabase/client.ts` — Read-only typed client for browser/API routes
  - ✅ Created `lib/supabase/server.ts` — Admin client for seeding scripts (bypasses RLS)
  - ✅ Created `lib/supabase/database.types.ts` — TypeScript types (placeholder, will be auto-generated)
  - ✅ Updated `.env` with Supabase environment variables (placeholders for user)
  - ✅ Added `db:types` script to `package.json`: `npm run db:types`
  - ✅ Added `db:seed` script to `package.json`: `npm run db:seed`

- **Phase 2 — Database schema (READY):**
  - ✅ Migration file created: `supabase/migrations/001_create_projects_table.sql`
  - ✅ Seed template created: `supabase/seeds/projects_seed_template.sql`
  - ✅ `supabase/README.md` created with workflow documentation
  - ✅ `supabase/IMAGE_PATHS.md` created with image path management guide
  - ⏳ **User action required:** Execute migration in Supabase SQL Editor

- **Phase 2.5 — TypeScript types (READY):**
  - ✅ Placeholder types created in `lib/supabase/database.types.ts`
  - ⏳ **User action required:** Run `npm run db:types` after migration to generate actual types

- **Phase 3 — Code migration (COMPLETED):**
  - ✅ Created `/api/projects.ts` endpoint with typed Supabase queries
    - Filters by `is_visible = true`
    - Sorts by `order_index ASC NULLS LAST` → `stars DESC` → `date_created DESC`
    - Returns TypeScript-validated `Project[]` array
  - ✅ Updated `components/projects/ProjectsGrid.jsx` to fetch from `/api/projects`
  - ✅ Updated `pages/projects/[project].jsx` to use Supabase `getServerSideProps`
    - Replaced JSON import with Supabase query
    - Added `is_visible = true` filter for public access
    - Maintains existing UI and gallery functionality

- **Phase 4 — Data seeding (READY):**
  - ✅ Created `scripts/seed-projects.js` with:
    - Automatic data transformation from `github.json`
    - Sets all projects to `is_visible = true`, `order_index = null`
    - Uses admin client to bypass RLS
    - Comprehensive logging and error handling
  - ⏳ **User action required:** Run `npm run db:seed` after Supabase setup

- **Phase 5 — Setup guide (COMPLETED):**
  - ✅ Created `SUPABASE_SETUP.md` with step-by-step instructions:
    - Supabase project creation
    - API key configuration
    - Project linking for type generation
    - Migration execution
    - Verification checklist
    - Troubleshooting guide

**Files created:**
- `lib/supabase/client.ts` — Read-only Supabase client
- `lib/supabase/server.ts` — Admin Supabase client
- `lib/supabase/database.types.ts` — TypeScript type definitions
- `pages/api/projects.ts` — New Supabase-powered API endpoint
- `scripts/seed-projects.js` — Data import script
- `SUPABASE_SETUP.md` — Complete setup guide
- `supabase/IMAGE_PATHS.md` — Image path management guide

**Files modified:**
- `.env` — Added Supabase environment variables
- `package.json` — Added `db:types` and `db:seed` scripts
- `components/projects/ProjectsGrid.jsx` — Updated API endpoint to `/api/projects`
- `pages/projects/[project].jsx` — Migrated to Supabase queries

**Architecture changes:**
- **Read-only app pattern:** Next.js only performs GET operations
- **Type safety:** Full TypeScript integration with auto-generated types
- **Hybrid sorting:** Manual order → popularity → recency
- **Visibility control:** `is_visible` column for draft/published states
- **Flexible images:** Supports local paths and external CDN URLs

**User action required to complete setup:**
1. ✅ Create Supabase project at https://supabase.com
2. ✅ Update `.env` with actual Supabase credentials
3. ✅ Run migration: Execute `supabase/migrations/001_create_projects_table.sql` in SQL Editor
4. ✅ Link project: `npx supabase link --project-ref xxxxx`
5. ✅ Generate types: `npm run db:types`
6. ✅ Seed data: `npm run db:seed`
7. ✅ Test: `npm run dev` and visit `/projects`

**See:** `SUPABASE_SETUP.md` for detailed instructions.

---

### 2026-04-25 00:57 — Planning: Supabase migration documentation

**Status:** 📋 Planning phase (now superseded by implementation above)

**Objective:** Migrate from static JSON files to Supabase as the primary data source for projects.

**Changes planned:**

- **Phase 1 — Infrastructure setup:**
  - Install `@supabase/supabase-js` package
  - Create Supabase client utilities (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
  - Configure environment variables in `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)

- **Phase 2 — Database schema:**
  - Design `projects` table with columns: `id` (uuid), `project` (unique name), `description`, `language`, `date_created`, `stars`, `images` (text[]), `website`, `topics` (text[]), `repository_link`, **`is_visible` (boolean)**, **`order_index` (integer)**, `created_at`, `updated_at`
  - Create indexes on `project`, `language`, `date_created`, **`is_visible`**, **`order_index`** for optimal query performance
  - Enable Row Level Security (RLS) with public read access **for visible projects only**, admin-only writes
  - Add `updated_at` auto-update trigger

- **Phase 3 — Code migration:**
  - Create new `/api/projects` endpoint to replace `/api/github` (filters by `is_visible = true`, sorts by `order_index` → `stars` → `date_created`)
  - Update `components/projects/ProjectsGrid.jsx` to fetch from new endpoint
  - Migrate `pages/projects/[project].jsx` from JSON import to Supabase query (with `is_visible` check)
  - Consider migrating to `getStaticPaths` + `getStaticProps` with ISR for better performance

- **Phase 4 — Data seeding:**
  - Create `scripts/seed-projects.ts` to bulk-import `scripts/github.json` → Supabase
  - All existing projects default to `is_visible = true`, `order_index = null` (auto-sort)
  - Add `npm run seed:projects` script
  - Install `tsx` for TypeScript script execution

- **Phase 5 — Testing & cleanup:**
  - Validate all project pages load correctly
  - Verify hidden projects (`is_visible = false`) don't appear in lists or detail pages
  - Performance benchmark (response times, TTI)
  - Update architecture documentation to reflect new data flow
  - Archive/delete `scripts/github.json` and `pages/api/github.js` after stable migration

**Documentation added:**
- `.github/plan/supabase-migration-plan.md` — comprehensive 5-phase migration guide with SQL schema, code examples, testing checklist, rollback plan, and timeline estimate (~4 hours)
- `.github/plan/README.md` — navigation guide for all planning docs
- **`supabase/` folder structure:**
  - `supabase/migrations/001_create_projects_table.sql` — complete table schema with RLS and triggers
  - `supabase/seeds/projects_seed_template.sql` — reusable SQL template with examples

**Latest updates (2026-04-25 00:57):**
- **Image path versatility documented:** Added comprehensive documentation on mixing local and external URL paths for images
  - `images` column (TEXT[]) supports any string format: local paths, external URLs, or mixed
  - Component design already handles both types automatically
  - No code changes needed to switch between local and external
  - Performance comparison: local ~300ms, external ~500ms, both cache to ~50ms
  - Hybrid strategy recommended: local thumbnails (fast) + CDN galleries (smaller repo)
  - Added Phase 5.5 "Image Management Strategy" with migration workflows
  - Documented `next.config.js` remotePatterns configuration for external URLs
  - Optimization tips: priority loading, blur placeholders, responsive sizes
  - Cloudflare R2 recommended as CDN (free, fast, zero egress fees)
- **TypeScript type generation:** Added Phase 2.5 for generating database types using Supabase CLI
  - Install Supabase CLI: `npm install -D supabase`
  - Generate types: `npx supabase gen types typescript --linked > lib/supabase/database.types.ts`
  - Updated client utilities to use typed `createClient<Database>`
  - Export convenience types: `export type Project = Tables<'projects'>`
  - All API endpoints and components now use typed Supabase clients
  - Added `npm run db:types` script to regenerate types after schema changes
  - Types are committed to version control for team access
  - TypeScript validates all column names, types, and query results
- **Migration file structure:** Created `supabase/` folder for organizing database schemas
  - `supabase/migrations/NNN_description.sql` — version-controlled schema changes
  - `supabase/seeds/{table}_seed_template.sql` — reusable SQL templates for manual data entry
  - Naming convention: sequential numbered migrations (001, 002, 003...)
  - Each migration is self-contained and can be run in any Supabase project
- **Architectural decision: Read-only app** — Next.js app will only perform GET operations. All data modifications (INSERT/UPDATE/DELETE) will be done directly in Supabase dashboard or SQL editor.
- **Standard column pattern established** — All future table migrations will include `is_visible` (boolean) and `order_index` (integer) for consistent visibility control and manual ordering.
- Added `is_visible` boolean column to control project visibility (draft mode)
- Added `order_index` integer column for custom manual sort order
- Sort behavior: projects with `order_index` appear first (1, 2, 3...), then auto-sort by stars/date (nulls last)
- Updated RLS policy to only show visible projects publicly; all write policies block app access
- Added indexes on `is_visible` and `order_index` for filter/sort performance
- Updated API endpoint to order by `order_index` → `stars` → `date_created`
- Seed script defaults all existing projects to `is_visible = true`, `order_index = null`
- Added data management workflow documentation (SQL examples for common operations)
- Future table migrations (certificates, accomplishments) will follow same pattern with migration files, seed templates, and type generation

**Next steps:**
1. Create Supabase project
2. Run schema SQL in Supabase SQL Editor
3. Install dependencies and create client utilities
4. Begin Phase 3 code migration

**Related:** See `supabase-migration-plan.md` for full implementation details.

---

### 2026-04-24 — Documentation: Project planning suite

**Added:**

- **`.github/plan/` documentation set** — comprehensive project documentation:
  - `structure.md` — directory tree with role of each file/folder
  - `architecture.md` — stack table, runtime topology, routing modes, state management, data flow, build scripts, external services, architectural notes
  - `implementation.md` — per-route implementation details, hooks, reusable primitives, data pipeline, environment variables, conventions
  - `contents.md` — inventory of bio, certificates (26 entries), accomplishments (15 timeline entries), projects, stack icons (16), fonts, static assets
  - `plan.md` — consolidated backlog from `todo.md`, in-code TODOs, hygiene items, feature roadmap, stretch goals
  - `changelog.md` — this file (historical record + ongoing planning log)

**Improved:**

- **`architecture.md` — Added Mermaid diagrams:**
  - Runtime topology flowchart (browser → Next.js app → data sources → external services)
  - Routing & rendering modes flowchart (page tree from `_app.jsx` to leaf components)
  - Theme switcher state machine (Light ⇄ Dark with localStorage persistence)
  - Projects list request lifecycle sequence diagram (user → browser → API → filesystem)
  - Contact form EmailJS dual-send sequence diagram (parallel notification + confirmation templates)
  - GitHub data refresh offline pipeline sequence diagram (developer → Python → GitHub → git)

**Rationale:** Establish a single source of truth for project structure, architecture decisions, and planned improvements. Diagrams make data flow and system interactions more accessible.

---

## [Released] — Completed Work

### 2025-05-07 — Resume refresh

**Changed:**
- Updated `/public/files/resume.pdf` with latest experience and skills

**Commit:** `3bbf938`

---

## 2025-05-07 — Resume refresh

- `3bbf938` — updated resume

## 2025-04-17 → 2025-04-18 — Typewriter hero (`feature/add-typewriting-effect`)

- `c883687` — added typewriting effect on home page; added link on old profile
- `232c1d6` — modified stack
- `efe4ae0` — merge PR #4 into main
- `afbb0fe` — removed `deleteAll` on the last typewriter step (last role no longer wipes)

## 2025-04-11 → 2025-04-14 — Projects polish

- `5b04117` — added simple carousel effect
- `83c818f` — better wording / position of year
- `f170a21` — refactored Projects, removed unused resources
- `dfc1d80` — updated GitHub data dump (`scripts/github.json`)
- `698f7bc` — added Taja AI accomplishment photos
- `88bcdee` — added pagination ("Items Per Page") on `ProjectsGrid` (constant `ITEMS_PER_PAGE = 9`)
- `1b99d1e` — updated resume

## 2025-04-09 → 2025-04-10 — Accomplishments timeline (`feature/add-accomplishments`)

- `1e44432` — initial timeline portion
- `ec3dcf5` — theme tweak comments
- `476fda1` — initial `react-vertical-timeline`
- `1051df3` — fix white lines / theme switcher background in light mode
- `b97c984` — much better timeline UI
- `de1d64d` — added accomplishment pictures and modified the page
- `a31dce8` — added footer items + accomplishments tweaks
- `f25ba8f` — added `todo.md` + further `accomplishmentsData.js` work
- `d00ee64` — merge PR #3 (`feature/add-accomplishments`)
- `929b41f` — merge PR #2 from `master`
- `1017a2b` — merge `feature/add-accomplishments` into `master`

## 2025-04-08 → 2025-04-09 — Certificates page (`feature/add-certificates`)

- `1f97a77` — initial Certificates page
- `866ac5d` — full functionality for certificates (search, "Only Highlighted", modal viewer)
- `b32bf55` — merge PR #1 (`feature/add-certificates`)
- `0a68fb2` — initial accomplishments stub (college-era entries)

## 2025-03-25 → 2025-03-26 — Contact form + EmailJS

- `54c5c64` — EmailJS added
- `66fe287` — Contact form expanded; success/error modal added
- `42da4b5` — theme switcher placement fix on mobile
- `a8218a1` — Removed "Portfolio" text on Index, replaced Brand → Stack, fixed About + Contact info, added profile counter
- `fec8be8` — `ContactForm.jsx` update

## 2025-03-22 — Mobile nav polish

- `7f0a56f` — line break between menu items
- `4e05781` — spaces on mobile view
- `457cae4` — `/projects` page is now accessible

## 2025-03-13 → 2025-03-15 — GitHub data + projects scaffolding

- `bc2dbda` — Initial Commit (forked/seeded from upstream `nextjs-tailwindcss-portfolio`)
- `fcb9f82` — fix hydration on logo
- `51726cc` — remove icon for now
- `50c747f` — README update
- `212e205` — added Python script for fetching GitHub profile data
- `4c496d7` — added GitHub JSON fetching data
- `45a98e9` — UI improvements (mini buttons, links); flagged `[id]` link migration
- `3460381` — added real resume; "Unknown" language fix

---

## Pre-history

The repository was forked / seeded from [realstoman/nextjs-tailwindcss-portfolio](https://github.com/realstoman/nextjs-tailwindcss-portfolio) (`bc2dbda` — "Initial Commit", 2025-03-13). All commits prior to that originate from the upstream template (legacy `data/projectsData.js`, `CONTRIBUTING.md`, `LICENSE`, etc. still reference the original author).
