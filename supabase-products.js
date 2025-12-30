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
        console.warn('Supabase library not loaded. Loading from CDN...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/dist/umd/supabase.min.js';
        script.onload = () => {
            if (window.supabase && typeof window.supabase.createClient === 'function') {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase client initialized');
            }
        };
        document.head.appendChild(script);
    } else {
        if (typeof window.supabase.createClient === 'function') {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized');
        } else if (typeof window.supabase.from === 'function') {
            supabaseClient = window.supabase;
            console.log('✅ Using existing Supabase client');
        }
    }
}

// Fetch products from Supabase
async function fetchProductsFromSupabase() {
    if (!supabaseClient) {
        initSupabase();
        // Wait a bit for initialization
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (!supabaseClient || typeof supabaseClient.from !== 'function') {
        console.warn('Supabase client not available. Using static products only.');
        return [];
    }
    
    try {
        const { data: products, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('status', 'active') // Only fetch active products
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching products from Supabase:', error);
            return [];
        }
        
        if (!products || products.length === 0) {
            console.log('No products found in Supabase database.');
            return [];
        }
        
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
        staticProducts = window.sampleFabrics;
    }
    
    // Create a map to avoid duplicates (by name or ID)
    const productMap = new Map();
    
    // First, add static products
    staticProducts.forEach(product => {
        const key = product.id || product.name;
        if (!productMap.has(key)) {
            productMap.set(key, product);
        }
    });
    
    // Then, add Supabase products (they will override static products with same ID)
    supabaseProducts.forEach(product => {
        const key = product.id || product.name;
        productMap.set(key, product);
    });
    
    // Convert map back to array
    const mergedProducts = Array.from(productMap.values());
    
    console.log(`✅ Merged products: ${supabaseProducts.length} from Supabase + ${staticProducts.length} static = ${mergedProducts.length} total`);
    
    return mergedProducts;
}

// Initialize and update product data
async function initializeProducts() {
    // Initialize Supabase
    initSupabase();
    
    // Wait a moment for Supabase to initialize
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Merge products
    const mergedProducts = await mergeProductsWithStatic();
    
    // Update global product data if it exists
    if (typeof window.fabricData !== 'undefined') {
        window.fabricData = mergedProducts;
        console.log('✅ Updated window.fabricData with merged products');
    }
    
    if (typeof window.sampleFabrics !== 'undefined') {
        window.sampleFabrics = mergedProducts;
        console.log('✅ Updated window.sampleFabrics with merged products');
    }
    
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

