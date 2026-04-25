# Supabase Setup Guide

Follow these steps to set up Supabase for your portfolio.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Project name:** `nextjs-portfolio` (or your preferred name)
   - **Database Password:** Choose a strong password
   - **Region:** Choose the closest to your target audience
4. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Find these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (safe to expose in browser)
   - **service_role** key (⚠️ NEVER expose to browser - for server only)

## Step 3: Update Environment Variables

Update your `.env` file with the actual values:

```env
# Replace these placeholder values with your actual Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Security Notes:**
- The `.env` file should already be in `.gitignore`
- Never commit API keys to git
- Only `NEXT_PUBLIC_*` variables are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` is for seeding scripts only

## Step 4: Link Your Project (for Type Generation)

```bash
# Login to Supabase CLI
npx supabase login

# Link to your project
npx supabase link --project-ref xxxxx
```

To find your **project ref**:
1. Go to your Supabase project dashboard
2. Look at the URL: `https://app.supabase.com/project/xxxxx/...`
3. The `xxxxx` part is your project ref

## Step 5: Run the Database Migration

1. Go to your Supabase project dashboard
2. Click **SQL Editor** (left sidebar)
3. Click "New query"
4. Copy the contents of `supabase/migrations/001_create_projects_table.sql`
5. Paste into the SQL editor
6. Click "Run" (or press Cmd/Ctrl + Enter)

You should see: "Success. No rows returned"

## Step 6: Verify the Table

1. Go to **Table Editor** (left sidebar)
2. You should see a new `projects` table with columns:
   - `id`, `project`, `description`, `language`, `date_created`, `stars`
   - `images`, `website`, `topics`, `repository_link`
   - `is_visible`, `order_index`
   - `created_at`, `updated_at`

## Step 7: Generate TypeScript Types

```bash
npm run db:types
```

This will update `lib/supabase/database.types.ts` with your schema.

## Step 8: Seed Initial Data

After completing the setup, you can run the seeding script to import your existing projects from `scripts/github.json`.

---

## Quick Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables updated in `.env`
- [ ] Project linked with `npx supabase link`
- [ ] Migration executed in SQL Editor
- [ ] `projects` table visible in Table Editor
- [ ] TypeScript types generated with `npm run db:types`
- [ ] Ready to seed data!

---

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure you've updated `.env` with actual values
- Restart your dev server: `npm run dev`

### "Project not linked"
- Run `npx supabase link --project-ref xxxxx`
- Find your project ref in the Supabase dashboard URL

### "No rows returned" after migration
- This is normal! The table is empty until you seed data
- Check Table Editor to verify the table structure

### Type generation fails
- Make sure you've linked your project first
- Make sure the migration has been run
- Check that `lib/supabase/` directory exists

---

**Next Step:** After completing this setup, you're ready to seed your data and migrate your pages to use Supabase!
