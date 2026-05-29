// Sidebar Toggle Functionality - Shared across all admin pages
(function() {
    'use strict';
    
    function initSidebarToggle() {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('sidebarToggle');
        
        if (!sidebar) {
            console.warn('Sidebar element not found');
            return;
        }
        
        if (!toggleBtn) {
            console.warn('Sidebar toggle button not found');
            return;
        }
        
        console.log('Sidebar toggle initialized');
        
        // Check if sidebar state is saved
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            console.log('Sidebar restored as collapsed');
        }
        
        // Add click event listener
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Toggle button clicked');
            
            sidebar.classList.toggle('collapsed');
            const isNowCollapsed = sidebar.classList.contains('collapsed');
            
            // Save state to localStorage
            localStorage.setItem('sidebarCollapsed', isNowCollapsed);
            console.log('Sidebar toggled:', isNowCollapsed ? 'collapsed' : 'expanded');
        });
        
        // Also handle click on the button itself
        toggleBtn.style.cursor = 'pointer';
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebarToggle);
    } else {
        // DOM is already loaded
        initSidebarToggle();
    }
    
    // Also try after a short delay as fallback
    setTimeout(initSidebarToggle, 100);
})();

