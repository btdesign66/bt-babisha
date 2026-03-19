# Quick Setup Guide

## Step 1: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create an account/project
2. Navigate to **Project Settings > API**
3. Copy your **Project URL** and **anon/public key**

## Step 2: Configure the Admin Panel

1. Open `config.js`
2. Replace the placeholder values:
   ```javascript
   const SUPABASE_URL = 'https://your-project-id.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key-here';
   ```

## Step 3: Set Up Database

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-setup.sql`
4. Click **Run** to create the tables

## Step 4: Set Up Storage

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Create two buckets:
   - Name: `products` (make it public)
   - Name: `blogs` (make it public)
4. For each bucket, set the policy to allow public read access

## Step 5: Run the Admin Panel

You can use any static file server:

```bash
# Using npx serve (if you have Node.js)
npx serve .

# Or use Python
python -m http.server 8000

# Or use PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Step 6: Login

- The login system is currently simplified (accepts any email/password)
- For production, you'll want to implement proper Supabase Auth
- Once logged in, you'll see the dashboard

## Features Available

✅ **Products Management**
- Add new products with images
- Edit existing products
- Delete products
- View all products in a table

✅ **Blogs Management**
- Create blog posts
- Upload featured images
- Embed YouTube videos
- Edit and delete blogs

✅ **Dashboard**
- View statistics (total products, blogs, etc.)
- Quick actions to add content

## Next Steps

1. Customize the styling to match your brand
2. Implement proper authentication (Supabase Auth)
3. Set up Row Level Security (RLS) policies for data protection
4. Integrate with your main website by fetching data from Supabase

## Troubleshooting

**Error: "supabase is not defined"**
- Make sure the Supabase CDN script is loaded before config.js
- Check that config.js is included in your HTML files

**Error: "Failed to upload image"**
- Make sure you've created the storage buckets (`products` and `blogs`)
- Check that the buckets are set to public
- Verify storage policies allow uploads

**Error: "relation does not exist"**
- Run the SQL setup script in Supabase SQL Editor
- Make sure the table names match exactly (`products` and `blogs`)

## Need Help?

Check the main README.md for more detailed information and examples.
