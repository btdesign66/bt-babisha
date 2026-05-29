// Edit blog page
document.addEventListener('DOMContentLoaded', async () => {
    Auth.requireAuth();
    
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    if (!blogId) {
        alert('Blog ID not found. Redirecting to blogs page.');
        window.location.href = 'blogs.html';
        return;
    }
    
    const form = document.getElementById('blogForm');
    const imageInput = document.getElementById('blogImage');
    const imagePreview = document.getElementById('imagePreview');
    const youtubeUrlInput = document.getElementById('blogYoutubeUrl');
    const youtubePreview = document.getElementById('youtubePreview');
    
    // Load blog data
    await loadBlog(blogId);
    
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
            let imageUrl = currentBlog.image_url || '';
            
            // Upload new image if provided
            if (imageFile && imageFile.size > 0) {
                try {
                    const fileExt = imageFile.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                    const filePath = fileName;
                    
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('blogs')
                        .upload(filePath, imageFile);
                    
                    if (uploadError) throw uploadError;
                    
                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                        .from('blogs')
                        .getPublicUrl(filePath);
                    
                    imageUrl = publicUrl;
                } catch (storageError) {
                    console.error('Storage error:', storageError);
                    // If storage fails, keep existing image URL
                }
            }
            
            // Extract YouTube video ID if URL is provided
            let youtubeVideoId = null;
            if (youtubeUrl) {
                youtubeVideoId = extractYouTubeId(youtubeUrl);
            }
            
            // Generate slug from title
            const slug = generateSlug(title);
            
            // Update blog in database
            const { data, error } = await supabase
                .from('blogs')
                .update({
                    title: title,
                    slug: slug,
                    category: category,
                    author: author,
                    content: content,
                    status: status || 'draft',
                    published_date: publishedDate || currentBlog.published_date,
                    image_url: imageUrl || null,
                    youtube_url: youtubeUrl || null,
                    youtube_video_id: youtubeVideoId,
                    updated_at: new Date().toISOString()
                })
                .eq('id', blogId)
                .select();
            
            if (error) throw error;
            
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = 'Blog updated successfully! Redirecting...';
            form.insertBefore(successDiv, form.firstChild);
            
            // Redirect after 1 second
            setTimeout(() => {
                window.location.href = 'blogs.html';
            }, 1000);
            
        } catch (error) {
            console.error('Error updating blog:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = error.message || 'Error updating blog. Please try again.';
            form.insertBefore(errorDiv, form.firstChild);
        }
    });
    
    let currentBlog = null;
    
    async function loadBlog(id) {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            
            currentBlog = data;
            
            // Populate form
            document.getElementById('blogTitle').value = data.title || '';
            document.getElementById('blogCategory').value = data.category || '';
            document.getElementById('blogAuthor').value = data.author || '';
            document.getElementById('blogContent').value = data.content || '';
            document.getElementById('blogStatus').value = data.status || 'draft';
            document.getElementById('blogYoutubeUrl').value = data.youtube_url || '';
            
            if (data.published_date) {
                const date = new Date(data.published_date);
                document.getElementById('blogPublishedDate').value = date.toISOString().split('T')[0];
            }
            
            // Show existing image
            if (data.image_url) {
                imagePreview.innerHTML = `<img src="${data.image_url}" alt="Current image">`;
                imagePreview.classList.add('show');
            }
            
            // Show existing YouTube video if available
            if (data.youtube_video_id) {
                youtubePreview.innerHTML = `
                    <div style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                        <p style="margin-bottom: 10px; color: #333;">Current Video:</p>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${data.youtube_video_id}" 
                                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen style="max-width: 100%;"></iframe>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Error loading blog:', error);
            alert('Error loading blog. Redirecting to blogs page.');
            window.location.href = 'blogs.html';
        }
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
    
    function extractYouTubeId(url) {
        if (!url) return null;
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });
    
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
});
