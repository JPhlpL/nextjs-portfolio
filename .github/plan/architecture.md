# Architecture

## Stack at a glance

| Layer            | Tech                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| Framework        | **Next.js 13** (Pages Router, `reactStrictMode: true`)               |
| UI               | **React 18**, **Tailwind CSS v3** (`darkMode: 'class'`), `@tailwindcss/forms` |
| Animation        | **Framer Motion** (`AnimatePresence`, page-level `motion.div` fades) |
| Icons            | **react-icons** (`Fi`, `Md`, `Gr` sets)                              |
| Misc UI          | `typewriter-effect` (dynamic, `ssr: false`), `react-vertical-timeline-component`, `react-tooltip`, `react-countup`, `react-intersection-observer`, `react-chrono` |
| Email            | `emailjs-com` (browser-side dual-template send)                      |
| IDs              | `uuid` (data records)                                                |
| Data pipeline    | **Python 3** scripts hitting GitHub REST + GraphQL APIs              |
| Linting          | `eslint` + `eslint-config-next`                                      |

## Runtime topology

```mermaid
flowchart TB
    Browser["Browser (Client)"]

    subgraph NextApp["Next.js App (Vercel / npm start)"]
        direction TB
        Pages["Static / SSR pages<br/>/, /about, /certificates,<br/>/accomplishments, /contact"]
        SSR["SSR route<br/>/projects/[project]<br/>(getServerSideProps)"]
        API["/api/github<br/>(Node API route)"]
        Static["Static assets<br/>/public/{fonts,images,files}"]
    end

    subgraph DataLayer["Build-time / repo data"]
        DataJS["data/*.js<br/>(bio, stack, certs,<br/>accomplishments)"]
        GhJSON["scripts/github.json<br/>(committed)"]
    end

    subgraph External["External services"]
        EmailJS["EmailJS<br/>(2 templates)"]
        GitHub["GitHub REST + GraphQL"]
    end

    PyScripts["Python scripts<br/>(GenerateGithubInfo.py,<br/>generateGithubContributionChart.py)"]

    Browser -->|HTML/JSON| Pages
    Browser -->|HTML/JSON| SSR
    Browser -->|fetch /api/github| API
    Browser -->|/files, /images, /fonts| Static
    Browser -->|emailjs.sendForm| EmailJS

    Pages --> DataJS
    SSR --> GhJSON
    API -->|fs.readFileSync| GhJSON

    PyScripts -->|REST + GraphQL| GitHub
    PyScripts -->|writes| GhJSON
```

## Routing & rendering modes

- All routes live under `pages/` (classic Pages Router — no `app/` directory).
- `pages/projects/[project].jsx` uses `getServerSideProps` to look up a repo by name from `scripts/github.json` (imported at build/server time).
- `pages/api/github.js` is a Node API route that streams the same `scripts/github.json` to the client.
- Every other page is statically rendered with client-side hydration; data either comes from `data/*.js` modules or is fetched at runtime (`/api/github`).

```mermaid
flowchart LR
    Root["pages/_app.jsx<br/>AnimatePresence + DefaultLayout"]

    Home["/"]
    About["/about"]
    Projects["/projects"]
    ProjectDetail["/projects/[project]<br/>SSR"]
    Certs["/certificates"]
    Accomp["/accomplishments"]
    Contact["/contact"]
    APIRoute["/api/github<br/>API route"]

    Root --> Home
    Root --> About
    Root --> Projects
    Root --> ProjectDetail
    Root --> Certs
    Root --> Accomp
    Root --> Contact

    Home --> Banner["AppBanner<br/>(Typewriter dynamic ssr:false)"]
    About --> AboutBio["AboutMeBio"]
    About --> AboutCounter["AboutCounter<br/>(useDecimalCountUp + react-countup)"]
    About --> AboutStack["AboutMainStack"]
    Projects --> Grid["ProjectsGrid<br/>fetch /api/github"]
    Grid --> APIRoute
    ProjectDetail -.->|getServerSideProps| GhJSON["scripts/github.json"]
    APIRoute -.->|fs.readFileSync| GhJSON
    Certs --> CertGrid["CertificatesGrid + CertificateCard"]
    Accomp --> Timeline["VerticalTimeline + carousel modal"]
    Contact --> CForm["ContactForm (emailjs)"]
    Contact --> CDetails["ContactDetails"]
```

## State management

There is **no global store** — state is local React state, with two cross-cutting concerns kept in custom hooks:

1. **`useThemeSwitcher`** (`hooks/useThemeSwitcher.jsx`) — toggles a `dark` / `light` class on `<html>` and persists to `localStorage.theme`. Tailwind's `darkMode: 'class'` reacts to this.
2. **`useScrollToTop`** (`hooks/useScrollToTop.jsx`) — listens to `window.scroll`, conditionally renders a chevron, smooth-scrolls to top.

A second component-local hook (`components/hooks/useDecimalCountUp.jsx`) wraps `requestAnimationFrame` for the years-of-experience counter on `/about`.

```mermaid
stateDiagram-v2
    [*] --> ReadStorage : mount
    ReadStorage --> Light : localStorage.theme == "light"
    ReadStorage --> Dark  : localStorage.theme == "dark"
    Light --> Dark : click toggle (Sun)
    Dark  --> Light : click toggle (Moon)
    Light : html.classList = ["light"]\nlocalStorage.theme = "light"
    Dark  : html.classList = ["dark"]\nlocalStorage.theme = "dark"
```

