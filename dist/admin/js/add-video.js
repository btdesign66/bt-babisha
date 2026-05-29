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

// Extract YouTube video ID from URL
function extractYouTubeId(url) {
    if (!url) return null;
    
    // If it's already just an ID (11 characters, alphanumeric)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
        return url.trim();
    }
    
    // Try various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/,
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}

// Add video page
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
    
    const form = document.getElementById('videoForm');
    const youtubeUrlInput = document.getElementById('youtubeUrl');
    const previewContainer = document.getElementById('previewContainer');
    const videoPreview = document.getElementById('videoPreview');
    
    // Preview YouTube video
    youtubeUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        const videoId = extractYouTubeId(url);
        
        if (videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}`;
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            
            previewContainer.innerHTML = `
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
                    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                            src="${embedUrl}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen></iframe>
                </div>
                <p style="margin-top: 10px; color: #666;">
                    <strong>Video ID:</strong> ${videoId}<br>
                    <img src="${thumbnailUrl}" alt="Thumbnail" style="max-width: 200px; margin-top: 10px; border-radius: 4px;">
                </p>
            `;
            videoPreview.style.display = 'block';
        } else if (url.length > 0) {
            previewContainer.innerHTML = '<p style="color: #dc143c;">Invalid YouTube URL or Video ID</p>';
            videoPreview.style.display = 'block';
        } else {
            videoPreview.style.display = 'none';
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const youtubeUrl = youtubeUrlInput.value.trim();
        const videoId = extractYouTubeId(youtubeUrl);
        
        if (!videoId) {
            alert('Please enter a valid YouTube URL or Video ID');
            return;
        }
        
        const formData = {
            youtube_id: videoId,
            title: document.getElementById('title').value.trim(),
            category: document.getElementById('category').value,
            description: document.getElementById('description').value.trim(),
            status: document.getElementById('status').value,
            featured: document.getElementById('featured').value === 'true',
            display_order: parseInt(document.getElementById('order').value) || 0
        };
        
        // Remove existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        try {
            const { data, error } = await supabase
                .from('youtube_videos')
                .insert([formData])
                .select();
            
            if (error) {
                throw error;
            }
            
            alert('Video added successfully!');
            window.location.href = 'videos.html';
            
        } catch (error) {
            console.error('Error adding video:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Error adding video: ' + (error.message || 'Unknown error');
            form.insertBefore(errorDiv, form.firstChild);
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


