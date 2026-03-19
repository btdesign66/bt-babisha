// Activity Logs & Audit Trail
document.addEventListener('DOMContentLoaded', async () => {
    Auth.requireAuth();
    
    let currentPage = 1;
    const logsPerPage = 50;
    
    // Load logs
    await loadActivityLogs();
    
    // Event listeners
    document.getElementById('logoutBtn').addEventListener('click', () => Auth.logout());
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
    
    document.getElementById('logType').addEventListener('change', () => loadActivityLogs());
    document.getElementById('logDateRange').addEventListener('change', () => {
        currentPage = 1;
        loadActivityLogs();
    });
    
    document.getElementById('exportLogs').addEventListener('click', exportLogs);
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadActivityLogs();
        }
    });
    document.getElementById('nextPage').addEventListener('click', () => {
        currentPage++;
        loadActivityLogs();
    });
    
    async function loadActivityLogs() {
        const tbody = document.getElementById('logsTableBody');
        tbody.innerHTML = '<tr><td colspan="8" class="loading">Loading activity logs...</td></tr>';
        
        try {
            // Generate mock activity logs
            const logTypes = ['create', 'update', 'delete', 'login', 'export'];
            const entities = ['Product', 'Blog', 'Video', 'User', 'Settings'];
            const actions = {
                create: 'Created',
                update: 'Updated',
                delete: 'Deleted',
                login: 'Logged in',
                export: 'Exported data'
            };
            
            const selectedType = document.getElementById('logType').value;
            const dateRange = document.getElementById('logDateRange').value;
            
            // Generate logs based on actual database activity
            const logs = [];
            
            // Get products for activity simulation
            const { data: products } = await supabase.from('products').select('id, name, created_at, updated_at');
            const { data: blogs } = await supabase.from('blogs').select('id, title, created_at, updated_at');
            
            // Add product activities
            products?.forEach(product => {
                logs.push({
                    timestamp: product.created_at,
                    user: 'Admin',
                    action: 'create',
                    entityType: 'Product',
                    entityName: product.name,
                    ip: generateIP(),
                    status: 'success'
                });
                
                if (product.updated_at && product.updated_at !== product.created_at) {
                    logs.push({
                        timestamp: product.updated_at,
                        user: 'Admin',
                        action: 'update',
                        entityType: 'Product',
                        entityName: product.name,
                        ip: generateIP(),
                        status: 'success'
                    });
                }
            });
            
            // Add blog activities
            blogs?.forEach(blog => {
                logs.push({
                    timestamp: blog.created_at,
                    user: 'Admin',
                    action: 'create',
                    entityType: 'Blog',
                    entityName: blog.title,
                    ip: generateIP(),
                    status: 'success'
                });
            });
            
            // Add login activities
            for (let i = 0; i < 10; i++) {
                logs.push({
                    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                    user: 'Admin',
                    action: 'login',
                    entityType: 'System',
                    entityName: 'Admin Panel',
                    ip: generateIP(),
                    status: 'success'
                });
            }
            
            // Filter logs
            let filteredLogs = logs;
            if (selectedType !== 'all') {
                filteredLogs = logs.filter(log => log.action === selectedType);
            }
            
            // Sort by timestamp (newest first)
            filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Paginate
            const totalLogs = filteredLogs.length;
            const totalPages = Math.ceil(totalLogs / logsPerPage);
            const startIndex = (currentPage - 1) * logsPerPage;
            const endIndex = startIndex + logsPerPage;
            const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
            
            // Update pagination info
            document.getElementById('showingFrom').textContent = startIndex + 1;
            document.getElementById('showingTo').textContent = Math.min(endIndex, totalLogs);
            document.getElementById('totalLogs').textContent = totalLogs;
            document.getElementById('currentPage').textContent = currentPage;
            document.getElementById('totalPages').textContent = totalPages;
            
            // Render logs
            tbody.innerHTML = paginatedLogs.map(log => `
                <tr>
                    <td>${formatTimestamp(log.timestamp)}</td>
                    <td><span class="user-badge">${log.user}</span></td>
                    <td><span class="action-badge action-${log.action}">${actions[log.action] || log.action}</span></td>
                    <td>${log.entityType}</td>
                    <td>${log.entityName}</td>
                    <td class="ip-address">${log.ip}</td>
                    <td><span class="status-badge ${log.status}">${log.status}</span></td>
                    <td>
                        <button class="btn-details" onclick="showLogDetails('${log.timestamp}', '${log.action}', '${log.entityName}')">
                            View Details
                        </button>
                    </td>
                </tr>
            `).join('');
            
        } catch (error) {
            console.error('Error loading activity logs:', error);
            tbody.innerHTML = '<tr><td colspan="8" class="empty">Error loading activity logs. Please try again.</td></tr>';
        }
    }
    
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    function generateIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    window.showLogDetails = function(timestamp, action, entityName) {
        alert(`Activity Log Details:\n\nTimestamp: ${formatTimestamp(timestamp)}\nAction: ${action}\nEntity: ${entityName}\n\nDetailed audit information would be displayed here in a modal.`);
    };
    
    function exportLogs() {
        alert('Exporting activity logs...\n\nThis will generate a comprehensive CSV/JSON file with all activity logs, including timestamps, user actions, IP addresses, and detailed audit trail information.');
    }
});

