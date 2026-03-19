// Supabase Configuration
// Replace these values with your actual Supabase project credentials
// You can find these in your Supabase project settings: Project Settings > API
const SUPABASE_URL = 'https://amjybgakxrbbshzhxjkf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtanliZ2FreHJiYnNoemh4amtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzI5ODUsImV4cCI6MjA4MjE0ODk4NX0.mX4ohTTxfNbAg4mNnnV9wktBGbbhU2cvYR8VhoaSzu0';

// Validate credentials
if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    console.error('⚠️ Supabase credentials not configured!');
    console.error('Please update SUPABASE_URL and SUPABASE_ANON_KEY in config.js with your actual Supabase project credentials.');
}

// Initialize Supabase client
// The Supabase CDN script must be loaded before this file
let supabase;

// Function to initialize Supabase - called when DOM is ready
function initSupabaseClient() {
    // Debug: Check what's available
    console.log('Checking for Supabase library...');
    console.log('window.supabase:', window.supabase);
    console.log('typeof window.supabase:', typeof window.supabase);
    
    if (window.supabase) {
        console.log('window.supabase keys:', Object.keys(window.supabase));
        if (window.supabase.createClient) {
            console.log('Found createClient method');
        }
    }
    
    try {
        let supabaseLib = null;
        
        // Try different ways the UMD build might expose Supabase
        if (window.supabase) {
            // Method 1: Direct createClient
            if (typeof window.supabase.createClient === 'function') {
                supabaseLib = window.supabase;
                console.log('Using window.supabase.createClient');
            }
            // Method 2: Default export
            else if (window.supabase.default && typeof window.supabase.default.createClient === 'function') {
                supabaseLib = window.supabase.default;
                console.log('Using window.supabase.default.createClient');
            }
            // Method 3: Check if it's the client already (shouldn't be, but check)
            else if (typeof window.supabase.from === 'function') {
                console.log('window.supabase is already a client!');
                supabase = window.supabase;
                window.supabase = supabase;
                console.log('✅ Supabase client already initialized');
                return true;
            }
        }
        
        if (!supabaseLib) {
            console.error('❌ Supabase library not found. Make sure the script is loaded before config.js');
            return false;
        }
        
        // Create the client
        console.log('Creating Supabase client with URL:', SUPABASE_URL);
        const client = supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Verify it's a valid client
        if (client && typeof client.from === 'function') {
            supabase = client;
            window.supabase = client;
            console.log('✅ Supabase client initialized successfully');
            console.log('Client methods:', Object.keys(client).slice(0, 10));
            return true;
        } else {
            console.error('❌ Created client is invalid. Missing .from method');
            console.log('Client object:', client);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        return false;
    }
}

// Initialize immediately and retry if needed
(function init() {
    if (initSupabaseClient()) {
        return; // Success!
    }
    
    // If not ready, wait and retry
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 200);
        });
    } else {
        // Try again after a short delay
        setTimeout(init, 200);
    }
})();
