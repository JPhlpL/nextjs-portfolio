# Project Structure

A high-level map of the repository layout, what lives in each directory, and the role each file plays.

## Repository Root

```
nextjs-portfolio/
├── .eslintrc.json                # ESLint config (extends next/core-web-vitals)
├── .github/
│   └── plan/                     # Project planning & documentation (this folder)
├── .gitignore                    # Standard Next.js ignores
├── CODE_OF_CONDUCT.md            # Contributor Covenant
├── CONTRIBUTING.md               # Contribution guidelines (upstream template)
├── LICENSE                       # MIT
├── README.md                     # Setup + feature overview
├── SECURITY.md                   # Vulnerability reporting policy
├── SUPABASE_SETUP.md             # Step-by-step Supabase configuration guide
├── components/                   # React UI components (see below)
├── data/                         # Static JS data sources for the UI
├── hooks/                        # Top-level reusable React hooks
├── lib/
│   └── supabase/                 # Supabase client utilities
│       ├── client.ts             # Read-only typed client for app (browser-safe)
│       ├── server.ts             # Admin typed client for seeding scripts (server-only)
│       └── database.types.ts     # Auto-generated TypeScript types (run: npm run db:types)
├── next.config.js                # Next.js config (reactStrictMode: true)
├── nextjs-portfolio.code-workspace
├── package.json                  # Dependencies + npm scripts
├── package-lock.json
├── pages/                        # Next.js Pages Router routes
├── postcss.config.js             # PostCSS (tailwindcss + autoprefixer)
├── public/                       # Static assets served at site root
├── scripts/                      # Python utilities for GitHub data
├── styles/
│   └── globals.css               # Tailwind base + custom @font-face declarations
├── supabase/
│   ├── README.md                       # Supabase workflow guide
│   ├── IMAGE_PATHS.md                  # Image path management (local vs CDN)
│   ├── migrations/                     # Database schema version history
│   │   ├── 001_create_projects_table.sql
│   │   ├── 002_create_certificates_table.sql      # Future
│   │   └── 003_create_accomplishments_table.sql   # Future
│   └── seeds/                          # SQL templates for manual data entry
│       ├── projects_seed_template.sql
│       ├── certificates_seed_template.sql         # Future
│       └── accomplishments_seed_template.sql      # Future
├── tailwind.config.js            # Theme tokens (colors, container) + forms plugin
└── todo.md                       # Personal punch list (see plan.md)
```

## `pages/` — Next.js Pages Router

```
pages/
├── _app.jsx                      # Wraps app in AnimatePresence + DefaultLayout + scroll-to-top
├── about.jsx                     # /about — bio, counters, current stack
├── accomplishments.jsx           # /accomplishments — vertical timeline + carousel modal
├── contact.jsx                   # /contact — ContactForm + ContactDetails (two-column)
├── index.jsx                     # / — AppBanner hero + Typewriter
├── api/
│   ├── github.js                 # /api/github — reads scripts/github.json (LEGACY - to be removed)
│   └── projects.ts               # /api/projects — Supabase-powered projects endpoint (NEW)
├── certificates/
│   └── index.jsx                 # /certificates — searchable + highlightable grid
└── projects/
    ├── index.jsx                 # /projects — paginated, searchable, language-filtered grid
    └── [project].jsx             # /projects/[project] — SSR detail page (lookup by repo name)
```

## `components/`

```
components/
├── HireMeModal.jsx               # Hire-me dialog (motion modal, project-type form)
├── PagesMetaHead.jsx             # next/head wrapper with title/keywords/description defaults
├── about/
│   ├── AboutCounter.jsx          # Years-of-experience + projects-developed counters
│   ├── AboutMainStack.jsx        # Renders the current-stack grid
│   ├── AboutMainStackSingle.jsx  # Single stack tile (next/image)
│   ├── AboutMeBio.jsx            # Profile photo + multi-paragraph bio
│   └── CounterItem.jsx           # Counter tile primitive (title + value)
├── certificates/
│   ├── CertificateCard.jsx       # Image card (highlighted = yellow title)
│   └── CertificateGrid.jsx       # Search + "Only Highlighted" filter + modal viewer
├── contact/
│   ├── .env                      # ⚠ EmailJS keys (currently untracked — see plan.md)
│   ├── ContactDetails.jsx        # Address / email / phone with icons
│   └── ContactForm.jsx           # EmailJS dual-template send (notification + confirmation)
├── hooks/
│   └── useDecimalCountUp.jsx     # rAF-based decimal counter (used by AboutCounter)
├── layout/
│   └── DefaultLayout.jsx         # Header + children + Footer scaffold
├── projects/
│   ├── ProjectsGrid.jsx          # Fetches /api/github, search/filter/paginate
│   └── ProjectSingle.jsx         # Card linking to /projects/[project]
├── reusable/
│   ├── Button.jsx                # Bare <button>{title}</button> primitive
│   ├── FormInput.jsx             # Labeled text input
│   └── Modal.jsx                 # Generic success/error dialog (used by ContactForm)
└── shared/
    ├── AppBanner.jsx             # Home hero: name, Typewriter roles, CV download
    ├── AppFooter.jsx             # Social links (Globe / GitHub / LinkedIn / Facebook)
    └── AppHeader.jsx             # Nav, theme toggle, mobile hamburger
```

