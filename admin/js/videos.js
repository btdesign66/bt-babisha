// Videos list page
document.addEventListener('DOMContentLoaded', async () => {
    Auth.requireAuth();
    
    await loadVideos();
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });
    
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
    
    async function loadVideos() {
        const tbody = document.getElementById('videosTableBody');
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading videos...</td></tr>';
        
        try {
            const { data: videos, error } = await supabase
                .from('youtube_videos')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error loading videos:', error);
                tbody.innerHTML = '<tr><td colspan="6" class="empty">Error loading videos. Please check your Supabase configuration.</td></tr>';
                return;
            }
            
            if (!videos || videos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="empty">No videos found. <a href="add-video.html">Add your first video</a></td></tr>';
                return;
            }
            
            tbody.innerHTML = videos.map(video => {
                const thumbnailUrl = `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`;
                return `
                    <tr>
                        <td>
                            <img src="${thumbnailUrl}" alt="${video.title}" class="video-thumbnail" 
                                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'90\'%3E%3Crect fill=\'%23ddd\' width=\'120\' height=\'90\'/%3E%3Ctext fill=\'%23999\' font-family=\'sans-serif\' font-size=\'14\' dy=\'10.5\' x=\'50%25\' text-anchor=\'middle\'%3ENo Image%3C/text%3E%3C/svg%3E'">
                        </td>
                        <td>${video.title || 'Untitled Video'}</td>
                        <td><code>${video.youtube_id}</code></td>
                        <td>${video.category || 'N/A'}</td>
                        <td>
                            <span class="status-badge ${video.status || 'inactive'}">${video.status || 'inactive'}</span>
                            ${video.featured ? '<span class="featured-badge">Featured</span>' : ''}
                        </td>
                        <td>
                            <div class="action-buttons">
                                <a href="edit-video.html?id=${video.id}" class="btn-secondary btn-edit">Edit</a>
                                <button onclick="deleteVideo('${video.id}')" class="btn-danger btn-delete">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Exception loading videos:', error);
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Error loading videos. Please refresh the page.</td></tr>';
        }
    }
    
    window.deleteVideo = async (id) => {
        if (!confirm('Are you sure you want to delete this video?')) {
            return;
        }
        
        try {
            const { error } = await supabase
                .from('youtube_videos')
                .delete()
                .eq('id', id);
            
            if (error) {
                alert('Error deleting video: ' + error.message);
                return;
            }
            
            alert('Video deleted successfully!');
            loadVideos();
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Error deleting video. Please try again.');
        }
    };
});


