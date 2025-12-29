// Virtual Try-On JavaScript

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Change to your backend URL
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// State Management
let state = {
    selectedProduct: null,
    uploadedImage: null,
    resultImage: null,
    isProcessing: false
};

// DOM Elements
const elements = {
    productType: document.getElementById('productType'),
    browseProductsBtn: document.getElementById('browseProductsBtn'),
    selectedProductDisplay: document.getElementById('selectedProductDisplay'),
    selectedProductImage: document.getElementById('selectedProductImage'),
    selectedProductName: document.getElementById('selectedProductName'),
    selectedProductPrice: document.getElementById('selectedProductPrice'),
    uploadArea: document.getElementById('uploadArea'),
    photoUpload: document.getElementById('photoUpload'),
    uploadPlaceholder: document.getElementById('uploadPlaceholder'),
    uploadPreview: document.getElementById('uploadPreview'),
    previewImage: document.getElementById('previewImage'),
    removeImageBtn: document.getElementById('removeImageBtn'),
    generateBtn: document.getElementById('generateBtn'),
    loadingState: document.getElementById('loadingState'),
    resultDisplay: document.getElementById('resultDisplay'),
    resultImage: document.getElementById('resultImage'),
    errorDisplay: document.getElementById('errorDisplay'),
    errorMessage: document.getElementById('errorMessage'),
    downloadBtn: document.getElementById('downloadBtn'),
    shareBtn: document.getElementById('shareBtn'),
    retryBtn: document.getElementById('retryBtn'),
    productBrowserModal: new bootstrap.Modal(document.getElementById('productBrowserModal')),
    productGrid: document.getElementById('productGrid'),
    comparisonView: document.getElementById('comparisonView'),
    originalImage: document.getElementById('originalImage'),
    tryonImage: document.getElementById('tryonImage')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadProducts();
    checkPrivacyConsent();
});

// Event Listeners
function initializeEventListeners() {
    // Product selection
    elements.productType.addEventListener('change', handleProductTypeChange);
    elements.browseProductsBtn.addEventListener('click', openProductBrowser);
    
    // File upload
    elements.uploadArea.addEventListener('click', () => elements.photoUpload.click());
    elements.photoUpload.addEventListener('change', handleFileSelect);
    elements.removeImageBtn.addEventListener('click', removeUploadedImage);
    
    // Drag and drop
    elements.uploadArea.addEventListener('dragover', handleDragOver);
    elements.uploadArea.addEventListener('dragleave', handleDragLeave);
    elements.uploadArea.addEventListener('drop', handleDrop);
    
    // Generate button
    elements.generateBtn.addEventListener('click', generateTryOn);
    
    // Result actions
    elements.downloadBtn.addEventListener('click', downloadResult);
    elements.shareBtn.addEventListener('click', shareResult);
    elements.retryBtn.addEventListener('click', resetTryOn);
    
    // Update generate button state
    updateGenerateButtonState();
}

// Product Selection
function handleProductTypeChange(e) {
    const productType = e.target.value;
    if (productType) {
        state.selectedProduct = {
            type: productType,
            name: productType.charAt(0).toUpperCase() + productType.slice(1),
            image: getProductTypeImage(productType)
        };
        updateSelectedProductDisplay();
        updateGenerateButtonState();
    }
}

function getProductTypeImage(type) {
    const images = {
        'lehenga': 'images/lehengas/02__RANI_TAARANI-A1.jpeg',
        'kurta': 'images/lehengas/03__RANIKA_TAARANI-B1.jpeg',
        'kids-wear': 'images/lehengas/04__RUPA_TAARANI-C1.jpeg',
        'saree': 'images/lehengas/05__RANO_TAARANI-D1.jpeg',
        'suit': 'images/lehengas/02__RANI_TAARANI-A1.jpeg'
    };
    return images[type] || 'images/lehengas/02__RANI_TAARANI-A1.jpeg';
}

function openProductBrowser() {
    elements.productBrowserModal.show();
}

function selectProductFromGrid(product) {
    state.selectedProduct = product;
    updateSelectedProductDisplay();
    elements.productBrowserModal.hide();
    updateGenerateButtonState();
}

