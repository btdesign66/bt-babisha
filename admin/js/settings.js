// Advanced Settings Management
document.addEventListener('DOMContentLoaded', async () => {
    Auth.requireAuth();
    
    // Initialize settings tabs
    initializeTabs();
    
    // Load saved settings
    await loadSettings();
    
    // Event listeners
    document.getElementById('logoutBtn').addEventListener('click', () => Auth.logout());
    document.getElementById('viewWebsite').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('../index.html', '_blank');
    });
    
    document.getElementById('saveAllSettings').addEventListener('click', saveAllSettings);
    
    function initializeTabs() {
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update active tab
                document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding panel
                document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
                document.getElementById(`${targetTab}-settings`).classList.add('active');
            });
        });
    }
    
    async function loadSettings() {
        try {
            // In a real implementation, load from database
            // For now, use localStorage or defaults
            const savedSettings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
            
            // Apply saved settings to form fields
            Object.keys(savedSettings).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = savedSettings[key];
                    } else {
                        element.value = savedSettings[key];
                    }
                }
            });
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    async function saveAllSettings() {
        try {
            const settings = {};
            
            // Collect all settings
            document.querySelectorAll('.settings-panel input, .settings-panel select, .settings-panel textarea').forEach(element => {
                if (element.id) {
                    if (element.type === 'checkbox') {
                        settings[element.id] = element.checked;
                    } else {
                        settings[element.id] = element.value;
                    }
                }
            });
            
            // Save to localStorage (in real implementation, save to database)
            localStorage.setItem('adminSettings', JSON.stringify(settings));
            
            // Show success message
            alert('All settings have been saved successfully!\n\nNote: In a production environment, these settings would be saved to the database and applied system-wide.');
            
            console.log('Settings saved:', settings);
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error saving settings. Please try again.');
        }
    }
});

