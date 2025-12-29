# Virtual Try-On Feature - Documentation

## Overview

AI-powered Virtual Try-On feature for BABISHA fashion e-commerce website. This feature allows users to see how they would look wearing selected outfits (lehenga, kurta, kids wear) using advanced AI image generation.

## Architecture

### Frontend Flow
1. **Product Selection**: User selects a product from dropdown or browses products
2. **Photo Upload**: User uploads a clear front-facing photo
3. **AI Processing**: System generates realistic try-on image
4. **Result Display**: User views and can download/share the result

### Backend Flow
1. **Image Validation**: Validate uploaded photo quality and format
2. **AI Processing**: Send images to AI model for try-on generation
3. **Image Storage**: Temporarily store result (24-hour retention)
4. **Cleanup**: Automatic deletion after retention period

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Bootstrap 5
- Font Awesome Icons

### Backend
- Node.js with Express
- Multer (file upload handling)
- Axios (HTTP requests)
- Replicate API / Stability AI (AI image generation)

### Storage
- Local file system (uploads & results)
- Cloud storage option available (AWS S3, etc.)

## Installation

### Prerequisites
- Node.js 16+ and npm 8+
- API keys for AI service (Replicate or Stability AI)

### Setup Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
Create a `.env` file:
```env
PORT=3000
REPLICATE_API_TOKEN=your_replicate_api_token
STABILITY_API_KEY=your_stability_api_key
NODE_ENV=production
```

3. **Create Required Directories**
```bash
mkdir uploads
mkdir public/results
```

4. **Start the Server**
```bash
npm start
# or for development
npm run dev
```

5. **Access the Feature**
- Frontend: `http://localhost:8000/virtual-tryon.html`
- Backend API: `http://localhost:3000/api`

## API Endpoints

### POST `/api/try-on`

Generate virtual try-on image.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `userPhoto` (file, required): User's photo
  - `productImage` (file, optional): Product image
  - `productType` (string, required): Type of product (lehenga, kurta, etc.)
  - `productName` (string, optional): Product name

**Response:**
```json
{
  "success": true,
  "imageUrl": "/results/result-1234567890.jpg",
  "message": "Try-on image generated successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## AI Integration

### Option 1: Replicate API (Recommended)

**Model**: `cuuupid/idm-vton` or similar virtual try-on model

**Setup:**
1. Sign up at [Replicate](https://replicate.com)
2. Get API token
3. Add to `.env`: `REPLICATE_API_TOKEN=your_token`

**Usage:**
The server automatically uses Replicate if `REPLICATE_API_TOKEN` is set.

### Option 2: Stability AI

**Setup:**
1. Sign up at [Stability AI](https://platform.stability.ai)
2. Get API key
3. Add to `.env`: `STABILITY_API_KEY=your_key`

### Option 3: Custom Model

Modify `generateWithCustomModel()` in `server.js` to integrate with your own AI model endpoint.

## AI Prompt Engineering

The system uses carefully crafted prompts to ensure:

1. **Face Preservation**: "Preserve the person's face exactly"
2. **Body Proportions**: "Maintain body proportions, skin tone, and height"
3. **Natural Fit**: "The outfit should fit naturally with correct draping"
4. **Quality**: "High quality, studio lighting, clean white background"
5. **No Artifacts**: "No distortion, no extra limbs, no blur"

**Prompt Template:**
```
A professional fashion photograph of a person wearing a [PRODUCT_TYPE]. 
High quality, studio lighting, clean white background, professional photography, 8k resolution. 
Preserve the person's face exactly, maintain body proportions, skin tone, and height. 
The [PRODUCT_TYPE] should fit naturally with correct draping, fabric texture, and realistic appearance. 
No distortion, no extra limbs, no blur, no artifacts, no unrealistic proportions.
```

## Error Handling

### Frontend Validation
- File type validation (JPEG, PNG, WebP only)
- File size validation (max 10MB)
- Image quality checks
- User-friendly error messages

### Backend Validation
- File type and size validation
- Image quality assessment
- AI processing error handling
- Automatic cleanup on errors

### Error Types
1. **400 Bad Request**: Invalid input (file type, size, missing fields)
2. **500 Internal Server Error**: AI processing failure, server errors
3. **Timeout**: Processing takes too long (>60 seconds)

## Privacy & Security

### Data Handling
- **Temporary Storage**: Images stored for 24 hours only
- **Automatic Cleanup**: Scheduled deletion after retention period
- **No Database**: No permanent storage of user images
- **Secure Upload**: File validation and sanitization

### Privacy Features
- Privacy consent banner
- Clear data retention policy
- No image sharing with third parties (except AI service)
- User control over their images

### Security Measures
- File type validation
- File size limits
- Secure file naming (randomized)
- CORS protection
- Input sanitization

## UX Flow

### Step 1: Product Selection
- Dropdown selection by type
- Browse products modal
- Selected product display

### Step 2: Photo Upload
- Drag & drop support
- Click to upload
- Image preview
- Requirements guidance

### Step 3: Generation
- Loading state with progress
- Real-time status updates
- Error handling
- Success notification

### Step 4: Results
- Before/after comparison
- Download option
- Share functionality
- Retry option

## Performance Optimization

### Frontend
- Image compression before upload
- Lazy loading of product images
- Optimized file size validation

### Backend
- Async processing
- Efficient file handling
- Background cleanup tasks
- Response caching (optional)

## Testing

### Manual Testing Checklist
- [ ] Product selection works
- [ ] File upload accepts valid formats
- [ ] File upload rejects invalid formats
- [ ] File size validation works
- [ ] AI generation completes successfully
- [ ] Error messages display correctly
- [ ] Download functionality works
- [ ] Share functionality works
- [ ] Cleanup runs automatically

### Test Images
Use test images that meet requirements:
- Front-facing
- Full body visible
- Good lighting
- Plain background

## Deployment

### Production Checklist
- [ ] Set environment variables
- [ ] Configure API keys
- [ ] Set up cloud storage (optional)
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Configure backup/cleanup jobs
- [ ] Test all endpoints

### Environment Variables
```env
PORT=3000
NODE_ENV=production
REPLICATE_API_TOKEN=your_token
STABILITY_API_KEY=your_key
MAX_FILE_SIZE=10485760
IMAGE_RETENTION_HOURS=24
```

## Troubleshooting

### Common Issues

1. **"File size exceeds limit"**
   - Check MAX_FILE_SIZE configuration
   - Compress images before upload

2. **"Invalid file type"**
   - Ensure file is JPEG, PNG, or WebP
   - Check file extension matches MIME type

3. **"AI generation failed"**
   - Check API keys are valid
   - Verify API quota/limits
   - Check network connectivity

4. **"Image not found"**
   - Verify file paths are correct
   - Check directory permissions
   - Ensure cleanup hasn't run

## Future Enhancements

- [ ] Multiple outfit options in one generation
- [ ] 360° view support
- [ ] Video try-on
- [ ] AR integration
- [ ] Body measurement detection
- [ ] Size recommendation
- [ ] Social sharing integration
- [ ] Save to favorites
- [ ] Comparison with multiple products

## Support

For issues or questions:
- Email: btdesigners555@gmail.com
- WhatsApp: +91 9624113555

## License

MIT License - See LICENSE file for details.

