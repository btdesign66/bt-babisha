// Advanced Analytics Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    Auth.requireAuth();
    
    // Initialize charts and load data
    await loadAnalyticsData();
    initializeCharts();
    
    // Event listeners
    document.getElementById('logoutBtn').addEventListener('click', () => Auth.logout());
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
    
    document.getElementById('dateRange').addEventListener('change', async (e) => {
        await loadAnalyticsData(e.target.value);
    });
    
    document.getElementById('exportReport').addEventListener('click', exportReport);
    
    // Chart metric switcher
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updatePerformanceChart(e.target.dataset.metric);
        });
    });
    
    async function loadAnalyticsData(days = 30) {
        try {
            // Load products
            const { data: products } = await supabase
                .from('products')
                .select('*');
            
            const totalProducts = products?.length || 0;
            const activeProducts = products?.filter(p => p.status === 'active').length || 0;
            
            document.getElementById('totalProducts').textContent = totalProducts;
            document.getElementById('activeProducts').textContent = activeProducts;
            
            // Calculate mock metrics for demonstration
            const totalRevenue = products?.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) || 0;
            const avgOrderValue = totalRevenue / (totalProducts || 1);
            const conversionRate = Math.random() * 5 + 2; // Mock 2-7%
            const retentionRate = Math.random() * 20 + 70; // Mock 70-90%
            
            document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
            document.getElementById('avgOrderValue').textContent = `₹${Math.round(avgOrderValue).toLocaleString('en-IN')}`;
            document.getElementById('conversionRate').textContent = `${conversionRate.toFixed(1)}%`;
            document.getElementById('retentionRate').textContent = `${retentionRate.toFixed(1)}%`;
            
            // Load top products
            await loadTopProducts(products || []);
            
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }
    
    async function loadTopProducts(products) {
        const tbody = document.getElementById('topProductsTable');
        
        // Mock analytics data for each product
        const topProducts = products.slice(0, 10).map(product => ({
            ...product,
            views: Math.floor(Math.random() * 10000) + 1000,
            sales: Math.floor(Math.random() * 100) + 10,
            revenue: (Math.floor(Math.random() * 100) + 10) * parseFloat(product.price || 0),
            conversion: (Math.random() * 5 + 1).toFixed(2)
        })).sort((a, b) => b.revenue - a.revenue);
        
        tbody.innerHTML = topProducts.map(product => `
            <tr>
                <td>${product.name || 'N/A'}</td>
                <td><span class="category-badge">${product.category || 'general'}</span></td>
                <td>${product.views.toLocaleString()}</td>
                <td>${product.sales}</td>
                <td>₹${product.revenue.toLocaleString('en-IN')}</td>
                <td>${product.conversion}%</td>
                <td>
                    <span class="trend-indicator ${Math.random() > 0.5 ? 'up' : 'down'}">
                        ${Math.random() > 0.5 ? '↑' : '↓'} ${(Math.random() * 10).toFixed(1)}%
                    </span>
                </td>
            </tr>
        `).join('');
    }
    
    function initializeCharts() {
        // Mini charts for metric cards
        createMiniCharts();
        
        // Main performance chart
        createPerformanceChart();
        
        // Category distribution chart
        createCategoryChart();
    }
    
    function createMiniCharts() {
        const ctxConfig = {
            type: 'line',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                elements: { point: { radius: 0 } }
            }
        };
        
        ['productsChart', 'activeChart', 'revenueChart', 'conversionChart', 'aovChart', 'retentionChart'].forEach(id => {
            const ctx = document.getElementById(id).getContext('2d');
            new Chart(ctx, {
                ...ctxConfig,
                data: {
                    labels: Array.from({length: 7}, (_, i) => i),
                    datasets: [{
                        data: Array.from({length: 7}, () => Math.random() * 100),
                        borderColor: '#007A5E',
                        backgroundColor: 'rgba(0, 122, 94, 0.1)',
                        tension: 0.4
                    }]
                }
            });
        });
    }
    
    function createPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        window.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
                datasets: [{
                    label: 'Views',
                    data: Array.from({length: 30}, () => Math.random() * 1000 + 500),
                    borderColor: '#007A5E',
                    backgroundColor: 'rgba(0, 122, 94, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    function updatePerformanceChart(metric) {
        const colors = {
            views: '#007A5E',
            sales: '#DC143C',
            revenue: '#C9A961'
        };
        
        window.performanceChart.data.datasets[0].label = metric.charAt(0).toUpperCase() + metric.slice(1);
        window.performanceChart.data.datasets[0].borderColor = colors[metric] || '#007A5E';
        window.performanceChart.data.datasets[0].data = Array.from({length: 30}, () => Math.random() * 1000 + 500);
        window.performanceChart.update();
    }
    
    function createCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Lehenga', 'Kurta', 'Dress', 'Kids Wear', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#007A5E',
                        '#DC143C',
                        '#C9A961',
                        '#2C1810',
                        '#8B7355'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    }
    
    function exportReport() {
        alert('Exporting comprehensive analytics report...\n\nThis feature generates a detailed PDF/Excel report with all analytics data, charts, and insights.');
        // In a real implementation, this would generate and download a report
    }
});

