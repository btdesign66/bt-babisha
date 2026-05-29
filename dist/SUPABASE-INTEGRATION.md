# Supabase Products Integration

## Overview
Products added through the admin panel are now automatically displayed on the main website's products page. The system fetches products from Supabase database and merges them with existing static products.

## How It Works

### 1. Admin Panel (Product Creation)
- Admin adds products via `/admin/add-product.html`
- Products are stored in Supabase `products` table
- Products must have `status = 'active'` to appear on website

### 2. Main Website (Product Display)
- `supabase-products.js` fetches products from Supabase
- Merges Supabase products with static products from `new_products.js`
- Updates `fabricData` and `sampleFabrics` arrays
- Products appear on `/products.html` page

## Files Modified

### New Files
- `supabase-products.js` - Main integration script that fetches and merges products

### Updated Files
- `products.html` - Added Supabase script loading
- `script.js` - Updated `initializeProductsPage()` to load Supabase products

## Product Data Structure

Products from Supabase are transformed to match the website format:

```javascript
{
    id: product.id,
    name: product.name,
    category: product.category, // 'lehenga', 'saree', 'suit', etc.
    price: parseFloat(product.price),
    originalPrice: parseFloat(product.original_price) || parseFloat(product.price),
    image: product.image_url || product.image,
    description: product.description,
    specifications: {
        material: product.material,
        width: product.width,
        colors: product.colors,
        origin: product.origin || 'India',
        gsm: product.gsm
    },
    supplier: product.supplier || 'BABISHA Collections',
    rating: parseFloat(product.rating) || 4.5,
    reviews: parseInt(product.reviews) || 0,
    onSale: product.on_sale || false,
    savings: product.savings || 0,
    slug: product.slug,
    status: product.status || 'active',
    stock: product.stock || 0
}
```

## Supabase Table Schema

The `products` table should have these columns:

- `id` (uuid, primary key)
- `name` (text, required)
- `category` (text) - e.g., 'lehenga', 'saree', 'suit'
- `price` (numeric, required)
- `original_price` (numeric)
- `image_url` (text) - URL to product image
- `description` (text)
- `material` (text)
- `width` (text)
- `colors` (text)
- `origin` (text)
- `gsm` (text)
- `supplier` (text)
- `rating` (numeric)
- `reviews` (integer)
- `on_sale` (boolean)
- `savings` (numeric)
- `slug` (text) - URL-friendly product identifier
- `status` (text) - 'active' or 'inactive' (only 'active' products show on website)
- `stock` (integer)
- `created_at` (timestamp)

## Configuration

Supabase credentials are configured in:
- `admin/config.js` - For admin panel
- `supabase-products.js` - For main website

Both use the same Supabase project:
- URL: `https://amjybgakxrbbshzhxjkf.supabase.co`
- Anon Key: (configured in files)

## Features

✅ **Automatic Sync**: Products added via admin panel appear on website automatically
✅ **Merge with Static**: Supabase products merge with existing static products
✅ **No Duplicates**: Products with same ID/name are deduplicated
✅ **Active Only**: Only products with `status = 'active'` are displayed
✅ **Fallback**: If Supabase fails, website uses static products
✅ **Real-time**: Products refresh when page loads

## Testing

1. **Add Product via Admin**:
   - Go to `/admin/add-product.html`
   - Fill in product details
   - Set status to "active"
   - Save product

2. **View on Website**:
   - Go to `/products.html`
   - New product should appear in the product grid
   - Product should be searchable and filterable

3. **Check Console**:
   - Open browser console
   - Look for: "✅ Merged products: X from Supabase + Y static = Z total"

## Troubleshooting

### Products Not Appearing

1. **Check Product Status**:
   - Ensure product has `status = 'active'` in Supabase

2. **Check Console Errors**:
   - Open browser console (F12)
   - Look for Supabase connection errors
   - Verify Supabase credentials are correct

3. **Check Network Tab**:
   - Open browser DevTools → Network
   - Look for requests to Supabase
   - Check if requests are successful

4. **Verify Database**:
   - Check Supabase dashboard
   - Verify products table exists
   - Verify products have correct structure

### Supabase Connection Issues

- Ensure Supabase library is loaded before `supabase-products.js`
- Check Supabase URL and API key are correct
- Verify CORS settings in Supabase dashboard
- Check browser console for specific error messages

## Future Enhancements

- [ ] Real-time updates using Supabase Realtime
- [ ] Product caching for better performance
- [ ] Admin panel product preview
- [ ] Bulk product import/export
- [ ] Product image upload to Supabase Storage

