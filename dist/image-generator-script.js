// AI Image Generator JavaScript

// API Configuration - Auto-detect environment
const API_BASE_URL = (() => {
    if (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('vercel.com')) {
        return '/api';
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    } else {
        return '/api';
    }
})();

// State
let currentImageData = null;

// DOM Elements
const elements = {
    promptInput: document.getElementById('imagePrompt'),
    aspectRatio: document.getElementById('aspectRatio'),
    generateBtn: document.getElementById('generateBtn'),
    loadingState: document.getElementById('loadingState'),
    resultSection: document.getElementById('resultSection'),
    generatedImage: document.getElementById('generatedImage'),
    errorDisplay: document.getElementById('errorDisplay'),
    errorMessage: document.getElementById('errorMessage'),
    charCount: document.getElementById('charCount')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateCharCount();
});

// Event Listeners
function initializeEventListeners() {
    elements.promptInput.addEventListener('input', updateCharCount);
    elements.promptInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generateImage();
        }
    });
}

// Update Character Count
function updateCharCount() {
    const count = elements.promptInput.value.length;
    elements.charCount.textContent = count;
    
    if (count > 1800) {
        elements.charCount.style.color = '#dc3545';
    } else if (count > 1500) {
        elements.charCount.style.color = '#ffc107';
    } else {
        elements.charCount.style.color = 'var(--primary-color)';
    }
}

// Set Prompt from Example
function setPrompt(prompt) {
    elements.promptInput.value = prompt;
    updateCharCount();
    elements.promptInput.focus();
    // Scroll to input
    elements.promptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Generate Image
async function generateImage() {
    const prompt = elements.promptInput.value.trim();
    const aspectRatio = elements.aspectRatio.value;

    // Validate input
    if (!prompt) {
        showError('Please enter a description for the image you want to generate.');
        elements.promptInput.focus();
        return;
    }

    if (prompt.length < 10) {
        showError('Please provide a more detailed description (at least 10 characters).');
        elements.promptInput.focus();
        return;
    }

    // Reset UI
    hideError();
    hideResult();
    showLoading();

    // Disable button
    elements.generateBtn.disabled = true;

    try {
        // Call API
        const response = await fetch(`${API_BASE_URL}/generate-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                aspectRatio: aspectRatio
            })
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Server error: ${response.status} ${response.statusText}. Make sure the backend server is running.`);
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate image');
        }

        const result = await response.json();

        if (result.success && (result.imageUrl || result.imageBase64)) {
            currentImageData = result;
            displayResult(result.imageUrl || `data:image/png;base64,${result.imageBase64}`);
            showSuccess('Image generated successfully!');
        } else {
            throw new Error(result.message || 'Failed to generate image');
        }

    } catch (error) {
        console.error('Error generating image:', error);
        let errorMessage = error.message || 'An error occurred while generating the image. Please try again.';
        
        // Provide helpful error messages
        if (error.message.includes('Cannot connect') || error.message.includes('Failed to fetch')) {
            errorMessage = 'Cannot connect to the server. Please make sure the backend server is running on http://localhost:3000';
        } else if (error.message.includes('API key')) {
            errorMessage = 'Image generation service is not configured. Please contact administrator.';
        }
        
        showError(errorMessage);
    } finally {
        hideLoading();
        elements.generateBtn.disabled = false;
    }
}

// Display Result
function displayResult(imageUrl) {
    elements.generatedImage.src = imageUrl;
    elements.generatedImage.onload = () => {
        showResult();
    };
    elements.generatedImage.onerror = () => {
        showError('Failed to load generated image. Please try again.');
    };
}

// Show/Hide UI States
function showLoading() {
    elements.loadingState.style.display = 'block';
}

function hideLoading() {
    elements.loadingState.style.display = 'none';
}

function showResult() {
    elements.resultSection.style.display = 'block';
    elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResult() {
    elements.resultSection.style.display = 'none';
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorDisplay.style.display = 'block';
    elements.errorDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    elements.errorDisplay.style.display = 'none';
}

function showSuccess(message) {
    // You can implement a toast notification here
    console.log('Success:', message);
}

// Download Image
function downloadImage() {
    if (!currentImageData || !currentImageData.imageUrl) {
        showError('No image available to download.');
        return;
    }

    try {
        const link = document.createElement('a');
        link.href = currentImageData.imageUrl;
        link.download = `ai-generated-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading image:', error);
        showError('Failed to download image. Please try right-clicking and saving the image.');
    }
}

// Share Image
async function shareImage() {
    if (!currentImageData || !currentImageData.imageUrl) {
        showError('No image available to share.');
        return;
    }

    try {
        // Convert data URL to blob
        const response = await fetch(currentImageData.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'ai-generated-image.png', { type: 'image/png' });

        if (navigator.share) {
            await navigator.share({
                title: 'AI Generated Image',
                text: `Check out this AI-generated image created with Google Imagen!\n\nPrompt: ${elements.promptInput.value}`,
                files: [file]
            });
        } else {
            // Fallback: Copy to clipboard
            await navigator.clipboard.writeText(currentImageData.imageUrl);
            showSuccess('Image URL copied to clipboard!');
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error sharing image:', error);
            // Fallback: Copy URL to clipboard
            try {
                await navigator.clipboard.writeText(currentImageData.imageUrl);
                showSuccess('Image URL copied to clipboard!');
            } catch (clipboardError) {
                showError('Unable to share image. Please download it instead.');
            }
        }
    }
}

// Regenerate Image
function regenerateImage() {
    generateImage();
}

// Make functions available globally
window.setPrompt = setPrompt;
window.generateImage = generateImage;
window.downloadImage = downloadImage;
window.shareImage = shareImage;
window.regenerateImage = regenerateImage;

