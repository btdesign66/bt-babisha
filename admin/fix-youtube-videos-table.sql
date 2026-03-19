-- Create YouTube Videos table for BABISHA admin panel
-- Run this SQL in your Supabase SQL Editor

-- Create youtube_videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    youtube_id VARCHAR(11) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_youtube_videos_status ON youtube_videos(status);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_category ON youtube_videos(category);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_featured ON youtube_videos(featured);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_display_order ON youtube_videos(display_order);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_youtube_videos_updated_at 
    BEFORE UPDATE ON youtube_videos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for website display)
CREATE POLICY "Allow public read access" ON youtube_videos
    FOR SELECT
    USING (status = 'active');

-- Create policy to allow authenticated users to manage videos (for admin panel)
-- Note: Adjust this based on your authentication setup
CREATE POLICY "Allow authenticated users to manage videos" ON youtube_videos
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Insert sample data (optional)
-- INSERT INTO youtube_videos (youtube_id, title, description, category, status, featured, display_order)
-- VALUES 
--     ('dQw4w9WgXcQ', 'Sample Video 1', 'This is a sample video description', 'fashion', 'active', true, 1),
--     ('jNQXAC9IVRw', 'Sample Video 2', 'Another sample video', 'tutorial', 'active', false, 2);

COMMENT ON TABLE youtube_videos IS 'Stores YouTube videos for display on BABISHA website';
COMMENT ON COLUMN youtube_videos.youtube_id IS 'YouTube video ID (11 characters)';
COMMENT ON COLUMN youtube_videos.status IS 'Video status: active (visible on website) or inactive (hidden)';
COMMENT ON COLUMN youtube_videos.featured IS 'Whether this video should be featured prominently';
COMMENT ON COLUMN youtube_videos.display_order IS 'Order for displaying videos (lower numbers appear first)';


