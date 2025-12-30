/**
 * Supabase Products Integration
 * Fetches products from Supabase database and integrates with main website
 */

// Supabase Configuration (same as admin panel)
const SUPABASE_URL = 'https://amjybgakxrbbshzhxjkf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtanliZ2FreHJiYnNoemh4amtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzI5ODUsImV4cCI6MjA4MjE0ODk4NX0.mX4ohTTxfNbAg4mNnnV9wktBGbbhU2cvYR8VhoaSzu0';

let supabaseClient = null;

// Initialize Supabase client
function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.warn('⚠️ Supabase library not loaded. Loading from CDN...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/dist/umd/supabase.min.js';
        script.onload = () => {
            if (window.supabase && typeof window.supabase.createClient === 'function') {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase client initialized from CDN');
            } else {
                console.error('❌ Failed to initialize Supabase client after CDN load');
            }
        };
        script.onerror = () => {
            console.error('❌ Failed to load Supabase library from CDN');
        };
        document.head.appendChild(script);
    } else {
        if (typeof window.supabase.createClient === 'function') {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized (library already loaded)');
        } else if (typeof window.supabase.from === 'function') {
            supabaseClient = window.supabase;
            console.log('✅ Using existing Supabase client');
        } else {
            console.error('❌ Supabase library loaded but createClient method not available');
        }
    }
}

// Fetch products from Supabase
async function fetchProductsFromSupabase() {
    // Initialize Supabase if not already done
    if (!supabaseClient) {
        initSupabase();
        // Wait longer for CDN script to load if needed
        let attempts = 0;
        while (!supabaseClient && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
            // Try to initialize again if window.supabase is now available
            if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase client initialized after retry');
            }
        }
    }
    
    if (!supabaseClient || typeof supabaseClient.from !== 'function') {
        console.warn('⚠️ Supabase client not available after initialization attempts. Using static products only.');
        console.warn('Check if Supabase CDN is loaded and credentials are correct.');
        return [];
    }
    
    try {
        console.log('🔍 Fetching products from Supabase...');
        const { data: products, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('status', 'active') // Only fetch active products
            .order('created_at', { ascending: false }); // Newest products first
        
        if (error) {
            console.error('❌ Error fetching products from Supabase:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            return [];
        }
        
        if (!products || products.length === 0) {
            console.log('ℹ️ No active products found in Supabase database.');
            return [];
        }
        
        console.log(`✅ Successfully fetched ${products.length} products from Supabase`);
        
        // Transform Supabase products to match website format
        return products.map(product => ({
            id: product.id,
            name: product.name || 'Untitled Product',
            category: product.category || 'general',
            price: parseFloat(product.price) || 0,
            originalPrice: parseFloat(product.original_price) || parseFloat(product.price) || 0,
            image: product.image_url || product.image || 'images/placeholder.jpg',
            description: product.description || '',
            specifications: {
                material: product.material || '',
                width: product.width || '',
                colors: product.colors || '',
                origin: product.origin || 'India',
                gsm: product.gsm || ''
            },
            supplier: product.supplier || 'BABISHA Collections',
            rating: parseFloat(product.rating) || 4.5,
            reviews: parseInt(product.reviews) || 0,
            onSale: product.on_sale || false,
            savings: product.savings || 0,
            slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
            // Additional fields from Supabase
            status: product.status || 'active',
            stock: product.stock || 0,
            createdAt: product.created_at
        }));
        
    } catch (error) {
        console.error('Exception fetching products:', error);
        return [];
    }
}

// Merge Supabase products with static products
async function mergeProductsWithStatic() {
    const supabaseProducts = await fetchProductsFromSupabase();
    
    // Get static products if available
    let staticProducts = [];
    if (typeof window.sampleFabrics !== 'undefined' && Array.isArray(window.sampleFabrics)) {
        staticProducts = [...window.sampleFabrics]; // Create a copy to preserve original
    }
    
    // Create a map to track existing products by ID or name (for deduplication)
    const existingProductKeys = new Set();
    
    // Add all static products to the set (to track what exists)
    staticProducts.forEach(product => {
        const key = product.id || product.name?.toLowerCase().trim();
        if (key) {
            existingProductKeys.add(key);
        }
    });
    
    // Filter out Supabase products that might duplicate static products
    // Only add Supabase products that don't already exist
    const newSupabaseProducts = supabaseProducts.filter(product => {
        const key = product.id || product.name?.toLowerCase().trim();
        if (!key) return true; // If no key, include it
        
        // Check if this product already exists in static products
        const exists = existingProductKeys.has(key);
        if (!exists) {
            existingProductKeys.add(key); // Mark as added
        }
        return !exists; // Only include if it doesn't exist
    });
    
    // Combine: Supabase products first (newest at top), then static products
    // This ensures new products appear at the top while preserving all old products
    // Supabase products are already ordered by created_at DESC (newest first)
    const mergedProducts = [
        ...newSupabaseProducts,  // New products from Supabase (newest first, at top)
        ...staticProducts         // All existing static products (below)
    ];
    
    console.log(`✅ Merged products: ${newSupabaseProducts.length} new from Supabase + ${staticProducts.length} static = ${mergedProducts.length} total`);
    console.log(`📊 Product order: ${newSupabaseProducts.length} NEW products at TOP, then ${staticProducts.length} static products below`);
    console.log(`🎯 First product on page 1 will be: ${mergedProducts[0]?.name || 'N/A'}`);
    console.log(`📄 First page (6 products) will show: ${mergedProducts.slice(0, 6).map(p => p.name).join(', ')}`);
    
    return mergedProducts;
}

// Initialize and update product data
async function initializeProducts() {
    console.log('🚀 Initializing products from Supabase...');
    
    // Initialize Supabase
    initSupabase();
    
    // Wait longer for Supabase to initialize (especially if loading from CDN)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Merge products
    const mergedProducts = await mergeProductsWithStatic();
    
    // Update global product data
    // Note: We preserve the original sampleFabrics array, but update fabricData with merged products
    if (typeof window.fabricData !== 'undefined') {
        window.fabricData = mergedProducts;
        console.log('✅ Updated window.fabricData with merged products (new at top, all static preserved)');
    }
    
    // Also update filteredFabrics if it exists
    if (typeof window.filteredFabrics !== 'undefined') {
        window.filteredFabrics = [...mergedProducts];
        console.log('✅ Updated window.filteredFabrics with merged products');
    }
    
    // Don't overwrite sampleFabrics - keep original static products array intact
    // This ensures we always have the base static products for future merges
    
    return mergedProducts;
    
    // Trigger product display if on products page
    if (window.location.pathname.includes('products.html') || 
        window.location.href.includes('products.html')) {
        
        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    if (typeof window.displayFabrics === 'function') {
                        window.displayFabrics();
                    } else if (typeof window.initializeProductsPage === 'function') {
                        window.initializeProductsPage();
                    }
                }, 500);
            });
        } else {
            setTimeout(() => {
                if (typeof window.displayFabrics === 'function') {
                    window.displayFabrics();
                } else if (typeof window.initializeProductsPage === 'function') {
                    window.initializeProductsPage();
                }
            }, 500);
        }
    }
    
    return mergedProducts;
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProducts);
} else {
    initializeProducts();
}

// Export functions for global use
window.fetchProductsFromSupabase = fetchProductsFromSupabase;
window.mergeProductsWithStatic = mergeProductsWithStatic;
window.initializeProducts = initializeProducts;

