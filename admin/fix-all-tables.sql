-- Fix All Tables - Run this in Supabase SQL Editor
-- This will create/update both products and blogs tables with all required columns

-- ============================================
-- PRODUCTS TABLE
-- ============================================

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to products table
DO $$ 
BEGIN
    -- image_url
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE products ADD COLUMN image_url TEXT;
    END IF;
    
    -- category
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'category'
    ) THEN
        ALTER TABLE products ADD COLUMN category VARCHAR(100);
    END IF;
    
    -- description
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'description'
    ) THEN
        ALTER TABLE products ADD COLUMN description TEXT;
    END IF;
    
    -- status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'status'
    ) THEN
        ALTER TABLE products ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
    
    -- stock
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'stock'
    ) THEN
        ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0;
    END IF;
    
    -- created_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE products ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- updated_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE products ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Enable RLS and create policy for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all product operations" ON products;
CREATE POLICY "Allow all product operations" ON products
    FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- ============================================
-- BLOGS TABLE
-- ============================================

-- Create blogs table if it doesn't exist
CREATE TABLE IF NOT EXISTS blogs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
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

-- Add missing columns to blogs table
DO $$ 
BEGIN
    -- slug
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'slug'
    ) THEN
        ALTER TABLE blogs ADD COLUMN slug VARCHAR(255);
        -- Update existing rows with a generated slug from title
        UPDATE blogs SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
        WHERE slug IS NULL OR slug = '';
        -- Now make it NOT NULL
        ALTER TABLE blogs ALTER COLUMN slug SET NOT NULL;
    ELSE
        -- If slug column exists but allows NULL, make it NOT NULL and update NULL values
        UPDATE blogs SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
        WHERE slug IS NULL OR slug = '';
        ALTER TABLE blogs ALTER COLUMN slug SET NOT NULL;
    END IF;
    
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

-- Enable RLS and create policy for blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all blog operations" ON blogs;
CREATE POLICY "Allow all blog operations" ON blogs
    FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for blogs
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_published_date ON blogs(published_date);

