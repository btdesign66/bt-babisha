// Products list page
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
                            <button onclick="deleteProduct(${product.id})" class="btn-danger">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
        } catch (error) {
            console.error('Error:', error);
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Error loading products. Please check your Supabase configuration.</td></tr>';
        }
    }
    
    window.deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }
        
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            await loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product. Please try again.');
        }
    };
});
