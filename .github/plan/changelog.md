# Changelog

Reconstructed from `git log`. Format roughly follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and groups related commits into phases.

## [Unreleased]

### Working tree (per `git status` at planning time)

- Modified: `nextjs-portfolio.code-workspace`, `package-lock.json`
- Untracked: `components/contact/.env` (EmailJS keys — should be moved to `.env.local` at the repo root and ignored; see `plan.md`)

### Added

- This `.github/plan/` documentation set:
  - `structure.md`, `architecture.md`, `implementation.md`, `contents.md`, `plan.md`, `changelog.md`

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
