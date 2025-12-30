// Dashboard functionality with Analytics
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    Auth.requireAuth();
    
    // Initialize sidebar toggle
    initializeSidebarToggle();
    
    // Load statistics
    await loadStatistics();
    
    // Load analytics
    await loadAnalytics();
    
    // Initialize charts
    initializeCharts();
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
        Auth.logout();
    });
    
    // View website link
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
    
    function initializeSidebarToggle() {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('sidebarToggle');
        
        if (!sidebar || !toggleBtn) return;
        
        // Check if sidebar state is saved
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
        }
        
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            // Save state
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }
    
    // Analytics date range change
    const dateRangeSelect = document.getElementById('analyticsDateRange');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', async (e) => {
            await loadAnalytics(e.target.value);
        });
    }
    
    // Chart metric switcher
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updatePerformanceChart(e.target.dataset.metric);
        });
    });
    
    async function loadStatistics() {
        try {
            // Load product count
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('id', { count: 'exact' });
            
            if (!productsError && products) {
                const totalProducts = products.length || 0;
                const activeProducts = products.filter(p => p.status === 'active').length || totalProducts;
                
                document.getElementById('totalDresses').textContent = totalProducts;
                document.getElementById('activeProducts').textContent = activeProducts;
            }
            
            // Load blog count
            const { data: blogs, error: blogsError } = await supabase
                .from('blogs')
                .select('id', { count: 'exact' });
            
            if (!blogsError && blogs) {
                document.getElementById('totalBlogs').textContent = blogs.length || 0;
            }
            
            // Load videos count
            const { data: videos, error: videosError } = await supabase
                .from('youtube_videos')
                .select('id', { count: 'exact' });
            
            if (!videosError && videos) {
                // Update if you have a videos stat card
            }
            
            // Revenue calculation
            const { data: allProducts } = await supabase
                .from('products')
                .select('price');
            
            const totalRevenue = allProducts?.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) || 0;
            document.getElementById('revenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
            
        } catch (error) {
            console.error('Error loading statistics:', error);
            document.getElementById('totalDresses').textContent = '0';
            document.getElementById('totalBlogs').textContent = '0';
            document.getElementById('activeProducts').textContent = '0';
            document.getElementById('revenue').textContent = '₹0';
        }
    }
    
    async function loadAnalytics(days = 30) {
        try {
            // Load products for analytics
            const { data: products } = await supabase
                .from('products')
                .select('*');
            
            const totalProducts = products?.length || 0;
            const activeProducts = products?.filter(p => p.status === 'active').length || 0;
            
            // Update analytics metrics
            document.getElementById('analyticsTotalProducts').textContent = totalProducts;
            document.getElementById('analyticsActiveProducts').textContent = activeProducts;
            
            // Calculate revenue
            const totalRevenue = products?.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) || 0;
            document.getElementById('analyticsRevenue').textContent = `₹${totalRevenue.toLocaleString('en-IN')}`;
            
            // Mock conversion rate and other metrics
            const conversionRate = (Math.random() * 5 + 2).toFixed(1);
            document.getElementById('analyticsConversion').textContent = `${conversionRate}%`;
            
            // Update mini charts
            updateMiniCharts();
            
            // Update category chart
            updateCategoryChart(products || []);
            
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
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
        
        ['productsMiniChart', 'activeMiniChart', 'revenueMiniChart', 'conversionMiniChart'].forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                new Chart(ctx, {
                    ...ctxConfig,
                    data: {
                        labels: Array.from({length: 7}, (_, i) => i),
                        datasets: [{
                            data: Array.from({length: 7}, () => Math.random() * 100),
                            borderColor: '#007A5E',
                            backgroundColor: 'rgba(0, 122, 94, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    }
                });
            }
        });
    }
    
    function updateMiniCharts() {
        // Update mini chart data
        document.querySelectorAll('.metric-chart-mini canvas').forEach(canvas => {
            const chart = Chart.getChart(canvas);
            if (chart) {
                chart.data.datasets[0].data = Array.from({length: 7}, () => Math.random() * 100);
                chart.update();
            }
        });
    }
    
    function createPerformanceChart() {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        window.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
                datasets: [{
                    label: 'Views',
                    data: Array.from({length: 30}, () => Math.random() * 1000 + 500),
                    borderColor: '#007A5E',
                    backgroundColor: 'rgba(0, 122, 94, 0.1)',
                    tension: 0.4,
                    fill: true
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
        if (!window.performanceChart) return;
        
        const colors = {
            views: '#007A5E',
            sales: '#DC143C',
            revenue: '#C9A961'
        };
        
        window.performanceChart.data.datasets[0].label = metric.charAt(0).toUpperCase() + metric.slice(1);
        window.performanceChart.data.datasets[0].borderColor = colors[metric] || '#007A5E';
        window.performanceChart.data.datasets[0].backgroundColor = colors[metric] ? colors[metric] + '1A' : 'rgba(0, 122, 94, 0.1)';
        window.performanceChart.data.datasets[0].data = Array.from({length: 30}, () => Math.random() * 1000 + 500);
        window.performanceChart.update();
    }
    
    function createCategoryChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        window.categoryChart = new Chart(ctx, {
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
    
    function updateCategoryChart(products) {
        if (!window.categoryChart) return;
        
        // Count products by category
        const categoryCounts = {};
        products.forEach(product => {
            const category = product.category || 'Other';
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        // Update chart data
        const categories = ['Lehenga', 'Kurta', 'Dress', 'Kids Wear', 'Other'];
        const data = categories.map(cat => categoryCounts[cat.toLowerCase()] || categoryCounts[cat] || 0);
        
        window.categoryChart.data.datasets[0].data = data;
        window.categoryChart.update();
    }
});
