-- Migration: Create projects table
-- Date: 2026-04-25
-- Description: Initial projects table with visibility control and manual ordering

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project TEXT NOT NULL UNIQUE,
  description TEXT,
  language TEXT,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  stars INTEGER NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  website TEXT,
  topics TEXT[] DEFAULT '{}',
  repository_link TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_projects_project ON public.projects(project);
CREATE INDEX idx_projects_language ON public.projects(language);
CREATE INDEX idx_projects_date_created ON public.projects(date_created DESC);
CREATE INDEX idx_projects_is_visible ON public.projects(is_visible);
CREATE INDEX idx_projects_order_index ON public.projects(order_index NULLS LAST);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read VISIBLE projects only
CREATE POLICY "Visible projects are viewable by everyone"
  ON public.projects
  FOR SELECT
  USING (is_visible = true);

-- Policy: No writes from the app (all modifications via Supabase dashboard)
CREATE POLICY "No direct inserts from app"
  ON public.projects
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No direct updates from app"
  ON public.projects
  FOR UPDATE
  USING (false);

CREATE POLICY "No direct deletes from app"
  ON public.projects
  FOR DELETE
  USING (false);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration 001: projects table created successfully';
END $$;