## Layout & theming

- `pages/_app.jsx` wraps every page in `AnimatePresence` → `<DefaultLayout>` → `<Component />` → `<UseScrollToTop />`.
- `components/layout/DefaultLayout.jsx` composes `PagesMetaHead` + `AppHeader` + children + `AppFooter`.
- Theme tokens (in `tailwind.config.js`):
  - Light: `primary-light #F7F8FC`, `secondary-light #FBFBFB`, `ternary-light #f6f7f8`
  - Dark:  `primary-dark  #0D2438`, `secondary-dark  #102D44`, `ternary-dark  #1E3851`
  - `gray` is overridden to Tailwind's `colors.neutral`.
- A complete **GeneralSans** font family is shipped in `public/fonts/` and registered in `styles/globals.css` (variable + per-weight `.woff2/.woff/.ttf` triplets).

## Data flow

| Surface                        | Source                                              | How it's read                              |
| ------------------------------ | --------------------------------------------------- | ------------------------------------------ |
| Bio paragraphs                 | `data/aboutMeData.js`                               | `import` in `AboutMeBio`                   |
| Tech stack tiles               | `data/mainStackData.js`                             | `import` in `AboutMainStack`               |
| Counters                       | Computed (`new Date()` math) + hard-coded `18`      | `AboutCounter` + `useDecimalCountUp`       |
| Certificates                   | `data/certificatesData.js`                          | `import` in `CertificatesGrid`             |
| Accomplishments timeline       | `data/accomplishmentsData.js`                       | `import` in `pages/accomplishments.jsx`    |
| Projects list                  | `scripts/github.json` ← Python script               | `fetch('/api/github')` in `ProjectsGrid`   |
| Project detail                 | `scripts/github.json` (server import)               | `getServerSideProps` in `[project].jsx`    |
| Contact form                   | EmailJS templates                                   | `emailjs.sendForm(serviceId, templateId, …)` with `NEXT_PUBLIC_*` keys |

### Projects list — request lifecycle

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Grid as ProjectsGrid
    participant API as /api/github
    participant FS as scripts/github.json

    User->>Browser: GET /projects
    Browser->>Grid: hydrate + useEffect()
    Grid->>API: fetch('/api/github')
    API->>FS: fs.readFileSync()
    FS-->>API: repos[]
    API-->>Grid: 200 JSON
    Grid->>Grid: derive languages, filter, paginate
    Grid-->>User: render 9 ProjectSingle cards
    User->>Grid: type in search / change language
    Grid->>Grid: re-filter in memory (no refetch)
```

### Contact form — EmailJS dual-send

```mermaid
sequenceDiagram
    actor User
    participant Form as ContactForm
    participant EJS as EmailJS

    User->>Form: submit form
    Form->>Form: e.preventDefault()
    par Notification (owner)
        Form->>EJS: sendForm(serviceId, NOTIFICATION, form, publicKey)
    and Confirmation (sender)
        Form->>EJS: sendForm(serviceId, CONFIRMATION, form, publicKey)
    end
    EJS-->>Form: Promise.all([result1, result2])
    alt success
        Form-->>User: <Modal type="success" />
        Form->>Form: e.target.reset()
    else error
        Form-->>User: <Modal type="error" message=error.text />
    end
```

### GitHub data refresh — offline pipeline

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant Py as GenerateGithubInfo.py
    participant GH as GitHub REST
    participant JSON as scripts/github.json
    participant Git as git

    Dev->>Py: python GenerateGithubInfo.py
    Py->>Py: load_dotenv('.env.local')<br/>read GITHUB_TOKEN
    Py->>GH: GET /users/JPhlpL/repos?per_page=100
    GH-->>Py: repos[] (paginated)
    Py->>Py: filter forks, normalize, sort by stars
    Py->>JSON: write JSON
    Dev->>Git: git add scripts/github.json && commit
```

## Build & dev scripts

```
npm run dev    # next dev — local @ :3000
npm run build  # next build
npm run start  # next start
npm run lint   # next lint
```

## External services

- **EmailJS** — `service_g6kwbpp` with two templates (notification to owner + confirmation to sender). Keys are exposed as `NEXT_PUBLIC_*` and read in `ContactForm.jsx`.
- **GitHub REST + GraphQL** — consumed offline by `scripts/*.py`; the resulting JSON is committed and served by the API route. The site itself never calls GitHub at request time.
- **Vercel** — implied deploy target (README links to `nextjs-tailwindcss-portfolio.vercel.app`; live profile linked to `jphlpl-portfolio-next.vercel.app`).

## Key architectural notes

- The project-detail route key is the GitHub **repo name** (`project.project`), not a numeric `id`. There is a `TODO` in `ProjectSingle.jsx` about migrating to `[id].jsx`.
- `data/projectsData.js` is **dead code** at the page level — current pages read GitHub data instead. It's preserved from the upstream template.
- Both `Modal` (success/error popup) and `HireMeModal` exist, but `HireMeModal` is **imported but not rendered** in `AppHeader.jsx` (no trigger wired up).
- The `Button` component (`components/reusable/Button.jsx`) is intentionally minimal — styling is applied by the parent `<span>` wrapper around it.
