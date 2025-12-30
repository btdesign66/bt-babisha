// Add blog page
document.addEventListener('DOMContentLoaded', () => {
    Auth.requireAuth();
    
    const form = document.getElementById('blogForm');
    const imageInput = document.getElementById('blogImage');
    const imagePreview = document.getElementById('imagePreview');
    const youtubeUrlInput = document.getElementById('blogYoutubeUrl');
    const youtubePreview = document.getElementById('youtubePreview');
    
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
    
    // YouTube URL preview
    youtubeUrlInput.addEventListener('input', (e) => {
        const url = e.target.value;
        if (url) {
            const videoId = extractYouTubeId(url);
            if (videoId) {
                youtubePreview.innerHTML = `
                    <div style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                        <p style="margin-bottom: 10px; color: #333;">Preview:</p>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" 
                                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen style="max-width: 100%;"></iframe>
                    </div>
                `;
            } else {
                youtubePreview.innerHTML = '<p style="color: #dc3545; margin-top: 10px;">Invalid YouTube URL</p>';
            }
        } else {
            youtubePreview.innerHTML = '';
        }
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const title = formData.get('title');
        const category = formData.get('category');
        const author = formData.get('author');
        const content = formData.get('content');
        const status = formData.get('status');
        const publishedDate = formData.get('published_date');
        const youtubeUrl = formData.get('youtube_url');
        const imageFile = formData.get('image');
        
        // Remove existing messages
        const existingError = document.querySelector('.error-message');
        const existingSuccess = document.querySelector('.success-message');
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
        
        try {
            let imageUrl = '';
            
            // Upload image to Supabase Storage if file is provided
            if (imageFile && imageFile.size > 0) {
                try {
                    const fileExt = imageFile.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = fileName;
                    
                    const supabaseClient = window.supabase || supabase;
                    const { data: uploadData, error: uploadError } = await supabaseClient.storage
                        .from('blogs')
                        .upload(filePath, imageFile);
                    
                    if (uploadError) throw uploadError;
                    
                    // Get public URL
                    const { data: { publicUrl } } = supabaseClient.storage
                        .from('blogs')
                        .getPublicUrl(filePath);
                    
                    imageUrl = publicUrl;
                } catch (storageError) {
                    console.error('Storage error:', storageError);
                    // If storage fails, continue without image
                }
            }
            
            // Extract YouTube video ID if URL is provided
            let youtubeVideoId = null;
            if (youtubeUrl) {
                youtubeVideoId = extractYouTubeId(youtubeUrl);
            }
            
            // Generate slug from title
            let slug = generateSlug(title);
            // Ensure slug is never empty - use timestamp as fallback
            if (!slug || slug.trim() === '') {
                slug = 'blog-' + Date.now();
            }
            
            console.log('Generated slug:', slug);
            console.log('Blog data being inserted:', {
                title,
                slug,
                category,
                author,
                status: status || 'draft'
            });
            
            // Ensure we're using the correct Supabase client
            const supabaseClient = window.supabase || supabase;
            if (!supabaseClient || typeof supabaseClient.from !== 'function') {
                throw new Error('Supabase client not initialized');
            }
            
            // Insert blog into database
            const { data, error } = await supabaseClient
                .from('blogs')
                .insert([
                    {
                        title: title,
                        slug: slug,
                        category: category || null,
                        author: author || null,
                        content: content,
                        status: status || 'draft',
                        published_date: publishedDate || new Date().toISOString(),
                        image_url: imageUrl || null,
                        youtube_url: youtubeUrl || null,
                        youtube_video_id: youtubeVideoId || null
                    }
                ])
                .select();
            
            if (error) {
                console.error('Supabase error details:', error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                console.error('Error details:', error.details);
                throw error;
            }
            
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = 'Blog created successfully! Redirecting...';
            form.insertBefore(successDiv, form.firstChild);
            
            // Redirect after 1 second
            setTimeout(() => {
                window.location.href = 'blogs.html';
            }, 1000);
            
        } catch (error) {
            console.error('Error creating blog:', error);
            console.error('Full error object:', JSON.stringify(error, null, 2));
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            console.error('Error details:', error.details);
            console.error('Error hint:', error.hint);
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            
            // Show more detailed error message
            let errorMessage = 'Error creating blog. ';
            if (error.message) {
                errorMessage += error.message;
            } else if (error.details) {
                errorMessage += error.details;
            } else {
                errorMessage += 'Please check the console for details.';
            }
            
            // Add specific help for common errors
            if (error.message && error.message.includes('slug')) {
                errorMessage += ' Make sure the title is not empty.';
            } else if (error.message && error.message.includes('null value')) {
                errorMessage += ' Please fill in all required fields.';
            } else if (error.message && error.message.includes('violates not-null constraint')) {
                errorMessage += ' Some required field is missing. Check the console for details.';
            }
            
            errorDiv.textContent = errorMessage;
            form.insertBefore(errorDiv, form.firstChild);
        }
    });
    
    function extractYouTubeId(url) {
        if (!url) return null;
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    function generateSlug(title) {
        if (!title) return '';
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    }
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });
    
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
});
