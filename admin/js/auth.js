// Authentication utilities
const Auth = {
    // Simple authentication - you should replace this with actual Supabase auth
    // For now, using localStorage for demo purposes
    isAuthenticated: () => {
        return localStorage.getItem('admin_authenticated') === 'true';
    },
    
    login: async (email, password) => {
        // TODO: Implement actual Supabase authentication
        // For demo purposes, using simple check
        // In production, use: const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        
        if (email && password) {
            localStorage.setItem('admin_authenticated', 'true');
            localStorage.setItem('admin_email', email);
            return { success: true };
        }
        return { success: false, error: 'Invalid credentials' };
    },
    
    logout: () => {
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_email');
        window.location.href = 'index.html';
    },
    
    requireAuth: () => {
        if (!Auth.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }
};
