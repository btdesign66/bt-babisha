// Products list page

// Make deleteProduct globally accessible BEFORE DOMContentLoaded
window.deleteProduct = async function(id) {
    console.log('Delete product called with ID:', id);
    
    if (!id) {
        alert('Error: Product ID is missing.');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
    }
    
    try {
        console.log('Attempting to delete product:', id);
        
        // Wait for supabase to be available
        let attempts = 0;
        while ((!window.supabase || typeof window.supabase.from !== 'function') && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        // Check if supabase is available
        if (!window.supabase || typeof window.supabase.from !== 'function') {
            throw new Error('Supabase client not initialized. Please refresh the page.');
        }
        
        const { data, error } = await window.supabase
            .from('products')
            .delete()
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('Supabase delete error:', error);
            throw error;
        }
        
        console.log('Product deleted successfully:', data);
        alert('Product deleted successfully!');
        
        // Reload products list
        if (typeof window.loadProducts === 'function') {
            await window.loadProducts();
        } else {
            // Fallback: reload page
            window.location.reload();
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        let errorMessage = 'Error deleting product. ';
        
        if (error.message) {
            errorMessage += error.message;
        } else if (error.code) {
            errorMessage += `Error code: ${error.code}. `;
            if (error.code === 'PGRST116') {
                errorMessage += 'This might be a permissions issue. Check your Supabase RLS policies.';
            }
        } else {
            errorMessage += 'Please check the console for details.';
        }
        
        alert(errorMessage);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    Auth.requireAuth();
    
    await loadProducts();
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });
    
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
    
    async function loadProducts() {
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading products...</td></tr>';
        
        try {
            const { data: products, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error loading products:', error);
                tbody.innerHTML = '<tr><td colspan="6" class="empty">Error loading products. Please check your Supabase configuration.</td></tr>';
                return;
            }
            
            if (!products || products.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="empty">No products found. <a href="add-product.html">Add your first product</a></td></tr>';
                return;
            }
            
            tbody.innerHTML = products.map(product => `
                <tr>
                    <td>
                        ${product.image_url ? `<img src="${product.image_url}" alt="${product.name}" class="product-image">` : '<span class="empty">No image</span>'}
                    </td>
                    <td>${product.name || 'N/A'}</td>
                    <td>₹${product.price || '0'}</td>
                    <td>${product.category || 'N/A'}</td>
                    <td>
                        <span class="status-badge ${product.status || 'inactive'}">${product.status || 'inactive'}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <a href="edit-product.html?id=${product.id}" class="btn-secondary btn-edit">Edit</a>
                            <button onclick="window.deleteProduct('${product.id}')" class="btn-danger" data-product-id="${product.id}">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            // Also attach event listeners as fallback (using event delegation)
            tbody.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-danger')) {
                    e.preventDefault();
                    const productId = e.target.getAttribute('data-product-id') || e.target.getAttribute('onclick')?.match(/\('([^']+)'\)/)?.[1];
                    if (productId) {
                        window.deleteProduct(productId);
                    }
                }
            });
            
        } catch (error) {
            console.error('Error:', error);
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Error loading products. Please check your Supabase configuration.</td></tr>';
        }
    }
    
    // Make loadProducts accessible globally for delete function
    window.loadProducts = loadProducts;
});
