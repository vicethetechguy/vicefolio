-- Run this in the Supabase SQL Editor to set up all tables

-- ==========================================
-- 1. TEXTS TABLE & DEFAULTS
-- ==========================================
CREATE TABLE IF NOT EXISTS texts (
  id text primary key,
  label text not null,
  value text not null
);

-- Insert common defaults if none exist
INSERT INTO texts (id, label, value)
VALUES 
  ('hero_title', 'Hero Title', 'Welcome to my Creative Portfolio'),
  ('hero_subtitle', 'Hero Subtitle', 'I build digital experiences that live on the web.'),
  ('about_me', 'About Me (Paragraph)', 'I am a passionate developer and designer with over 5 years of experience in creating modern web applications...')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 2. IMAGES TABLE & STORAGE BUCKET
-- ==========================================
CREATE TABLE IF NOT EXISTS images (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  filename text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Deletes" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'images' );
CREATE POLICY "Allow Uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'images' );
CREATE POLICY "Allow Deletes" ON storage.objects FOR DELETE USING ( bucket_id = 'images' );

-- ==========================================
-- 3. BLOGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  date text not null,
  status text not null,
  category text,
  excerpt text,
  read_time text,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 4. PORTFOLIO PROJECTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  metric text,
  description text not null,
  slug text unique not null,
  year text not null,
  image_url text, -- Store image path here if needed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 5. SERVICES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  price text not null,
  features text[], -- Array of strings for "What's Included" feature list
  icon text,       -- Store the name of the icon (e.g., 'Coins', 'Rocket')
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 6. VALUE PROPS (About Me Core Values) TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS value_props (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  order_index integer default 0, -- To easily control the display order
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- ==========================================
-- 7. ENABLE ROW LEVEL SECURITY AND POLICIES
-- ==========================================
-- Allow public read/write access for all tables 
-- (This is okay for now since we haven't set up full user Auth yet, but we will lock this behind Auth later)

ALTER TABLE texts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "texts_public" ON texts;
CREATE POLICY "texts_public" ON texts FOR ALL USING (true);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "images_public" ON images;
CREATE POLICY "images_public" ON images FOR ALL USING (true);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "blogs_public" ON blogs;
CREATE POLICY "blogs_public" ON blogs FOR ALL USING (true);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "portfolio_projects_public" ON portfolio_projects;
CREATE POLICY "portfolio_projects_public" ON portfolio_projects FOR ALL USING (true);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "services_public" ON services;
CREATE POLICY "services_public" ON services FOR ALL USING (true);

ALTER TABLE value_props ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "value_props_public" ON value_props;
CREATE POLICY "value_props_public" ON value_props FOR ALL USING (true);
