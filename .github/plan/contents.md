# Contents Inventory

What ships in the site today — bios, certificates, accomplishments, projects, stack, and assets.

## Identity (footer / contact)

- **Name:** John Philip Lominoque
- **Email:** johnphilipomamalin1206@gmail.com
- **Phone:** +63-955-529-8033
- **Location:** Calamba City, Laguna, Philippines
- **Profiles:**
  - https://jphlpl-portfolio-next.vercel.app/
  - https://jphlpl.github.io/
  - https://github.com/JPhlpL
  - https://www.linkedin.com/in/jplominoque/
  - https://www.facebook.com/Lipip.JP/

## Home (`AppBanner`)

Typewriter rotation:

1. IT Consultant
2. Fullstack Developer
3. Software Engineer

Download CTA → `/files/resume.pdf`.

## Bio (`data/aboutMeData.js`)

5 paragraphs covering:

1. ~5 yrs of backend (Python/FastAPI, Java/Spring Boot, PHP/Laravel, C#/ASP.NET) and frontend (Next.js, TypeScript, React, Angular, JS, HTML, CSS) plus DBs (MySQL, MariaDB, SQLite, PostgreSQL, MSSQL, MongoDB).
2. Cross-stack work: Python, UiPath, Power Automate / Power Apps / SharePoint, Unity (C#), ESP32 (C++).
3. CI/CD & cloud: Git, Gitea, Git Kraken, Jira, GitHub, Docker, Postman, AWS (EC2, RDS, DynamoDB, CloudWatch, Lambda, S3, IoT Core), Azure DevOps.
4. REST API design + technical documentation (flow charts, ERDs); SDLC: Agile, Waterfall, Kanban.
5. Closing: quality, reliability, efficiency.

## Counters (`AboutCounter`)

| Stat                              | Source                          |
| --------------------------------- | ------------------------------- |
| Years of experience               | Computed from `2019-09-01` → now (decimal, 1 dp) |
| Projects Developed & Involved     | Hard-coded `18`                 |

## Current stack (`data/mainStackData.js`)

16 logos: FastAPI, Laravel, NextJS, Java, Python, TypeScript, MySQL, PostgreSQL, Supabase, AWS, Azure, Modal, Vercel, Docker, GitHub, Nginx.

## Certificates (`data/certificatesData.js`)

26 entries. Highlighted (yellow title) ones:

- Certificate of Employment: Taja AI
- Certificate of Employment: Denso Philippines Corporation
- Civil Service Passer: Certification of Eligibility
- My Senior Promotion Certification on Denso Philippines Corporation
- Diploma: Bachelor of Science in Computer Science

Other notable ones (with skills tagged):

- Young Leaders Development Program — Leadership / Team Building / Communication
- MySQL Development and Administration — MySQL / Triggers / Function / Indexing / DBA / DDL / DML
- Developing on AWS — S3, VPC, EC2, ECS, Lambda, Kinesis, SNS, Cognito, Amplify, API Gateway, RDS, DynamoDB
- AWSome Day, AWS Cloud Practitioner Essentials
- Advance Python Programming — Python, FastAPI, Django, Mypy, multithreading, OOP, scripting, data structures
- Microsoft Azure Security Technologies
- The Third / The First Data Privacy & Cybersecurity Professionals' Summit
- Power Apps / Power Automate / Power BI Training
- UiPath Robotic Process Automation
- Smart Greenhouse Farming Solutions — AgriTech, IoT, sustainable farming
- PHP Web Development Training — PHP, Laravel
- 2018 COMGUILD's Media and Technology Students Conference
- Documentation and Content Management System
- Cyber Law: Social Media Crime Awareness
- Hardware Servicing Seminar
- Stress and Depression Management
- Real Life Leadership
- Financial Literacy and Investment

Imagery lives under `public/images/certificates/` (one image per entry).

## Accomplishments timeline (`data/accomplishmentsData.js`)

15 entries (newest → oldest). Icon legend:

- `MdStar` (gold) — recognitions
- `MdWork` (blue) — projects shipped at work
- `GrRobot` (light green) — robotics / smart-farming demos
- `MdSchool` (pink) — academic milestones

| Year | Title                                                                              |
| ---- | ---------------------------------------------------------------------------------- |
| 2024 | Celebrating 5-Year Milestone at Denso Philippines (carousel: 2 images)             |
| 2024 | Launched Digital Voting Platform for Annual Dance Competition                      |
| 2024 | Implemented RFID Attendance Solution for Major Corporate Event                     |
| 2024 | Showcased AutoDoser Innovation to DENSO Thailand President                         |
| 2024 | AutoDoser System Successfully Deployed at Turbulent Smart Farm                     |
| 2024 | Embarked on a New Chapter with Taja AI                                             |
| 2024 | Department of Agriculture Secretary Explores Our Smart Farming Tech                |
| 2024 | Japanese Embassy Delegation Reviews Smart Agriculture Innovations                  |
| 2024 | Dockerized RFID Attendance System for Simplified Deployment                        |
| 2023 | Integrated RFID and Voting Systems for Cooperative Events (carousel: 2 images)     |
| 2023 | Promoted to Senior-Level Role at Denso Philippines                                 |
| 2022 | Online Judging System Revolutionizes Dance Contest                                 |
| 2022 | QR-Code Based Attendance Makes Event Check-in Effortless                           |
| 2019 | Successfully Defended IoT-Based Thesis Project (carousel: 4 images)                |
| 2018 | Safety Driving App Thesis Triumph                                                  |

## Projects (`scripts/github.json` via `/api/github`)

Source: GitHub user `JPhlpL` public repos (forks excluded). Each record exposes:

- `project` (repo name — also the URL slug)
- `description`
- `language`
- `date_created`
- `stars`
- `website`
- `topics[]`
- `repository_link`
- (optionally) `images[]`, `title` (for richer detail pages)

The list is paginated 9-per-page, searchable by name/topic/language/URL, and filterable by language (`Unknown` covers null `language`).

## Stack icons (`public/images/stacks/`)

`aws / azure / docker / fastapi / github / java / laravel / modal / mysql / nextjs / nginx / postgresql / python / supabase / typescript / vercel` (.png each).

## Fonts (`public/fonts/`)

Full **GeneralSans** family — Variable + Variable Italic + Extralight / Light / Regular / Italic / Medium / Semibold / Bold (with italic variants), each delivered as `.woff2`, `.woff`, and `.ttf`. Registered in `styles/globals.css` and used as the default `body` font.

## Static assets

- `public/files/resume.pdf` (≈ 233 KB) — Download CV target.
- `public/images/profile.jpeg` — About-page portrait.
- `public/images/accomplishments/`, `/certificates/`, `/projects/`, `/stacks/` — gallery sources.

## Legacy / unused

- `data/projectsData.js` (~27 KB) — sample projects from the upstream `realstoman/nextjs-tailwindcss-portfolio` template. **Not consumed** by current pages and a candidate for deletion.
- `scripts/github_contributions.json` — generated by `generateGithubContributionChart.py` but no UI surface yet.
- `components/HireMeModal.jsx` — imported by `AppHeader` but never rendered (no trigger button).
