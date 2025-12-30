// Helper function to wait for Supabase to be ready
function waitForSupabase(maxAttempts = 50) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const checkSupabase = () => {
            attempts++;
            if (window.supabase && typeof window.supabase.from === 'function') {
                console.log('Supabase is ready for use');
                resolve(window.supabase);
                return;
            }
            if (attempts < maxAttempts) {
                setTimeout(checkSupabase, 100);
            } else {
                reject(new Error('Supabase failed to initialize'));
            }
        };
        checkSupabase();
    });
}

// Add product page
document.addEventListener('DOMContentLoaded', async () => {
    Auth.requireAuth();
    
    // Wait for Supabase to be initialized
    try {
        await waitForSupabase();
    } catch (error) {
        console.error('Failed to wait for Supabase:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Supabase initialization failed. Please refresh the page.';
        document.body.insertBefore(errorDiv, document.body.firstChild);
        return;
    }
    
    const form = document.getElementById('productForm');
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    
    // Image preview
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
        
        // Ensure we're using the global supabase instance
        const supabaseClient = window.supabase || supabase;
        
        // Check if Supabase is initialized
        if (!supabaseClient || typeof supabaseClient.from !== 'function') {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Supabase is not initialized. Please refresh the page and check your config.js file.';
            form.insertBefore(errorDiv, form.firstChild);
            console.error('Supabase client not initialized. Available:', {
                windowSupabase: window.supabase,
                supabase: supabase,
                type: typeof window.supabase
            });
            return;
        }
        
        const formData = new FormData(form);
        const name = formData.get('name');
        const price = formData.get('price');
        const category = formData.get('category');
        const description = formData.get('description');
        const status = formData.get('status');
        const stock = formData.get('stock');
        const imageFile = formData.get('image');
        
        // Validate required fields
        if (!name || !price || !category) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Please fill in all required fields (Name, Price, Category).';
            form.insertBefore(errorDiv, form.firstChild);
            return;
        }
        
        // Remove existing messages
        const existingError = document.querySelector('.error-message');
        const existingSuccess = document.querySelector('.success-message');
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';
        
        try {
            console.log('Starting product submission...');
            let imageUrl = '';
            
            // Upload image to Supabase Storage if file is provided
            if (imageFile && imageFile.size > 0) {
                try {
                    const fileExt = imageFile.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = fileName;
                    
                    const { data: uploadData, error: uploadError } = await supabaseClient.storage
                        .from('products')
                        .upload(filePath, imageFile);
                    
                    if (uploadError) throw uploadError;
                    
                    // Get public URL
                    const { data: { publicUrl } } = supabaseClient.storage
                        .from('products')
                        .getPublicUrl(filePath);
                    
                    imageUrl = publicUrl;
                } catch (storageError) {
                    console.error('Storage error:', storageError);
                    // If storage fails, continue without image (you can also throw error to stop submission)
                    // throw new Error('Failed to upload image. Please check your storage configuration.');
                }
            }
            
            // Insert product into database
            console.log('Inserting product into database...', {
                name,
                price: parseFloat(price),
                category,
                status: status || 'active',
                stock: parseInt(stock) || 0
            });
            
            const { data, error } = await supabaseClient
                .from('products')
                .insert([
                    {
                        name: name,
                        price: parseFloat(price),
                        category: category,
                        description: description || null,
                        status: status || 'active',
                        stock: parseInt(stock) || 0,
                        image_url: imageUrl || null
                    }
                ])
                .select();
            
            if (error) {
                console.error('Database error:', error);
                throw error;
            }
            
            console.log('Product added successfully!', data);
            
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = 'Product added successfully! Redirecting...';
            form.insertBefore(successDiv, form.firstChild);
            
            // Redirect after 1 second
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1000);
            
        } catch (error) {
            console.error('Error adding product:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            
            // Provide more detailed error messages
            let errorMessage = 'Error adding product. Please try again.';
            if (error.message) {
                errorMessage = error.message;
            } else if (error.code) {
                errorMessage = `Error (${error.code}): ${error.message || 'Database error occurred'}`;
            }
            
            // Common error messages
            if (errorMessage.includes('permission') || errorMessage.includes('policy')) {
                errorMessage += ' Make sure you have run the SQL policies in Supabase to allow INSERT operations.';
            } else if (errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
                errorMessage += ' Make sure the products table exists in your Supabase database.';
            }
            
            errorDiv.textContent = errorMessage;
            form.insertBefore(errorDiv, form.firstChild);
        } finally {
            // Restore button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });
    
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
});