function updateSelectedProductDisplay() {
    if (state.selectedProduct) {
        elements.selectedProductDisplay.style.display = 'block';
        elements.selectedProductImage.src = state.selectedProduct.image || state.selectedProduct.imageUrl;
        elements.selectedProductName.textContent = state.selectedProduct.name;
        elements.selectedProductPrice.textContent = state.selectedProduct.price 
            ? `₹${state.selectedProduct.price}` 
            : '';
    } else {
        elements.selectedProductDisplay.style.display = 'none';
    }
}

// File Upload Handling
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        validateAndProcessFile(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        validateAndProcessFile(file);
    }
}

function validateAndProcessFile(file) {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        showError('Please upload a valid image file (JPG, PNG, or WebP)');
        return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
        showError('File size must be less than 10MB');
        return;
    }
    
    // Process file
    const reader = new FileReader();
    reader.onload = (e) => {
        state.uploadedImage = {
            file: file,
            dataUrl: e.target.result,
            blob: file
        };
        displayPreview(e.target.result);
        updateGenerateButtonState();
    };
    reader.readAsDataURL(file);
}

function displayPreview(imageSrc) {
    elements.uploadPlaceholder.style.display = 'none';
    elements.uploadPreview.style.display = 'block';
    elements.previewImage.src = imageSrc;
}

function removeUploadedImage() {
    state.uploadedImage = null;
    elements.photoUpload.value = '';
    elements.uploadPlaceholder.style.display = 'block';
    elements.uploadPreview.style.display = 'none';
    updateGenerateButtonState();
}

// Generate Try-On
async function generateTryOn() {
    if (!state.selectedProduct || !state.uploadedImage) {
        showError('Please select a product and upload your photo');
        return;
    }
    
    // Validate inputs
    if (!validateInputs()) {
        return;
    }
    
    // Set processing state
    state.isProcessing = true;
    elements.generateBtn.disabled = true;
    elements.loadingState.style.display = 'block';
    elements.resultDisplay.style.display = 'none';
    elements.errorDisplay.style.display = 'none';
    elements.comparisonView.style.display = 'none';
    
    try {
        // Prepare form data
        const formData = new FormData();
        
        // Add product type and name (required)
        formData.append('productType', state.selectedProduct.type || state.selectedProduct.category || 'lehenga');
        formData.append('productName', state.selectedProduct.name || 'Product');
        
        // Add user photo (required - file)
        formData.append('userPhoto', state.uploadedImage.file);
        
        // Add product image if it's a file, otherwise it will use productType
        if (state.selectedProduct.imageFile) {
            formData.append('productImage', state.selectedProduct.imageFile);
        } else if (state.selectedProduct.image || state.selectedProduct.imageUrl) {
            // If product image is a URL, we'll let the backend handle it via productType
            // For now, we'll skip it and let backend use default based on productType
            console.log('Product image URL provided, backend will use productType:', state.selectedProduct.type);
        }
        
        // Call API
        const response = await fetch(`${API_BASE_URL}/try-on`, {
            method: 'POST',
            body: formData
        });
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}. Make sure the backend server is running on http://localhost:3000`);
            }
            throw new Error('Server returned non-JSON response. Please check if the backend server is running correctly.');
        }
        
        if (!response.ok) {
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate try-on image');
            } catch (parseError) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
        }
        
        const result = await response.json();
        
        // Display result
        if (result.success && result.imageUrl) {
            state.resultImage = result.imageUrl;
            displayResult(result.imageUrl);
            showSuccess('Try-on generated successfully!');
        } else {
            throw new Error(result.message || 'Failed to generate try-on image');
        }
        
    } catch (error) {
        console.error('Error generating try-on:', error);
        let errorMessage = error.message || 'An error occurred while generating your try-on. Please try again.';
        
        // Check if it's a connection error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.name === 'TypeError') {
            errorMessage = 'Cannot connect to the server. Please make sure the backend server is running on http://localhost:3000. Run "npm start" in the terminal to start the server.';
        }
        
        showError(errorMessage);
    } finally {
        state.isProcessing = false;
        elements.generateBtn.disabled = false;
        elements.loadingState.style.display = 'none';
    }
}

