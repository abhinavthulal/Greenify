-- Greenify Batch: Supabase Database Schema
-- Copy and paste this into Supabase SQL Editor

-- Site-wide statistics table
CREATE TABLE IF NOT EXISTS site_stats (
  id BIGINT PRIMARY KEY DEFAULT 1,
  total_photos BIGINT DEFAULT 0,
  total_visitors BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily statistics table
CREATE TABLE IF NOT EXISTS daily_upload_counts (
  date DATE PRIMARY KEY,
  photo_count BIGINT DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_upload_counts ENABLE ROW LEVEL SECURITY;

-- Create public read-only policies (anyone can read)
CREATE POLICY "Allow public read" ON site_stats
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON daily_upload_counts
  FOR SELECT USING (true);

-- Allow updates via service role (for edge functions)
CREATE POLICY "Allow service role update" ON site_stats
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role insert" ON daily_upload_counts
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Initialize site_stats with one row
INSERT INTO site_stats (id, total_photos, total_visitors) 
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Optional: Create function to update stats safely
CREATE OR REPLACE FUNCTION increment_photo_count(count_to_add INT DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  UPDATE site_stats 
  SET total_photos = total_photos + count_to_add,
      updated_at = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS VOID AS $$
BEGIN
  UPDATE site_stats 
  SET total_visitors = total_visitors + 1,
      updated_at = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
