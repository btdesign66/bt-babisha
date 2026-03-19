// Edit product page
document.addEventListener('DOMContentLoaded', async () => {
    Auth.requireAuth();
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        alert('Product ID not found. Redirecting to products page.');
        window.location.href = 'products.html';
        return;
    }
    
    const form = document.getElementById('productForm');
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    
    // Load product data
    await loadProduct(productId);
    
    // Image preview for new file
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                imagePreview.classList.add('show');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name');
        const price = formData.get('price');
        const category = formData.get('category');
        const description = formData.get('description');
        const status = formData.get('status');
        const stock = formData.get('stock');
        const imageFile = formData.get('image');
        
        // Remove existing messages
        const existingError = document.querySelector('.error-message');
        const existingSuccess = document.querySelector('.success-message');
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
        
        try {
            let imageUrl = currentProduct.image_url || '';
            
            // Upload new image if provided
            if (imageFile && imageFile.size > 0) {
                try {
                    const fileExt = imageFile.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = fileName;
                    
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(filePath, imageFile);
                    
                    if (uploadError) throw uploadError;
                    
                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath);
                    
                    imageUrl = publicUrl;
                } catch (storageError) {
                    console.error('Storage error:', storageError);
                    // If storage fails, keep existing image URL
                }
            }
            
            // Update product in database
            const { data, error } = await supabase
                .from('products')
                .update({
                    name: name,
                    price: parseFloat(price),
                    category: category,
                    description: description || null,
                    status: status || 'active',
                    stock: parseInt(stock) || 0,
                    image_url: imageUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', productId)
                .select();
            
            if (error) throw error;
            
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = 'Product updated successfully! Redirecting...';
            form.insertBefore(successDiv, form.firstChild);
            
            // Redirect after 1 second
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1000);
            
        } catch (error) {
            console.error('Error updating product:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = error.message || 'Error updating product. Please try again.';
            form.insertBefore(errorDiv, form.firstChild);
        }
    });
    
    let currentProduct = null;
    
    async function loadProduct(id) {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            
            currentProduct = data;
            
            // Populate form
            document.getElementById('productName').value = data.name || '';
            document.getElementById('productPrice').value = data.price || '';
            document.getElementById('productCategory').value = data.category || '';
            document.getElementById('productDescription').value = data.description || '';
            document.getElementById('productStatus').value = data.status || 'active';
            document.getElementById('productStock').value = data.stock || 0;
            
            // Show existing image
            if (data.image_url) {
                imagePreview.innerHTML = `<img src="${data.image_url}" alt="Current image">`;
                imagePreview.classList.add('show');
            }
            
        } catch (error) {
            console.error('Error loading product:', error);
            alert('Error loading product. Redirecting to products page.');
            window.location.href = 'products.html';
        }
    }
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });
    
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
});
