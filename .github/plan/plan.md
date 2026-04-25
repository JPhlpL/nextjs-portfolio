# Plan

A consolidated backlog combining the existing `todo.md`, in-code `TODO`s, and observations from the codebase walkthrough.

## From `todo.md` (verbatim)

1. Generate again JSON file on GitHub API
2. Fix the projects single page by adding pictures on the other branch
3. Consolidate all accomplishments photos and upload them to S3 buckets
4. Create a separate page for accomplishments
5. Create page for Projects Deployed
6. Make the home page have an encoding effect
7. Add Logo for the `.ico`

> #4 ("separate page for accomplishments") is already shipped at `/accomplishments` — likely safe to strike.

## In-code TODOs

- `components/projects/ProjectSingle.jsx` — switch the dynamic route from `[project].jsx` to `[id].jsx` and use a stable numeric id instead of the repo name.
- `components/about/AboutCounter.jsx` — `projectsCounterRef`/`projectsCompleted` is commented out; decide whether to ship it or remove the dead lines.

## High-priority hygiene

### Security & secrets

- **`components/contact/.env` is in the wrong place.** Next.js does **not** auto-load `.env` files from component subfolders — it only loads `.env`, `.env.local`, `.env.development`, `.env.production` at the **project root**. The keys in `components/contact/.env` are therefore not actually feeding `process.env.NEXT_PUBLIC_*` at runtime, and the EmailJS form may be broken in any environment that hasn't manually set those vars elsewhere. Action items:
  1. Move the file to `/.env.local` at the repo root.
  2. Add `components/contact/.env` to `.gitignore` (it's currently untracked but easy to commit by accident).
  3. Although `NEXT_PUBLIC_*` keys are public-by-design, EmailJS templates accept abuse from anyone with the public key — consider EmailJS's "Allowed Origins" allowlist + reCAPTCHA.
- Add `.env*` (besides `.env.example`) to `.gitignore` more aggressively.

### Linting / build health

- Run `npm run lint` — ESLint is configured but no CI runs it.
- `next/image` is used in `pages/projects/[project].jsx` with `objectFit="contain"` (deprecated since Next 13). Migrate to `style={{ objectFit: 'contain' }}` or the new `fit` prop.
- `pages/api/github.js` uses `fs.readFileSync` on every request — fine in practice but a one-line `import data from '../../scripts/github.json'` would be lighter and cacheable.

### Dead code / cleanup

- Delete `data/projectsData.js` (no consumers).
- Either render `HireMeModal` from a "Hire Me" button in `AppHeader`, or remove the import.
- Strip the commented-out `projectsCounterRef` block from `AboutCounter.jsx`.
- `PagesMetaHead.defaultProps` has a duplicate `keywords` key — second one silently wins; pick one.
- `pages/about.jsx`, `pages/contact.jsx` use lowercase function names (`about`, `contact`) — convention is PascalCase (`About`, `Contact`); React DevTools also prefers it.

## Feature roadmap

### Quick wins

- Add a **favicon** + `apple-touch-icon` and re-enable the `<link rel="icon">` in `PagesMetaHead.jsx` (todo.md item 7).
- Add **`<meta property="og:*">`** + Twitter card tags in `PagesMetaHead` for richer link previews.
- Re-run `scripts/GenerateGithubInfo.py` and refresh `scripts/github.json` (todo.md item 1) — wire it into a GitHub Action so it auto-refreshes weekly.
- Wire the home page **encoding/decoding text effect** (todo.md item 6) — already have `typewriter-effect`; could also use `react-typewriter` or a custom Matrix-style decode.
- Add a custom **logo/wordmark** to the header (currently only the theme toggle sits on the left).

### Project pages

- Migrate `[project].jsx` → `[id].jsx` and update `ProjectSingle` link target (in-code TODO).
- Show project images on the detail page (todo.md item 2). Per-project photos could either come from a new field in `github.json` (manually curated) or a convention like `public/images/projects/<slug>/*.jpg`.
- Add a **Projects Deployed** page (todo.md item 5) — filter `github.json` by non-empty `website` or by topic tag like `deployed`.
- Show **stars / topics** badges on the card view too, not just the detail view.
- Add `getStaticPaths` + `getStaticProps` so detail pages can be statically generated; `getServerSideProps` is overkill for a JSON lookup.

### Accomplishments

- Migrate accomplishment images to **S3** (todo.md item 3) and update `accomplishmentsData.js` URLs.
- Extract the inline modal/carousel from `pages/accomplishments.jsx` into a reusable `<TimelineEntryModal />` (the same carousel logic could also benefit `[project].jsx`).

### Contact

- Replace the dual `emailjs.sendForm` + `Promise.all` race with a single template that BCCs the owner — fewer API calls and simpler error UX.
- Add **honeypot** + client-side validation (current implementation only relies on `required`).
- Disable the submit button while the request is in flight.

### Stats / activity

- Surface the contents of `scripts/github_contributions.json` somewhere — e.g. an "Activity" panel on `/about` showing total commits, PRs, issues, repos contributed to (it's already generated).
- Add a real GitHub contribution heat-map (the script name implies one was planned).

### UX & polish

- Loading state for `ProjectsGrid` (currently shows an empty grid until `fetch` resolves).
- Empty state when `filteredProjects.length === 0` (e.g. "No projects match your search").
- Memoize `languages` and `filteredProjects` derivations with `useMemo` if the projects list grows.
- Add page-transition animations between routes (you already wrap in `AnimatePresence`; per-page `motion.div` with `exit` props would actually animate transitions).
- Re-add the "Back to Top" affordance with proper styling — `useScrollToTop` works but the default `scrollToTop` CSS makes it a fixed full-width bar, which is unusual.

### Engineering

- Add a CI workflow (`.github/workflows/ci.yml`) running `npm ci && npm run lint && npm run build`.
- Add a **GitHub Actions** workflow that runs the Python scripts on a schedule and commits the refreshed JSON (use a fine-grained PAT stored as `GITHUB_TOKEN` repo secret).
- Add Prettier config matching the existing tab/single-quote style for consistent formatting.
- Migrate to **TypeScript** progressively (start with `data/*.ts` and shared types for the GitHub project shape).
- Consider migrating to the **App Router** (`app/`) for file-system layouts, server components, and built-in metadata API.

## Stretch / nice-to-haves

- Internationalization (Tagalog + English).
- Blog or notes section (`/notes`) backed by MDX.
- A `/uses` page listing tools and gear.
- Wire `react-tooltip` (already a dependency) onto stack tiles to show short descriptions on hover.
- Add Plausible or Vercel Analytics for traffic insights.

## Active initiatives

### Supabase migration (Status: 📋 Planning)

**Goal:** Replace static JSON files with Supabase PostgreSQL database, starting with projects data.

**See:** [`supabase-migration-plan.md`](./supabase-migration-plan.md) for full 5-phase implementation guide.

**Key architectural decisions:**
- **Read-only app:** Next.js only performs GET operations; all modifications via Supabase dashboard
- **Standard column pattern:** Every table includes `is_visible` (boolean) + `order_index` (integer)
- **Hybrid sorting:** Manual pins first (order_index 1, 2, 3...), then auto-sort by stars/date

**Quick summary:**
1. Install `@supabase/supabase-js` + Supabase CLI, create typed client utilities
2. Design `projects` table schema with `is_visible` + `order_index` columns
3. **Generate TypeScript types** from database schema (`npm run db:types`)
4. Seed data from `scripts/github.json`
5. Replace `/api/github` with `/api/projects` (typed Supabase read-only client)
6. Test, benchmark, update docs, cleanup old JSON

**Benefits:**
- Dynamic data updates without redeploying
- **Full TypeScript type safety** for all database operations
- Curate featured projects with `order_index`
- Hide drafts with `is_visible = false`
- Scalable pattern for certificates, accomplishments, etc.
- Queryable with filters, pagination, full-text search
- Auto-complete for table/column names in IDE

**Timeline:** ~4.5 hours estimated

**Future tables:** The `is_visible` + `order_index` pattern will be applied to certificates and accomplishments tables when those are migrated.

---

## Definition of done for this planning pass

- [x] `structure.md` — directory map
- [x] `architecture.md` — stack, topology, data flow (with Mermaid diagrams)
- [x] `implementation.md` — per-route wiring
- [x] `contents.md` — data inventory
- [x] `plan.md` — backlog (this file)
- [x] `changelog.md` — historical record + planning log
- [x] `supabase-migration-plan.md` — database migration strategy
