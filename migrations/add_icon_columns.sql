-- Adds editable icon fields for Portfolio projects and Blog posts.
-- (The `services` table already has an `icon` column.)
-- Run this once in the Supabase SQL Editor.

ALTER TABLE portfolio_projects
  ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'Coins';

ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT 'FileText';

-- Backfill any existing rows that have no icon set.
UPDATE portfolio_projects SET icon = 'Coins'    WHERE icon IS NULL OR icon = '';
UPDATE blogs              SET icon = 'FileText' WHERE icon IS NULL OR icon = '';
UPDATE services           SET icon = 'Rocket'   WHERE icon IS NULL OR icon = '';
