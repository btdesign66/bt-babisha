// Blogs list page
document.addEventListener('DOMContentLoaded', async () => {
    Auth.requireAuth();
    
    await loadBlogs();
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });
    
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
    
    async function loadBlogs() {
        const tbody = document.getElementById('blogsTableBody');
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading blogs...</td></tr>';
        
        try {
            const { data: blogs, error } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error loading blogs:', error);
                tbody.innerHTML = '<tr><td colspan="6" class="empty">Error loading blogs. Please check your Supabase configuration.</td></tr>';
                return;
            }
            
            if (!blogs || blogs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="empty">No blogs found. <a href="add-blog.html">Create your first blog</a></td></tr>';
                return;
            }
            
            tbody.innerHTML = blogs.map(blog => {
                const publishedDate = blog.published_date 
                    ? new Date(blog.published_date).toLocaleDateString()
                    : blog.created_at 
                        ? new Date(blog.created_at).toLocaleDateString()
                        : 'N/A';
                
                return `
                    <tr>
                        <td><strong>${blog.title || 'Untitled'}</strong></td>
                        <td>${blog.category || 'N/A'}</td>
                        <td>${blog.author || 'N/A'}</td>
                        <td>${publishedDate}</td>
                        <td>
                            <span class="status-badge ${blog.status || 'draft'}">${blog.status || 'draft'}</span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <a href="edit-blog.html?id=${blog.id}" class="btn-secondary btn-edit">Edit</a>
                                <button onclick="deleteBlog(${blog.id})" class="btn-danger">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Error:', error);
            tbody.innerHTML = '<tr><td colspan="6" class="empty">Error loading blogs. Please check your Supabase configuration.</td></tr>';
        }
    }
    
    window.deleteBlog = async (id) => {
        if (!confirm('Are you sure you want to delete this blog?')) {
            return;
        }
        
        try {
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            await loadBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Error deleting blog. Please try again.');
        }
    };
});
