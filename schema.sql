-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS texts (
  id text primary key,
  label text not null,
  value text not null
);

-- Insert defaults if none exist
INSERT INTO texts (id, label, value)
VALUES 
  ('hero_title', 'Hero Title', 'Welcome to my Creative Portfolio'),
  ('hero_subtitle', 'Hero Subtitle', 'I build digital experiences that live on the web.'),
  ('about_me', 'About Me (Paragraph)', 'I am a passionate developer and designer with over 5 years of experience in creating modern web applications...')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS images (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  filename text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE IF NOT EXISTS blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date text not null,
  status text not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a storage bucket for images if you haven't
-- Requires inserting into storage.buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "Allow Deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );

-- Table policies (allow everything for now since it's admin panel accessed via API)
-- You might want to lock this down with RLS + authenticated users later
ALTER TABLE texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "texts_public" ON texts FOR ALL USING (true);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "images_public" ON images FOR ALL USING (true);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blogs_public" ON blogs FOR ALL USING (true);