function validateInputs() {
    if (!state.selectedProduct) {
        showError('Please select a product first');
        return false;
    }
    
    if (!state.uploadedImage) {
        showError('Please upload your photo first');
        return false;
    }
    
    return true;
}

function displayResult(imageUrl) {
    elements.resultImage.src = imageUrl;
    elements.resultDisplay.style.display = 'block';
    
    // Show comparison view
    if (state.uploadedImage && state.uploadedImage.dataUrl) {
        elements.originalImage.src = state.uploadedImage.dataUrl;
        elements.tryonImage.src = imageUrl;
        elements.comparisonView.style.display = 'block';
    }
}

// Result Actions
function downloadResult() {
    if (!state.resultImage) return;
    
    const link = document.createElement('a');
    link.href = state.resultImage;
    link.download = `babisha-tryon-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function shareResult() {
    if (!state.resultImage) return;
    
    if (navigator.share) {
        try {
            const response = await fetch(state.resultImage);
            const blob = await response.blob();
            const file = new File([blob], 'tryon.jpg', { type: 'image/jpeg' });
            
            await navigator.share({
                title: 'My Virtual Try-On from BABISHA',
                text: 'Check out how I look in this outfit!',
                files: [file]
            });
        } catch (error) {
            console.error('Error sharing:', error);
            copyImageToClipboard();
        }
    } else {
        copyImageToClipboard();
    }
}

async function copyImageToClipboard() {
    try {
        const response = await fetch(state.resultImage);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        showSuccess('Image copied to clipboard!');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showError('Unable to copy image. Please download it instead.');
    }
}

function resetTryOn() {
    state.resultImage = null;
    elements.resultDisplay.style.display = 'none';
    elements.comparisonView.style.display = 'none';
    elements.errorDisplay.style.display = 'none';
    updateGenerateButtonState();
}

// Utility Functions
function updateGenerateButtonState() {
    const canGenerate = state.selectedProduct && state.uploadedImage && !state.isProcessing;
    elements.generateBtn.disabled = !canGenerate;
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorDisplay.style.display = 'block';
    elements.resultDisplay.style.display = 'none';
}

function showSuccess(message) {
    // You can implement a toast notification here
    console.log('Success:', message);
}

function checkPrivacyConsent() {
    const consent = localStorage.getItem('tryonPrivacyConsent');
    if (!consent) {
        // Show privacy banner (already visible by default)
        // User can dismiss it
    }
}

// Load Products for Browser
async function loadProducts() {
    try {
        // Load products from your products data
        // This is a placeholder - integrate with your actual product data
        const products = await fetchProducts();
        displayProductsInGrid(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function fetchProducts() {
    // This should integrate with your actual product API
    // For now, return sample data
    return [
        {
            id: 1,
            name: 'Elegant Lehenga',
            price: 5999,
            image: 'images/lehengas/02__RANI_TAARANI-A1.jpeg',
            type: 'lehenga',
            category: 'lehengas'
        },
        {
            id: 2,
            name: 'Designer Kurta',
            price: 2999,
            image: 'images/lehengas/03__RANIKA_TAARANI-B1.jpeg',
            type: 'kurta',
            category: 'suits'
        }
        // Add more products as needed
    ];
}

function displayProductsInGrid(products) {
    elements.productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-4 col-sm-6';
        productCard.innerHTML = `
            <div class="product-select-item card h-100" onclick="selectProductFromGrid(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h6 class="card-title">${product.name}</h6>
                    <p class="text-primary fw-bold mb-0">₹${product.price}</p>
                </div>
            </div>
        `;
        elements.productGrid.appendChild(productCard);
    });
}

// Make selectProductFromGrid available globally
window.selectProductFromGrid = function(product) {
    state.selectedProduct = product;
    updateSelectedProductDisplay();
    elements.productBrowserModal.hide();
    updateGenerateButtonState();
};

