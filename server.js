/**
 * BABISHA Virtual Try-On Backend API
 * Production-ready Node.js/Express server
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // For serving generated images

// Configuration
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const RESULT_DIR = path.join(__dirname, 'public', 'results');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const IMAGE_RETENTION_HOURS = 24;

// Ensure directories exist
async function ensureDirectories() {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(RESULT_DIR, { recursive: true });
}
ensureDirectories();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
        }
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 10MB limit'
            });
        }
    }
    
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
    });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Virtual Try-On API Endpoint
 * POST /api/try-on
 * 
 * Request:
 * - productImage: Product image URL or file
 * - productType: Type of product (lehenga, kurta, etc.)
 * - productName: Name of the product
 * - userPhoto: User's photo file
 * 
 * Response:
 * - success: boolean
 * - imageUrl: URL of generated try-on image
 * - message: Status message
 */
app.post('/api/try-on', upload.fields([
    { name: 'userPhoto', maxCount: 1 },
    { name: 'productImage', maxCount: 1 }
]), async (req, res) => {
    try {
        // Validate inputs
        if (!req.files || !req.files.userPhoto) {
            return res.status(400).json({
                success: false,
                message: 'User photo is required'
            });
        }

        if (!req.body.productType && !req.files.productImage) {
            return res.status(400).json({
                success: false,
                message: 'Product image or product type is required'
            });
        }

        const userPhotoPath = req.files.userPhoto[0].path;
        const productImagePath = req.files.productImage ? req.files.productImage[0].path : null;
        const productType = req.body.productType || 'lehenga';
        const productName = req.body.productName || 'Product';

        // Validate image quality and requirements
        const validationResult = await validateUserPhoto(userPhotoPath);
        if (!validationResult.valid) {
            // Clean up uploaded file
            await fs.unlink(userPhotoPath).catch(() => {});
            return res.status(400).json({
                success: false,
                message: validationResult.message
            });
        }

        // Generate try-on image using AI
        const result = await generateTryOnImage({
            userPhotoPath,
            productImagePath,
            productType,
            productName
        });

        // Schedule cleanup (delete files after 24 hours)
        scheduleCleanup(userPhotoPath);
        if (productImagePath) {
            scheduleCleanup(productImagePath);
        }
        scheduleCleanup(result.imagePath, RESULT_DIR);

        res.json({
            success: true,
            imageUrl: result.imageUrl,
            message: 'Try-on image generated successfully'
        });

    } catch (error) {
        console.error('Try-on generation error:', error);
        
        // Clean up uploaded files on error
        if (req.files) {
            for (const fileArray of Object.values(req.files)) {
                for (const file of fileArray) {
                    await fs.unlink(file.path).catch(() => {});
                }
            }
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate try-on image'
        });
    }
});

/**
 * Validate user photo quality and requirements
 */
async function validateUserPhoto(imagePath) {
    // Basic validation - in production, use image processing library
    // to check dimensions, face detection, etc.
    
    try {
        const stats = await fs.stat(imagePath);
        if (stats.size < 50000) { // Less than 50KB might be too small
            return {
                valid: false,
                message: 'Image quality is too low. Please upload a higher resolution photo.'
            };
        }
        
        // Additional validations can be added here:
        // - Face detection
        // - Image dimensions
        // - Background detection
        // - Pose detection
        
        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            message: 'Unable to validate image. Please try again.'
        };
    }
}

/**
 * Generate try-on image using AI service
 * 
 * This function integrates with AI image generation APIs
 * Options: Replicate, Stability AI, or custom model
 */
async function generateTryOnImage({ userPhotoPath, productImagePath, productType, productName }) {
    try {
        // Option 1: Using Replicate API (Recommended for try-on)
        // const result = await generateWithReplicate(userPhotoPath, productImagePath, productType);
        
        // Option 2: Using Stability AI
        // const result = await generateWithStabilityAI(userPhotoPath, productImagePath, productType);
        
        // Option 3: Using custom model endpoint
        const result = await generateWithCustomModel(userPhotoPath, productImagePath, productType, productName);
        
        return result;
    } catch (error) {
        console.error('AI generation error:', error);
        throw new Error('Failed to generate try-on image. Please try again.');
    }
}

/**
 * Generate with Replicate API
 * Model: IDM-VTON or similar virtual try-on model
 */
async function generateWithReplicate(userPhotoPath, productImagePath, productType) {
    const Replicate = require('replicate');
    const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN
    });

    // Read images as base64 or use file paths
    const userPhoto = await fs.readFile(userPhotoPath);
    const productImage = productImagePath ? await fs.readFile(productImagePath) : null;

    // Use appropriate model for virtual try-on
    // Example: "cuuupid/idm-vton" or similar
    const output = await replicate.run(
        "cuuupid/idm-vton:latest",
        {
            input: {
                human: userPhoto,
                garment: productImage || getDefaultProductImage(productType),
                category: productType,
                // Additional parameters for better results
                seed: Math.floor(Math.random() * 1000000),
                num_inference_steps: 30
            }
        }
    );

    // Download and save result
    const resultUrl = Array.isArray(output) ? output[0] : output;
    const resultPath = await downloadAndSaveImage(resultUrl);
    const resultUrlLocal = `/results/${path.basename(resultPath)}`;

    return {
        imagePath: resultPath,
        imageUrl: resultUrlLocal
    };
}

