# Admin Panel Integration

## Overview
The admin panel has been successfully merged into the BABISHA project. All admin files are now located in the `admin/` folder.

## Structure
```
admin/
├── index.html              # Admin login page
├── dashboard.html          # Admin dashboard
├── products.html           # Product management
├── blogs.html              # Blog management
├── add-product.html        # Add new product
├── edit-product.html       # Edit product
├── add-blog.html           # Add new blog
├── edit-blog.html          # Edit blog
├── config.js               # Supabase configuration
├── js/                     # JavaScript files
│   ├── auth.js
│   ├── login.js
│   ├── dashboard.js
│   ├── products.js
│   ├── blogs.js
│   └── ...
├── styles/                 # CSS files
│   ├── login.css
│   ├── dashboard.css
│   ├── forms.css
│   └── admin-pages.css
└── *.sql                   # Database setup files
```

## Access
- **Admin Login**: `/admin/index.html` or click "Admin" in the footer Quick Links
- **Back to Website**: Click "Back to Website" link in admin login page

## Footer Integration
The admin link has been added to the Quick Links section in the footer of all pages:
- Home
- Products
- About Us
- Contact
- **Admin** (new)

## Configuration
1. Update `admin/config.js` with your Supabase credentials:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

2. Run database setup SQL files if needed:
   - `supabase-setup.sql`
   - `fix-products-table.sql`
   - `fix-blogs-table.sql`
   - etc.

## Features
- ✅ Product management (CRUD)
- ✅ Blog management (CRUD)
- ✅ Admin authentication
- ✅ Dashboard with statistics
- ✅ Responsive design

## Notes
- All paths are relative and work from the admin folder
- The "Back to Website" link points to `../index.html` (main website homepage)
- Footer links point to `admin/index.html` from any page


