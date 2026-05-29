-- Fix Blogs Table - Run this in Supabase SQL Editor
-- This will create the table if it doesn't exist, or add missing columns

-- First, create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS blogs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    author VARCHAR(255),
    content TEXT NOT NULL,
    image_url TEXT,
    youtube_url TEXT,
    youtube_video_id VARCHAR(20),
    status VARCHAR(20) DEFAULT 'draft',
    published_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blogs' 
        AND column_name = 'category'
    ) THEN
        ALTER TABLE blogs ADD COLUMN category VARCHAR(100);
    END IF;
END $$;

-- Add other columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blogs' 
        AND column_name = 'author'
    ) THEN
        ALTER TABLE blogs ADD COLUMN author VARCHAR(255);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blogs' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE blogs ADD COLUMN image_url TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blogs' 
        AND column_name = 'youtube_url'
    ) THEN
        ALTER TABLE blogs ADD COLUMN youtube_url TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blogs' 
        AND column_name = 'youtube_video_id'
    ) THEN
        ALTER TABLE blogs ADD COLUMN youtube_video_id VARCHAR(20);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blogs' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE blogs ADD COLUMN status VARCHAR(20) DEFAULT 'draft';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blogs' 
        AND column_name = 'published_date'
    ) THEN
        ALTER TABLE blogs ADD COLUMN published_date TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blogs' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE blogs ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'blogs' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE blogs ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DROP POLICY IF EXISTS "Allow all blog operations" ON blogs;
CREATE POLICY "Allow all blog operations" ON blogs
    FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_published_date ON blogs(published_date);


