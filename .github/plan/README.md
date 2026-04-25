# Project Planning & Documentation

This directory contains comprehensive documentation for the Next.js portfolio project.

## 📚 Documentation Index

### Core Documentation

| File | Purpose | When to read |
|------|---------|-------------|
| **[structure.md](./structure.md)** | Complete directory tree with file roles | When you need to understand where things live |
| **[architecture.md](./architecture.md)** | Stack, topology, data flow (with diagrams) | When you need to understand how the system works |
| **[implementation.md](./implementation.md)** | Per-route implementation details | When you need to understand how a specific page is wired |
| **[contents.md](./contents.md)** | Data inventory (bio, certs, projects, etc.) | When you need to know what content ships in the site |

### Planning & History

| File | Purpose | When to update |
|------|---------|---------------|
| **[plan.md](./plan.md)** | Consolidated backlog & roadmap | When adding new features to the backlog |
| **[changelog.md](./changelog.md)** | Historical record + planning log | After completing work or making major planning decisions |
| **[supabase-migration-plan.md](./supabase-migration-plan.md)** | Active migration guide (projects → DB) | During/after each phase of the Supabase migration |

## 🎯 Quick Start

**New to the codebase?** Read in this order:
1. `structure.md` — get oriented
2. `architecture.md` — understand the big picture (check out the Mermaid diagrams!)
3. `implementation.md` — dive into specific pages as needed

**Planning a new feature?**
1. Check `plan.md` for existing backlog items
2. Add your feature to the roadmap section
3. Update `changelog.md` when you complete it

**Working on Supabase migration?**
- Follow `supabase-migration-plan.md` phase by phase
- Update `changelog.md` after each completed phase

## 🔄 Maintenance

### When to update these docs

- **Structure changes** (new folders, major reorganization) → update `structure.md`
- **Architecture changes** (new external service, state management approach) → update `architecture.md` + add/update Mermaid diagrams
- **Route changes** (new pages, data flow modifications) → update `implementation.md`
- **Content additions** (new certificates, accomplishments, projects) → update `contents.md`
- **Feature planning** (new ideas, TODOs) → update `plan.md`
- **Work completed** (shipped features, completed migrations) → update `changelog.md`

### Documentation principles

1. **Be specific** — link to exact files and line numbers when possible
2. **Use diagrams** — Mermaid is preferred for flows, topology, sequences
3. **Keep current** — outdated docs are worse than no docs
4. **Show, don't just tell** — include code examples in implementation guides

## 📊 Mermaid Diagrams

All architecture diagrams use Mermaid syntax and render natively on:
- GitHub (in README/markdown preview)
- VS Code/Cursor (with Markdown Preview extension)
- Most modern markdown viewers

**Diagram types used:**
- `flowchart TB/LR` — system topology, component trees
- `sequenceDiagram` — request lifecycles, API flows
- `stateDiagram-v2` — state machines (e.g., theme switcher)

## 🚀 Current Focus

**Active initiative:** [Supabase Migration](./supabase-migration-plan.md)  
**Status:** 📋 Planning  
**Next step:** Create Supabase project and run schema SQL

---

*Last updated: 2026-04-25*
