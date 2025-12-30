// Dashboard functionality
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    Auth.requireAuth();
    
    // Load statistics
    await loadStatistics();
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });
    
    // View website link
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        // Change this to your actual website URL
        window.open('../index.html', '_blank');
    });
    
    async function loadStatistics() {
        try {
            // Load product count
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('id', { count: 'exact' });
            
            if (!productsError && products) {
                document.getElementById('totalDresses').textContent = products.length || 0;
                document.getElementById('activeProducts').textContent = products.length || 0;
            }
            
            // Load blog count
            const { data: blogs, error: blogsError } = await supabase
                .from('blogs')
                .select('id', { count: 'exact' });
            
            if (!blogsError && blogs) {
                document.getElementById('totalBlogs').textContent = blogs.length || 0;
            }
            
            // Revenue (you can calculate this from orders if you have an orders table)
            // For now, showing 0
            document.getElementById('revenue').textContent = '₹0';
            
        } catch (error) {
            console.error('Error loading statistics:', error);
            // If tables don't exist yet, show 0
            document.getElementById('totalDresses').textContent = '0';
            document.getElementById('totalBlogs').textContent = '0';
            document.getElementById('activeProducts').textContent = '0';
            document.getElementById('revenue').textContent = '₹0';
        }
    }
});