## `hooks/` (top-level)

```
hooks/
├── useScrollToTop.jsx            # Floating chevron when scrollY > 400
└── useThemeSwitcher.jsx          # Reads/writes localStorage.theme + toggles <html> class
```

## `data/` — UI content sources

```
data/
├── aboutMeData.js                # 5-paragraph bio (used by AboutMeBio)
├── accomplishmentsData.js        # Timeline entries (date, title, image[s], icon, styles)
├── certificatesData.js           # 26 certificate records (title, image, skills, highlight)
├── mainStackData.js              # 16 tech-stack icons (used by AboutMainStack)
└── projectsData.js               # Legacy/sample project records (NOT consumed by current pages)
```

> Note: `projects/[project].jsx` and `ProjectsGrid.jsx` consume `scripts/github.json` (via `/api/github`), not `projectsData.js`.

## `public/`

```
public/
├── files/
│   └── resume.pdf                # Linked from AppBanner "Download CV"
├── fonts/                        # Full GeneralSans family (woff2/woff/ttf, all weights + italics)
├── images/
│   ├── accomplishments/          # Photos referenced by accomplishmentsData
│   ├── certificates/             # Photos referenced by certificatesData
│   ├── projects/                 # Sample project images (legacy)
│   ├── stacks/                   # Logos for mainStackData
│   └── profile.jpeg              # AboutMeBio portrait
```

## `scripts/` — GitHub data pipeline (Python) + Seeding (Node.js)

```
scripts/
├── .gitignore
├── GenerateGithubInfo.py         # Pulls /users/<USERNAME>/repos → github_repos.json
├── generateGithubContributionChart.py  # GraphQL contributions → github_contributions.json
├── github.json                   # Merged output (projects currently consumed by /api/github)
├── github_contributions.json     # Contribution heatmap data
├── github_repos.json             # Raw repo metadata
├── requirements.txt              # python-dotenv, requests
└── seed-projects.js              # Node.js script to import github.json → Supabase (run: npm run db:seed)
```
├── github.json                   # ★ Committed dataset consumed by /api/github
├── github_contributions.json     # Committed contribution metrics (not yet wired to UI)
└── requirements.txt              # requests, python-dotenv, beautifulsoup4, ...
```

## `styles/`

```
styles/
└── globals.css                   # Tailwind directives, GeneralSans @font-face set,
                                  # .scrollToTop styling, vertical-timeline overrides
```

## `supabase/` — Database schema & seeds

```
supabase/
├── migrations/                   # Version-controlled schema changes
│   ├── 001_create_projects_table.sql
│   ├── 002_create_certificates_table.sql      # Future
│   └── 003_create_accomplishments_table.sql   # Future
└── seeds/                        # SQL templates for manual data entry
    ├── projects_seed_template.sql
    ├── certificates_seed_template.sql         # Future
    └── accomplishments_seed_template.sql      # Future
```

**Naming conventions:**
- Migrations: `NNN_description.sql` (sequential numbering, e.g., 001, 002, 003...)
- Seeds: `{table}_seed_template.sql` (reusable templates with examples)

**Workflow:**
1. Create migration file with schema changes
2. Run in Supabase SQL Editor
3. Use seed template for adding data manually
4. Version control both migrations and templates

**Future tables:** Every table will follow the standard pattern:
- `is_visible` BOOLEAN (show/hide control)
- `order_index` INTEGER (manual sort order)
- `created_at` / `updated_at` (audit trail)

**Image/media columns:** Use `TEXT` or `TEXT[]` for paths, supporting both:
- Local paths: `/images/projects/file.png` (served from Vercel CDN)
- External URLs: `https://cdn.yoursite.com/file.png` (requires `next.config.js` domain config)
- Mixed: Can combine both in same array for optimal performance (local thumbnails + CDN galleries)
