-- Supabase Database Setup for Babisha Admin Panel
-- Run this SQL in your Supabase SQL Editor

-- Create Products Table
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

-- Create Blogs Table
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_published_date ON blogs(published_date);

-- Enable Row Level Security (optional, but recommended for production)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
-- For products: Allow anyone to read active products
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (status = 'active');

-- For blogs: Allow anyone to read published blogs
CREATE POLICY "Public can view published blogs" ON blogs
    FOR SELECT USING (status = 'published');

-- Admin operations policies (for admin panel using anon key)
-- IMPORTANT: For production, replace these with proper authentication policies
-- For now, allowing all operations for admin panel access

-- Products: Allow all operations (INSERT, UPDATE, DELETE, SELECT)
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all product operations" ON products;
CREATE POLICY "Allow all product operations" ON products
    FOR ALL USING (true) WITH CHECK (true);

-- Blogs: Allow all operations (INSERT, UPDATE, DELETE, SELECT)
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all blog operations" ON blogs;
CREATE POLICY "Allow all blog operations" ON blogs
    FOR ALL USING (true) WITH CHECK (true);

-- Note: For production, you should implement proper authentication and use:
-- CREATE POLICY "Authenticated users can manage products" ON products
--     FOR ALL USING (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can manage blogs" ON blogs
--     FOR ALL USING (auth.role() = 'authenticated');

-- Create Storage Buckets (run these separately in Storage section, or via API)
-- Go to Storage > Create Bucket
-- 1. Create bucket named 'products' (public)
-- 2. Create bucket named 'blogs' (public)

-- Storage policies (set these in Storage > Policies after creating buckets)
-- For 'products' bucket:
-- Allow public read access
DROP POLICY IF EXISTS "Public can read products" ON storage.objects;
CREATE POLICY "Public can read products" ON storage.objects
    FOR SELECT USING (bucket_id = 'products');

-- Allow uploads (for admin panel - adjust for production)
DROP POLICY IF EXISTS "Allow product uploads" ON storage.objects;
CREATE POLICY "Allow product uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'products');

-- For 'blogs' bucket:
-- Allow public read access
DROP POLICY IF EXISTS "Public can read blogs" ON storage.objects;
CREATE POLICY "Public can read blogs" ON storage.objects
    FOR SELECT USING (bucket_id = 'blogs');

-- Allow uploads (for admin panel - adjust for production)
DROP POLICY IF EXISTS "Allow blog uploads" ON storage.objects;
CREATE POLICY "Allow blog uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'blogs');

