-- Quick Fix for Slug Column - Run this in Supabase SQL Editor
-- This will handle the slug column requirement

-- Option 1: If slug column doesn't exist, add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'slug'
    ) THEN
        ALTER TABLE blogs ADD COLUMN slug VARCHAR(255);
    END IF;
END $$;

-- Option 2: Generate slugs for any existing rows that have NULL slugs
UPDATE blogs 
SET slug = LOWER(REGEXP_REPLACE(COALESCE(title, 'blog-' || id::text), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Option 3: If you want to make slug nullable (remove NOT NULL constraint)
-- First, update any NULL values
UPDATE blogs 
SET slug = LOWER(REGEXP_REPLACE(COALESCE(title, 'blog-' || id::text), '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Then you can either keep it NOT NULL (recommended) or make it nullable:
-- To make it nullable:
-- ALTER TABLE blogs ALTER COLUMN slug DROP NOT NULL;

-- Or ensure it's NOT NULL (recommended for URL-friendly slugs):
DO $$ 
BEGIN
    -- Update any remaining NULL values
    UPDATE blogs 
    SET slug = LOWER(REGEXP_REPLACE(COALESCE(title, 'blog-' || id::text), '[^a-zA-Z0-9]+', '-', 'g'))
    WHERE slug IS NULL OR slug = '';
    
    -- Make sure it's NOT NULL
    BEGIN
        ALTER TABLE blogs ALTER COLUMN slug SET NOT NULL;
    EXCEPTION WHEN OTHERS THEN
        -- Column might already be NOT NULL, that's fine
        NULL;
    END;
END $$;