/**
 * Generate with Stability AI
 */
async function generateWithStabilityAI(userPhotoPath, productImagePath, productType) {
    const FormData = require('form-data');
    const form = new FormData();
    
    form.append('init_image', await fs.createReadStream(userPhotoPath));
    if (productImagePath) {
        form.append('image_strength', '0.8');
    }

    const prompt = buildTryOnPrompt(productType, productImagePath);
    
    const response = await axios.post(
        'https://api.stability.ai/v2beta/stable-image/edit/outpaint',
        form,
        {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
            }
        }
    );

    const resultPath = await saveImageFromBuffer(response.data, 'stability');
    return {
        imagePath: resultPath,
        imageUrl: `/results/${path.basename(resultPath)}`
    };
}

/**
 * Generate with Custom Model (Fallback/Demo)
 * This is a placeholder for your custom model endpoint
 */
async function generateWithCustomModel(userPhotoPath, productImagePath, productType, productName) {
    // For demo purposes, we'll simulate processing
    // In production, replace this with actual AI model API call
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, you would:
    // 1. Call your AI model API (e.g., hosted on AWS SageMaker, Google Cloud, etc.)
    // 2. Process the images
    // 3. Return the result
    
    // For now, return a placeholder
    // Replace this with actual API call to your model
    
    const resultPath = path.join(RESULT_DIR, `result-${Date.now()}.jpg`);
    
    // Copy user photo as placeholder (replace with actual AI processing)
    await fs.copyFile(userPhotoPath, resultPath);
    
    return {
        imagePath: resultPath,
        imageUrl: `/results/${path.basename(resultPath)}`
    };
}

/**
 * Build AI prompt for try-on generation
 */
function buildTryOnPrompt(productType, productImagePath) {
    const basePrompt = `A professional fashion photograph of a person wearing a ${productType}. `;
    const qualityPrompt = `High quality, studio lighting, clean white background, professional photography, 8k resolution. `;
    const preservationPrompt = `Preserve the person's face exactly, maintain body proportions, skin tone, and height. `;
    const clothingPrompt = `The ${productType} should fit naturally with correct draping, fabric texture, and realistic appearance. `;
    const negativePrompt = `No distortion, no extra limbs, no blur, no artifacts, no unrealistic proportions. `;
    
    return basePrompt + qualityPrompt + preservationPrompt + clothingPrompt + negativePrompt;
}

/**
 * Download and save image from URL
 */
async function downloadAndSaveImage(imageUrl) {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const filename = `result-${Date.now()}-${crypto.randomBytes(8).toString('hex')}.jpg`;
    const filepath = path.join(RESULT_DIR, filename);
    await fs.writeFile(filepath, response.data);
    return filepath;
}

/**
 * Save image from buffer
 */
async function saveImageFromBuffer(buffer, prefix) {
    const filename = `${prefix}-${Date.now()}-${crypto.randomBytes(8).toString('hex')}.jpg`;
    const filepath = path.join(RESULT_DIR, filename);
    await fs.writeFile(filepath, buffer);
    return filepath;
}

/**
 * Get default product image if not provided
 */
function getDefaultProductImage(productType) {
    // Return path to default product image based on type
    const defaultImages = {
        'lehenga': path.join(__dirname, 'images', 'default-lehenga.jpg'),
        'kurta': path.join(__dirname, 'images', 'default-kurta.jpg'),
        'kids-wear': path.join(__dirname, 'images', 'default-kids.jpg')
    };
    return defaultImages[productType] || defaultImages['lehenga'];
}

/**
 * Schedule file cleanup after retention period
 */
function scheduleCleanup(filePath, directory = UPLOAD_DIR) {
    setTimeout(async () => {
        try {
            const fullPath = path.join(directory, path.basename(filePath));
            await fs.unlink(fullPath);
            console.log(`Cleaned up file: ${fullPath}`);
        } catch (error) {
            console.error(`Error cleaning up file ${filePath}:`, error);
        }
    }, IMAGE_RETENTION_HOURS * 60 * 60 * 1000);
}

/**
 * Cleanup old files on server start
 */
async function cleanupOldFiles() {
    try {
        const directories = [UPLOAD_DIR, RESULT_DIR];
        const now = Date.now();
        const retentionMs = IMAGE_RETENTION_HOURS * 60 * 60 * 1000;

        for (const dir of directories) {
            const files = await fs.readdir(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stats = await fs.stat(filePath);
                if (now - stats.mtimeMs > retentionMs) {
                    await fs.unlink(filePath);
                    console.log(`Cleaned up old file: ${filePath}`);
                }
            }
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

// Cleanup on startup
cleanupOldFiles();
setInterval(cleanupOldFiles, 60 * 60 * 1000); // Run cleanup every hour

// Start server
app.listen(PORT, () => {
    console.log(`🚀 BABISHA Virtual Try-On API running on http://localhost:${PORT}`);
    console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
    console.log(`📁 Results directory: ${RESULT_DIR}`);
    console.log(`⏰ Image retention: ${IMAGE_RETENTION_HOURS} hours`);
});

module.exports = app;

