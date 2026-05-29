-- Complete Fix for Blogs Table - Run this in Supabase SQL Editor
-- This will ensure all columns exist and slug is properly configured

-- Step 1: Add slug column if it doesn't exist, or fix it if it does
DO $$ 
BEGIN
    -- Add slug column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'slug'
    ) THEN
        ALTER TABLE blogs ADD COLUMN slug VARCHAR(255);
    END IF;
    
    -- Generate slugs for any existing rows
    UPDATE blogs 
    SET slug = LOWER(REGEXP_REPLACE(
        COALESCE(NULLIF(TRIM(title), ''), 'blog-' || id::text), 
        '[^a-zA-Z0-9]+', '-', 'g'
    ))
    WHERE slug IS NULL OR slug = '';
    
    -- Make slug NOT NULL (but first ensure all rows have slugs)
    BEGIN
        ALTER TABLE blogs ALTER COLUMN slug SET NOT NULL;
    EXCEPTION WHEN OTHERS THEN
        -- If it fails, update any remaining NULL values and try again
        UPDATE blogs 
        SET slug = 'blog-' || id::text
        WHERE slug IS NULL OR slug = '';
        ALTER TABLE blogs ALTER COLUMN slug SET NOT NULL;
    END;
END $$;

-- Step 2: Ensure all other required columns exist
DO $$ 
BEGIN
    -- category
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'category'
    ) THEN
        ALTER TABLE blogs ADD COLUMN category VARCHAR(100);
    END IF;
    
    -- author
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'author'
    ) THEN
        ALTER TABLE blogs ADD COLUMN author VARCHAR(255);
    END IF;
    
    -- image_url
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE blogs ADD COLUMN image_url TEXT;
    END IF;
    
    -- youtube_url
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'youtube_url'
    ) THEN
        ALTER TABLE blogs ADD COLUMN youtube_url TEXT;
    END IF;
    
    -- youtube_video_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'youtube_video_id'
    ) THEN
        ALTER TABLE blogs ADD COLUMN youtube_video_id VARCHAR(20);
    END IF;
    
    -- status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'status'
    ) THEN
        ALTER TABLE blogs ADD COLUMN status VARCHAR(20) DEFAULT 'draft';
    END IF;
    
    -- published_date
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'published_date'
    ) THEN
        ALTER TABLE blogs ADD COLUMN published_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- created_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE blogs ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- updated_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE blogs ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Step 3: Ensure RLS policies are set up
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all blog operations" ON blogs;
CREATE POLICY "Allow all blog operations" ON blogs
    FOR ALL USING (true) WITH CHECK (true);

-- Step 4: Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'blogs'
ORDER BY ordinal_position;


