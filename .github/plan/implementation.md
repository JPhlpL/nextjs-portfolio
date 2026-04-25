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

1. `useEffect` calls `fetch('/api/github')` → populates `projects` state.
2. Derives unique `languages` (treating null language as `"Unknown"`).
3. Filters by:
   - `searchProject` — substring match across `project`, `language`, `topics`, `website`, `repository_link`.
   - `selectedLanguage` — exact match (or `null` when "Unknown" is selected).
4. Paginates 9 per page; renders `<` 1 2 3 ... `>` controls.
5. Each card is `<ProjectSingle />` — a `motion.div` linking to `/projects/${project.project}`.

### `/projects/[project]` — `pages/projects/[project].jsx`

- `getServerSideProps` reads the `project` query param and finds the matching object in the imported `scripts/github.json`. Returns `{ notFound: true }` if missing.
- Renders header (title, date, language, topics), description, "View Repository" + "Visit Website" buttons.
- If `project.images` exists, renders a 3-column gallery; clicking opens a full-screen `Image` modal with click-outside-to-close.

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

### `/api/github` — `pages/api/github.js`

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
