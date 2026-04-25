-- Seed Template: Projects
-- Use this template when adding projects manually via SQL
-- Copy, fill in values, and run in SQL Editor

-- Single project insert
INSERT INTO public.projects (
  project,
  description,
  language,
  date_created,
  stars,
  images,
  website,
  topics,
  repository_link,
  is_visible,
  order_index
) VALUES (
  'Project Name',                                    -- Required: unique name
  'Project description goes here',                   -- Optional
  'Python',                                          -- Optional: primary language
  '2024-01-01T00:00:00Z',                           -- Required: ISO 8601 timestamp
  0,                                                 -- Default: 0 stars
  ARRAY['/images/projects/image1.png'],             -- Optional: array of image paths
  'https://example.com',                             -- Optional: live URL
  ARRAY['React', 'TypeScript', 'AWS'],              -- Optional: array of tags
  'https://github.com/user/repo',                    -- Optional: GitHub URL
  true,                                              -- true = visible, false = hidden
  NULL                                               -- NULL = auto-sort, or set number (1, 2, 3...)
);

-- ============================================================================
-- EXAMPLES
-- ============================================================================

-- Example 1: Featured project (pinned to position 1)
INSERT INTO public.projects (project, description, language, date_created, is_visible, order_index)
VALUES (
  'Taja AI',
  'AI-powered video-to-social-media converter',
  'Python',
  '2024-04-19T10:38:20Z',
  true,
  1  -- Pin to top
);

-- Example 2: Hidden draft project
INSERT INTO public.projects (project, description, is_visible, order_index)
VALUES (
  'Secret Project',
  'Work in progress...',
  false,  -- Hidden from public
  NULL
);

-- Example 3: Simple project (auto-sort by stars/date)
INSERT INTO public.projects (project, description, language, date_created)
VALUES (
  'My Portfolio',
  'Personal portfolio website',
  'JavaScript',
  now()
);

-- ============================================================================
-- BULK UPDATE OPERATIONS
-- ============================================================================

-- Pin multiple projects to top positions
UPDATE public.projects SET order_index = 1 WHERE project = 'Taja AI';
UPDATE public.projects SET order_index = 2 WHERE project = 'AutoDoser';
UPDATE public.projects SET order_index = 3 WHERE project = 'Environmental DB';

-- Hide all projects with 0 stars
UPDATE public.projects 
SET is_visible = false 
WHERE stars = 0;

-- Auto-number all visible projects (10, 20, 30... with gaps)
WITH numbered AS (
  SELECT 
    id, 
    ROW_NUMBER() OVER (ORDER BY stars DESC, date_created DESC) * 10 AS new_index
  FROM public.projects
  WHERE is_visible = true
)
UPDATE public.projects p
SET order_index = n.new_index
FROM numbered n
WHERE p.id = n.id;

-- Remove all manual ordering (back to auto-sort)
UPDATE public.projects SET order_index = NULL;
