// Login page functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const backLink = document.getElementById('backToWebsite');
    
    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
    });
    
    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Remove existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        try {
            const result = await Auth.login(email, password);
            
            if (result.success) {
                if (rememberMe) {
                    localStorage.setItem('remember_email', email);
                } else {
                    localStorage.removeItem('remember_email');
                }
                window.location.href = 'dashboard.html';
            } else {
                showError(result.error || 'Invalid email or password');
            }
        } catch (error) {
            showError('An error occurred. Please try again.');
            console.error('Login error:', error);
        }
    });
    
    // Load remembered email
    const rememberedEmail = localStorage.getItem('remember_email');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
    
    // Back to website link
    backLink.addEventListener('click', (e) => {
        e.preventDefault();
        // You can change this to your actual website URL
        window.location.href = '../index.html'; // or your main website URL
    });
    
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
    }
});
