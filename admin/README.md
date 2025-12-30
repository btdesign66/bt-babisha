# Babisha Admin Panel

A complete admin panel for managing products and blogs for the Babisha website, with Supabase database integration.

## Features

- ✅ Admin login system
- ✅ Dashboard with statistics
- ✅ Product management (Add, Edit, Delete, List)
- ✅ Blog management (Add, Edit, Delete, List)
- ✅ YouTube video integration for blogs
- ✅ Image uploads to Supabase Storage
- ✅ Responsive design matching the Babisha brand

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project credentials:
   - Go to **Project Settings > API**
   - Copy your **Project URL** and **anon/public key**
3. Update `config.js` with your credentials:
   ```javascript
   const SUPABASE_URL = 'https://yourproject.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

### 2. Create Database Tables

Run the following SQL in your Supabase SQL Editor:

#### Products Table
```sql
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
```

#### Blogs Table
```sql
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
```

### 3. Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create two public buckets:
   - `products` - for product images
   - `blogs` - for blog featured images

3. Set bucket policies (Allow public read access):
   ```sql
   -- For products bucket
   CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');
   
   -- For blogs bucket
   CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'blogs');
   ```

### 4. Installation

1. Install dependencies (optional, for local development):
   ```bash
   npm install
   ```

2. Serve the files locally (you can use any static file server):
   ```bash
   npx serve .
   ```
   
   Or simply open `index.html` in your browser (note: some features may not work without a server due to CORS)

### 5. Access the Admin Panel

1. Open `index.html` in your browser
2. Login with any email/password (authentication is currently simplified - you can enhance it with Supabase Auth)
3. Start managing your products and blogs!

## File Structure

```
babisha-admin/
├── index.html              # Login page
├── dashboard.html          # Main dashboard
├── products.html           # Products list
├── add-product.html        # Add new product
├── edit-product.html       # Edit product
├── blogs.html              # Blogs list
├── add-blog.html           # Create new blog
├── edit-blog.html          # Edit blog
├── config.js               # Supabase configuration
├── styles/
│   ├── login.css          # Login page styles
│   ├── dashboard.css      # Dashboard styles
│   ├── admin-pages.css    # Common admin page styles
│   └── forms.css          # Form styles
└── js/
    ├── auth.js            # Authentication utilities
    ├── login.js           # Login page functionality
    ├── dashboard.js       # Dashboard functionality
    ├── products.js        # Products list functionality
    ├── add-product.js     # Add product functionality
    ├── edit-product.js    # Edit product functionality
    ├── blogs.js           # Blogs list functionality
    ├── add-blog.js        # Add blog functionality
    └── edit-blog.js       # Edit blog functionality
```

## Usage

### Adding Products

1. Navigate to **Products** → **Add Product**
2. Fill in product details (name, price, category, description)
3. Upload a product image
4. Set status and stock quantity
5. Click **Save Product**

### Creating Blogs

1. Navigate to **Blogs** → **Create Blog**
2. Fill in blog details (title, category, author, content)
3. Optionally upload a featured image
4. Optionally add a YouTube video URL (it will be embedded)
5. Set status and published date
6. Click **Publish Blog**

### YouTube Videos

- Paste the full YouTube URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)
- The system will automatically extract the video ID and embed it
- Videos are embedded using YouTube's iframe embed API

## Integration with Main Website

All data is stored in Supabase, so you can easily fetch it in your main website:

```javascript
// Example: Fetch products in your main website
const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active');

// Example: Fetch published blogs
const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('published_date', { ascending: false });
```

## Security Notes

- Currently using simplified authentication (localStorage)
- For production, implement proper Supabase Auth:
  ```javascript
  // In auth.js, replace login function with:
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  ```
- Set up Row Level Security (RLS) policies in Supabase for data protection
- Use environment variables for sensitive credentials in production

## Customization

- Update colors and branding in CSS files
- Modify form fields in HTML files
- Adjust database schema as needed
- Add more features as required

## Support

For issues or questions, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

## License

This project is for Babisha website administration.
