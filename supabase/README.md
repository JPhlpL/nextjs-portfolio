# Database Migrations & Seeds

This folder contains version-controlled database schema changes and reusable seed templates.

## Structure

```
supabase/
├── migrations/          # Sequential schema changes
│   └── 001_create_projects_table.sql
└── seeds/              # Reusable SQL templates
    └── projects_seed_template.sql
```

## Workflow

### 1. Running Migrations

1. Copy contents of migration file (e.g., `migrations/001_create_projects_table.sql`)
2. Open Supabase Dashboard → SQL Editor
3. Paste and click "Run"
4. Verify success message in output

### 2. Adding Data

1. Open seed template (e.g., `seeds/projects_seed_template.sql`)
2. Copy example or modify template
3. Fill in your values
4. Run in Supabase SQL Editor

### 3. Common Operations

**Hide a project:**
```sql
UPDATE public.projects 
SET is_visible = false 
WHERE project = 'Project Name';
```

**Reorder projects:**
```sql
UPDATE public.projects SET order_index = 1 WHERE project = 'Featured Project';
UPDATE public.projects SET order_index = 2 WHERE project = 'Second Project';
```

**Show all hidden projects:**
```sql
SELECT project, is_visible, order_index 
FROM public.projects 
WHERE is_visible = false 
ORDER BY created_at DESC;
```

## Naming Conventions

### Migrations
- Format: `NNN_description.sql`
- Examples: `001_create_projects_table.sql`, `002_create_certificates_table.sql`
- Sequential numbering (001, 002, 003...)
- Never modify existing migrations; create new ones for changes

### Seeds
- Format: `{table}_seed_template.sql`
- Examples: `projects_seed_template.sql`, `certificates_seed_template.sql`
- Reusable templates with examples and common operations
- Version controlled for reference

## Standard Column Pattern

Every table includes:

```sql
is_visible   BOOLEAN NOT NULL DEFAULT true   -- Show/hide control
order_index  INTEGER                         -- Manual sort (null = auto-sort)
created_at   TIMESTAMPTZ DEFAULT now()       -- Audit trail
updated_at   TIMESTAMPTZ DEFAULT now()       -- Auto-updated
```

## Future Tables

When adding new tables:

1. Create `migrations/00N_create_{table}_table.sql`
2. Include standard columns (`is_visible`, `order_index`, `created_at`, `updated_at`)
3. Add RLS policies (read-only for public)
4. Create `seeds/{table}_seed_template.sql`
5. Update API endpoint (`pages/api/{table}.ts`)
6. Document in `.github/plan/supabase-migration-plan.md`

## Read-Only Architecture

The Next.js app **only performs GET operations**. All data modifications happen in Supabase:

- ✅ Direct in Table Editor (UI)
- ✅ SQL Editor (for bulk operations)
- ✅ Seeding scripts (one-time imports)
- ❌ Never from Next.js app endpoints

This simplifies security and eliminates the need for authentication initially.

---

For full migration details, see `.github/plan/supabase-migration-plan.md`
