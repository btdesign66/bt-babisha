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
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Vercel rewrites send /api/* to /api — restore full path for Express routes.
app.use((req, res, next) => {
    if (process.env.VERCEL && req.url && !req.url.startsWith('/api')) {
        req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
    }
    next();
});

// Middleware
app.use(cors({
    origin: process.env.VERCEL ? '*' : true, // Allow all origins on Vercel
    credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public')); // For serving generated images
app.use(express.static(__dirname)); // Serve files from root directory (HTML, CSS, JS files)

// Remove duplicate 404 handler - already handled above

// Configuration - Use /tmp for Vercel (read-only filesystem)
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
const UPLOAD_DIR = isVercel 
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, 'uploads');
const RESULT_DIR = isVercel
    ? path.join('/tmp', 'results')
    : path.join(__dirname, 'public', 'results');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const IMAGE_RETENTION_HOURS = 24;
const SUPABASE_URL =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    '';
const SUPABASE_SERVER_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    '';
const SUPABASE_TRYON_BUCKET = process.env.SUPABASE_TRYON_BUCKET || 'tryon-results';
const SUPABASE_PAYMENTS_TABLE = process.env.SUPABASE_PAYMENTS_TABLE || 'payment_orders';
let supabaseAdmin = null;

// Ensure directories exist (skip on Vercel - uses /tmp)
async function ensureDirectories() {
    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        await fs.mkdir(RESULT_DIR, { recursive: true });
    } catch (error) {
        if (isVercel) {
            console.log('Using /tmp for file storage on Vercel');
        } else {
            console.error('Error creating directories:', error);
        }
    }
}
ensureDirectories();

function getSupabaseAdmin() {
    if (supabaseAdmin) return supabaseAdmin;
    if (!SUPABASE_URL || !SUPABASE_SERVER_KEY) return null;
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVER_KEY, {
        auth: { persistSession: false }
    });
    return supabaseAdmin;
}

function normalizePaymentStatus(input) {
    const value = String(input || '').trim().toLowerCase();
    if (!value) return 'pending';

    if (
        value.includes('success') ||
        value.includes('charged') ||
        value.includes('captured') ||
        value === 'ok'
    ) {
        return 'success';
    }

    if (
        value.includes('fail') ||
        value.includes('declin') ||
        value.includes('cancel') ||
        value.includes('abort') ||
        value.includes('error')
    ) {
        return 'failed';
    }

    if (value.includes('pending') || value.includes('created') || value.includes('initiated')) {
        return 'pending';
    }

    return value;
}

function pickFirstValue(...values) {
    for (const value of values) {
        if (value === undefined || value === null) continue;
        const trimmed = String(value).trim();
        if (trimmed) return trimmed;
    }
    return '';
}

function buildPaymentRecord(payload = {}) {
    const rawStatus = pickFirstValue(
        payload.status,
        payload.order_status,
        payload.txn_status,
        payload.payment_status,
        payload.status_description
    );

    const status = normalizePaymentStatus(rawStatus);
    const amountValue = pickFirstValue(payload.amount, payload.order_amount, payload.effective_amount);
    const parsedAmount = Number(amountValue);
    const statusIdValue = pickFirstValue(payload.status_id, payload.order_status_id);
    const parsedStatusId = statusIdValue === '' ? null : Number(statusIdValue);
    const gatewayIdValue = pickFirstValue(payload.gateway_id);
    const parsedGatewayId = gatewayIdValue === '' ? null : Number(gatewayIdValue);
    const refundedValue = pickFirstValue(payload.refunded);

    return {
        order_id: pickFirstValue(payload.order_id, payload.orderId),
        sg_internal_id: pickFirstValue(payload.sg_internal_id, payload.sgInternalId, payload.internal_order_id, payload.internalOrderId),
        merchant_id: pickFirstValue(payload.merchant_id, payload.merchantId),
        customer_id: pickFirstValue(payload.customer_id, payload.customerId),
        customer_email: pickFirstValue(payload.customer_email, payload.customerEmail),
        customer_phone: pickFirstValue(payload.customer_phone, payload.customerPhone),
        customer_name: pickFirstValue(payload.customer_name, payload.customerName),
        customer_location: pickFirstValue(payload.customer_location, payload.customerAddress, payload.customerLocation),
        status,
        status_id: Number.isFinite(parsedStatusId) ? parsedStatusId : null,
        amount: Number.isFinite(parsedAmount) ? parsedAmount.toFixed(2) : null,
        currency: pickFirstValue(payload.currency, payload.order_currency) || 'INR',
        txn_id: pickFirstValue(payload.txn_id, payload.txnId),
        txn_uuid: pickFirstValue(payload.txn_uuid, payload.txnUuid),
        payment_method_type: pickFirstValue(payload.payment_method_type, payload.paymentMethodType),
        payment_method: pickFirstValue(payload.payment_method, payload.paymentMethod),
        auth_type: pickFirstValue(payload.auth_type, payload.authType),
        return_url: pickFirstValue(payload.return_url, payload.returnUrl),
        product_id: pickFirstValue(payload.product_id, payload.productId),
        gateway_id: Number.isFinite(parsedGatewayId) ? parsedGatewayId : null,
        gateway_reference_id: pickFirstValue(payload.gateway_reference_id, payload.gatewayReferenceId),
        refunded: refundedValue ? ['true', '1', 'yes'].includes(String(refundedValue).toLowerCase()) : null,
        amount_refunded: Number.isFinite(Number(payload.amount_refunded)) ? Number(payload.amount_refunded).toFixed(2) : null,
        effective_amount: Number.isFinite(Number(payload.effective_amount)) ? Number(payload.effective_amount).toFixed(2) : null,
        raw: payload
    };
}

async function upsertPaymentOrder(payload = {}) {
    const client = getSupabaseAdmin();
    if (!client) {
        throw new Error(
            'Supabase payments are not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in .env.'
        );
    }

    const record = buildPaymentRecord(payload);
    if (!record.order_id) {
        throw new Error('Cannot save payment order without order_id.');
    }

    // Attempt upsert with all columns
    const { data, error } = await client
        .from(SUPABASE_PAYMENTS_TABLE)
        .upsert(record, { onConflict: 'order_id' })
        .select()
        .single();
        
    if (error) {
        // If upsert fails (e.g. columns not found in cache), retry without customer_name and customer_location columns
        console.warn(`Initial upsert failed: ${error.message}. Retrying fallback without custom fields.`);
        const fallbackRecord = { ...record };
        delete fallbackRecord.customer_name;
        delete fallbackRecord.customer_location;
        const { data: fallbackData, error: fallbackError } = await client
            .from(SUPABASE_PAYMENTS_TABLE)
            .upsert(fallbackRecord, { onConflict: 'order_id' })
            .select()
            .single();
        if (fallbackError) {
            throw new Error(`Supabase payment save failed (fallback): ${fallbackError.message}`);
        }
        return fallbackData;
    }

    return data;
}

async function fetchPaymentOrder(orderId) {
    const client = getSupabaseAdmin();
    if (!client) return null;
    if (!orderId) return null;

    const { data, error } = await client
        .from(SUPABASE_PAYMENTS_TABLE)
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();

    if (error) {
        throw new Error(`Supabase payment lookup failed: ${error.message}`);
    }

    return data;
}

function buildReturnUrl(req) {
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    return `${protocol}://${host}/api/payments/hdfc/return`;
}

function buildStatusPageUrl(req, payload = {}) {
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const params = new URLSearchParams();
    const orderId = pickFirstValue(payload.order_id, payload.orderId);
    const status = normalizePaymentStatus(
        pickFirstValue(payload.status, payload.order_status, payload.payment_status, payload.txn_status)
    );
    const amount = pickFirstValue(payload.amount, payload.effective_amount);
    const message = pickFirstValue(payload.message, payload.status_description);

    if (orderId) params.set('order_id', orderId);
    if (status) params.set('status', status);
    if (amount) params.set('amount', amount);
    if (message) params.set('message', message);

    return `${protocol}://${host}/payment-status.html${params.toString() ? `?${params.toString()}` : ''}`;
}

async function saveTryOnToSupabase(buffer, mimeType, ext, metadata = {}) {
    const client = getSupabaseAdmin();
    if (!client) return null;

    const datePrefix = new Date().toISOString().slice(0, 10);
    const fileName = `tryon-${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const objectPath = `${datePrefix}/${fileName}`;

    const { error: uploadError } = await client.storage
        .from(SUPABASE_TRYON_BUCKET)
        .upload(objectPath, buffer, {
            contentType: mimeType,
            upsert: false
        });

    if (uploadError) {
        throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }

    let imageUrl = null;
    try {
        const { data: signedData, error: signedError } = await client.storage
            .from(SUPABASE_TRYON_BUCKET)
            .createSignedUrl(objectPath, 60 * 60 * 24 * 7); // 7 days
        if (!signedError && signedData?.signedUrl) {
            imageUrl = signedData.signedUrl;
        }
    } catch (e) {
        // Ignore and try public URL fallback below.
    }

    if (!imageUrl) {
        const { data: publicUrlData } = client.storage
            .from(SUPABASE_TRYON_BUCKET)
            .getPublicUrl(objectPath);
        imageUrl = publicUrlData?.publicUrl || null;
    }

    // Best-effort metadata insert. If table does not exist, skip without failing generation.
    try {
        await client.from('tryon_results').insert({
            image_url: imageUrl,
            storage_path: objectPath,
            mime_type: mimeType,
            product_type: metadata.productType || null,
            product_name: metadata.productName || null
        });
    } catch (e) {
        // Ignore table insert errors to keep image generation path resilient.
    }

    return {
        imageUrl,
        storagePath: objectPath
    };
}

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

// Error handling middleware - ensure JSON responses for API routes
app.use((error, req, res, next) => {
    // Always return JSON for API routes
    if (req.path.startsWith('/api/')) {
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File size exceeds 10MB limit'
                });
            }
            return res.status(400).json({
                success: false,
                message: error.message || 'File upload error'
            });
        }
        
        console.error('API Error:', error);
        const statusCode = error.status || error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
    
    // For non-API routes, pass to next error handler
    next(error);
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * HDFC SmartGateway order creation (local-friendly)
 * POST /api/payments/hdfc/create-order
 *
 * Your frontend (`payment.html`) expects:
 *   { success: true, paymentUrl: "https://..." }
 */
let hdfcMockOrdersCache = null;

async function getHdfcMockOrders() {
    if (hdfcMockOrdersCache) return hdfcMockOrdersCache;

    const ordersDir = path.join(__dirname, 'data', 'hdfc', 'orders');
    try {
        const files = await fs.readdir(ordersDir);
        const orders = [];

        for (const file of files) {
            if (!file.toLowerCase().endsWith('.json')) continue;
            const fullPath = path.join(ordersDir, file);
            try {
                const raw = await fs.readFile(fullPath, 'utf8');
                orders.push(JSON.parse(raw));
            } catch {
                // Ignore bad JSON files; we'll just skip those entries.
            }
        }

        hdfcMockOrdersCache = orders;
        return hdfcMockOrdersCache;
    } catch {
        hdfcMockOrdersCache = [];
        return hdfcMockOrdersCache;
    }
}

app.post('/api/payments/hdfc/create-order', async (req, res) => {
    let orderId = '';
    try {
        const body = req.body || {};
        const amount = body.amount;
        const customerId = body.customerId;

        if (!customerId || typeof customerId !== 'string' || customerId.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'customerId is required'
            });
        }

        const amountNum = typeof amount === 'number' ? amount : Number(amount);
        if (!Number.isFinite(amountNum) || amountNum <= 0) {
            return res.status(400).json({
                success: false,
                message: 'amount must be a valid positive number'
            });
        }

        const configPath = path.join(__dirname, 'config.json');
        let config = {};
        try {
            const raw = await fs.readFile(configPath, 'utf8');
            config = JSON.parse(raw);
        } catch {
            // Ignore if config.json isn't present; we'll rely on env vars.
        }

        const baseUrl =
            process.env.HDFC_SMARTGATEWAY_BASE_URL ||
            config?.BASE_URL ||
            config?.HDFC_SMARTGATEWAY_BASE_URL ||
            '';

        const merchantId =
            process.env.HDFC_SMARTGATEWAY_MERCHANT_ID ||
            config?.MERCHANT_ID ||
            '';

        const resellerId =
            process.env.HDFC_SMARTGATEWAY_RESELLER_ID ||
            config?.RESELLER_ID ||
            '';

        const auth =
            process.env.HDFC_SMARTGATEWAY_AUTH ||
            config?.HDFC_SMARTGATEWAY_AUTH ||
            '';

        if (!baseUrl || !merchantId || !resellerId || !auth) {
            return res.status(500).json({
                success: false,
                message:
                    'SmartGateway is not configured. Create a local `.env` using `.env.example` and set: HDFC_SMARTGATEWAY_BASE_URL, HDFC_SMARTGATEWAY_MERCHANT_ID, HDFC_SMARTGATEWAY_RESELLER_ID, and HDFC_SMARTGATEWAY_AUTH.'
            });
        }

        // SmartGateway expects x-www-form-urlencoded body.
        orderId = `ORD${crypto.randomBytes(8).toString('hex').toUpperCase()}`; // <= 21 chars
        const version = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const amountFixed = amountNum.toFixed(2);
        const returnUrl = body.returnUrl || buildReturnUrl(req);

        const form = new URLSearchParams();
        form.append('order_id', orderId);
        form.append('amount', amountFixed);
        form.append('currency', 'INR');
        form.append('customer_id', customerId);
        form.append('return_url', returnUrl);

        if (body.customerEmail) {
            form.append('customer_email', body.customerEmail);
        }

        if (body.customerPhone) {
            form.append('customer_phone', body.customerPhone);
        }

        const description = body.description || `BABISHA Order - ${customerId}`;
        form.append('description', description);

        const url = `${baseUrl.replace(/\/$/, '')}/orders`;

        const normalizedAuth = auth.startsWith('Basic ') ? auth : `Basic ${auth}`;

        try {
            await upsertPaymentOrder({
                order_id: orderId,
                merchant_id: merchantId,
                customer_id: customerId,
                customer_email: body.customerEmail || '',
                customer_phone: body.customerPhone || '',
                customer_name: body.customerName || '',
                customer_location: body.customerAddress || '',
                status: 'initiated',
                amount: amountFixed,
                currency: 'INR',
                return_url: returnUrl,
                product_id: body.productId || '',
                raw: {
                    stage: 'initiated',
                    request: {
                        amount: amountFixed,
                        currency: 'INR',
                        customerId,
                        customerEmail: body.customerEmail || null,
                        customerPhone: body.customerPhone || null,
                        customerName: body.customerName || null,
                        customerAddress: body.customerAddress || null,
                        customerLocation: body.customerAddress || null,
                        description,
                        productId: body.productId || null,
                        returnUrl
                    }
                }
            });
        } catch (saveError) {
            console.warn('Supabase payment log failed (continuing to HDFC):', saveError.message);
        }

        const result = await axios.post(url, form.toString(), {
            headers: {
                'Authorization': normalizedAuth,
                'x-merchantid': merchantId,
                'x-resellerid': resellerId,
                'version': version,
                'Content-Type': 'application/x-www-form-urlencoded',
                // Mandatory header for affinity / stickiness
                'x-routing-id': customerId
            },
            // Avoid inheriting broken local proxy settings when calling HDFC directly.
            proxy: false,
            timeout: 60000
        });

        const data = result?.data || {};
        const paymentLinks = data.payment_links || data.paymentLinks || {};
        const paymentUrl = paymentLinks?.web;

        try {
            await upsertPaymentOrder({
                order_id: orderId,
                sg_internal_id: data.id || data.order_id || '',
                merchant_id: merchantId,
                customer_id: customerId,
                customer_email: body.customerEmail || '',
                customer_phone: body.customerPhone || '',
                customer_name: body.customerName || '',
                customer_location: body.customerAddress || '',
                status: pickFirstValue(data.status, 'created'),
                status_id: data.status_id || null,
                amount: amountFixed,
                currency: 'INR',
                return_url: returnUrl,
                product_id: body.productId || '',
                payment_method_type: pickFirstValue(data.payment_method_type),
                payment_method: pickFirstValue(data.payment_method),
                gateway_reference_id: paymentUrl,
                raw: {
                    stage: 'create-order',
                    request: {
                        amount: amountFixed,
                        currency: 'INR',
                        customerId,
                        customerEmail: body.customerEmail || null,
                        customerPhone: body.customerPhone || null,
                        customerName: body.customerName || null,
                        customerAddress: body.customerAddress || null,
                        customerLocation: body.customerAddress || null,
                        description,
                        productId: body.productId || null,
                        returnUrl
                    },
                    response: data
                }
            });
        } catch (saveError) {
            return res.status(500).json({
                success: false,
                message: saveError.message
            });
        }

        if (!paymentUrl) {
            return res.status(500).json({
                success: false,
                message:
                    'SmartGateway did not return a web payment link. Check your SmartGateway dashboard/API configuration.'
            });
        }

        return res.json({
            success: true,
            paymentUrl,
            order: {
                orderId,
                amount: amountFixed,
                currency: 'INR',
                customerId
            }
        });
    } catch (err) {
        let errMsg = err?.message || 'Failed to create HDFC order';
        if (err?.response?.data) {
            if (typeof err.response.data === 'string') {
                errMsg += ` - ${err.response.data}`;
            } else if (err.response.data.message) {
                errMsg += ` - ${err.response.data.message}`;
            } else if (err.response.data.error_message) {
                errMsg += ` - ${err.response.data.error_message}`;
            } else if (err.response.data.error) {
                errMsg += ` - ${JSON.stringify(err.response.data.error)}`;
            } else {
                errMsg += ` - ${JSON.stringify(err.response.data)}`;
            }
        }

        const failedOrderId = orderId || pickFirstValue(req.body?.orderId, req.body?.order_id);
        if (failedOrderId) {
            try {
                await upsertPaymentOrder({
                    order_id: failedOrderId,
                    status: 'failed',
                    raw: {
                        stage: 'create-order-error',
                        message: errMsg
                    }
                });
            } catch (saveError) {
                console.error('Payment error save failed:', saveError.message);
            }
        }
        return res.status(500).json({
            success: false,
            message: errMsg
        });
    }
});

async function handleHdfcReturn(req, res) {
    const payload = {
        ...(req.query || {}),
        ...(req.body || {})
    };

    try {
        const orderId = pickFirstValue(payload.order_id, payload.orderId);
        if (orderId) {
            await upsertPaymentOrder({
                ...payload,
                order_id: orderId,
                raw: {
                    stage: 'return',
                    payload
                }
            });
        }
    } catch (error) {
        console.error('HDFC return save failed:', error.message);
    }

    return res.redirect(buildStatusPageUrl(req, payload));
}

app.get('/api/payments/hdfc/return', handleHdfcReturn);
app.post('/api/payments/hdfc/return', handleHdfcReturn);

app.post('/api/payments/hdfc/finalize', async (req, res) => {
    try {
        const payload = req.body || {};
        const orderId = pickFirstValue(payload.order_id, payload.orderId);

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'order_id is required'
            });
        }

        const saved = await upsertPaymentOrder({
            ...payload,
            order_id: orderId,
            raw: {
                stage: 'finalize',
                payload
            }
        });

        return res.json({
            success: true,
            payment: saved
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to save payment result'
        });
    }
});

app.get('/api/payments/hdfc/order/:orderId', async (req, res) => {
    try {
        const payment = await fetchPaymentOrder(req.params.orderId);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment order not found'
            });
        }

        return res.json({
            success: true,
            payment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch payment order'
        });
    }
});

/**
 * Google Imagen Image Generation Endpoint
 * POST /api/generate-image
 * 
 * Request Body:
 * {
 *   "prompt": "A beautiful sunset over mountains",
 *   "aspectRatio": "1:1" (optional, default: "1:1")
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "imageUrl": "data:image/png;base64,..." or URL,
 *   "message": "Image generated successfully"
 * }
 */
app.post('/api/generate-image', async (req, res, next) => {
    try {
        const { prompt, aspectRatio = '1:1' } = req.body;

        // Validate input
        if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Prompt is required and must be a non-empty string'
            });
        }

        if (prompt.length > 2000) {
            return res.status(400).json({
                success: false,
                message: 'Prompt must be less than 2000 characters'
            });
        }

        // Check for API key
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('Google Generative AI API key not found');
            return res.status(500).json({
                success: false,
                message: 'Image generation service is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY environment variable.'
            });
        }

        // Generate image using Google Imagen API
        // Try multiple approaches: Vertex AI, Generative AI API, or alternative
        const imagenResponse = await generateImageWithImagen(apiKey, prompt, aspectRatio);

        res.json({
            success: true,
            imageUrl: imagenResponse.imageUrl,
            imageBase64: imagenResponse.imageBase64,
            message: 'Image generated successfully'
        });

    } catch (error) {
        console.error('Image generation error:', error);
        error.status = error.status || 500;
        next(error);
    }
});

/**
 * Generate image using Google Imagen API
 * Supports multiple approaches: Vertex AI, Generative AI API, or alternative services
 */
async function generateImageWithImagen(apiKey, prompt, aspectRatio) {
    try {
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
        
        // Option 1: Try Vertex AI Imagen API (if project ID is configured)
        if (projectId) {
            try {
                return await generateWithVertexAI(apiKey, projectId, location, prompt, aspectRatio);
            } catch (vertexError) {
                console.log('Vertex AI failed, trying alternative approach...', vertexError.message);
            }
        }
        
        // Option 2: Try Generative AI API (Gemini) - Note: Gemini doesn't generate images directly
        // But we can use it to create image generation prompts or use alternative
        
        // Option 3: Use alternative image generation service
        // For now, we'll provide a helpful error message
        throw new Error(
            'Image generation requires Vertex AI setup. ' +
            'Please set GOOGLE_CLOUD_PROJECT_ID environment variable, ' +
            'or use an alternative image generation service like Stability AI or Replicate.'
        );
        
    } catch (error) {
        if (error.response) {
            console.error('Imagen API error:', error.response.data);
            const errorMsg = error.response.data?.error?.message || error.response.data?.message || error.message;
            throw new Error(`Image generation failed: ${errorMsg}`);
        }
        throw error;
    }
}

/**
 * Generate image using Vertex AI Imagen
 */
async function generateWithVertexAI(apiKey, projectId, location, prompt, aspectRatio) {
    const vertexUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/imagen-3.0-generate-001:predict`;
    
    const requestBody = {
        instances: [{
            prompt: prompt
        }],
        parameters: {
            sampleCount: 1,
            aspectRatio: aspectRatio,
            safetyFilterLevel: "block_some",
            personGeneration: "allow_all"
        }
    };

    // For Vertex AI, we need OAuth token, not API key
    // Try to get access token
    const accessToken = await getAccessToken(apiKey);
    
    const response = await axios.post(
        vertexUrl,
        requestBody,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            timeout: 60000
        }
    );

    if (response.data && response.data.predictions && response.data.predictions.length > 0) {
        const imageBase64 = response.data.predictions[0].bytesBase64Encoded;
        return {
            imageUrl: `data:image/png;base64,${imageBase64}`,
            imageBase64: imageBase64
        };
    }
    
    throw new Error('No image generated from Vertex AI response');
}

/**
 * Get Google Cloud access token (for Vertex AI)
 * This requires google-auth-library package for OAuth
 */
async function getAccessToken(apiKey) {
    // For Vertex AI, we need OAuth token, not API key
    // Try to use google-auth-library if available
    try {
        const { GoogleAuth } = require('google-auth-library');
        const auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        return accessToken.token;
    } catch (error) {
        // If google-auth-library is not available, try using API key directly
        // Note: This may not work for Vertex AI, but worth trying
        console.log('google-auth-library not available, using API key directly');
        return apiKey;
    }
}

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
        // Preserve the underlying Gemini/AI error message for easier troubleshooting (quota, auth, etc.)
        throw new Error(error?.message || 'Failed to generate try-on image. Please try again.');
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
 * Convert a local file to base64.
 */
async function fileToBase64(filePath) {
    const buf = await fs.readFile(filePath);
    return buf.toString('base64');
}

function getImageMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.png') return 'image/png';
    if (ext === '.webp') return 'image/webp';
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    // Default to jpeg
    return 'image/jpeg';
}

function extractGeminiImageBuffer(result) {
    const parts = result?.response?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
        for (const part of parts) {
            const inline = part?.inlineData;
            if (!inline?.data) continue;
            const mimeType = inline?.mimeType || '';
            if (mimeType.toLowerCase().startsWith('image/')) {
                return { buffer: Buffer.from(inline.data, 'base64'), mimeType };
            }
        }
    }
    return null;
}

/**
 * Generate try-on image using Google Gemini (API key based).
 */
async function generateWithGemini(userPhotoPath, productImagePath, productType, productName) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_API_KEY is missing. Add it to the .env file in the project root.');
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    // gemini-1.5-pro is not available for your API key.
    // Use the closest available image-capable model from the Gemini REST model list.
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-image' });

    const resolvedDressPath = productImagePath || getDefaultProductImage(productType);
    if (!resolvedDressPath) {
        throw new Error('Dress image not found for the selected product type.');
    }

    const [userBase64, dressBase64] = await Promise.all([
        fileToBase64(userPhotoPath),
        fileToBase64(resolvedDressPath),
    ]);

    const userMimeType = getImageMimeType(userPhotoPath);
    const dressMimeType = getImageMimeType(resolvedDressPath);

    // Exact prompt requested
    const prompt =
        'A realistic full-body image of the same person from the first image wearing the clothing from the second image. ' +
        'Preserve face, body shape, pose, and lighting. Replace only clothing. ' +
        'Ensure natural fit, realistic folds, and high quality photorealistic output.';

    const result = await model.generateContent({
        contents: [
            {
                role: 'user',
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: userMimeType, data: userBase64 } },
                    { inlineData: { mimeType: dressMimeType, data: dressBase64 } },
                ],
            },
        ],
    });

    const output = extractGeminiImageBuffer(result);
    if (!output?.buffer) {
        throw new Error(
            'Gemini did not return an image in the response. Your Gemini model/API capability may not support image output for this request format.'
        );
    }

    const ext =
        output.mimeType.includes('png') ? 'png' :
        output.mimeType.includes('jpeg') || output.mimeType.includes('jpg') ? 'jpg' :
        output.mimeType.includes('webp') ? 'webp' :
        'png';

    const resultPath = path.join(
        RESULT_DIR,
        `result-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`
    );

    // Persist result in database-backed storage (Supabase) when configured.
    // Falls back to local file storage for local development.
    let remote = null;
    try {
        remote = await saveTryOnToSupabase(output.buffer, output.mimeType, ext, {
            productType,
            productName
        });
    } catch (e) {
        console.error('Supabase persistence warning:', e.message);
    }

    await fs.writeFile(resultPath, output.buffer);
    const dataUrl = `data:${output.mimeType};base64,${output.buffer.toString('base64')}`;

    return {
        imagePath: resultPath,
        imageUrl: remote?.imageUrl || (isVercel ? dataUrl : `/results/${path.basename(resultPath)}`)
    };
}

/**
 * Generate with Custom Model (Fallback/Demo)
 * This is a placeholder for your custom model endpoint
 */
async function generateWithCustomModel(userPhotoPath, productImagePath, productType, productName) {
    console.log('Using Google Gemini for try-on...');
    return generateWithGemini(userPhotoPath, productImagePath, productType, productName);
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
        // Match the product images used by the existing `tryon-script.js`
        'lehenga': path.join(__dirname, 'images', 'lehengas', '02__RANI_TAARANI-A1.jpeg'),
        'kurta': path.join(__dirname, 'images', 'lehengas', '03__RANIKA_TAARANI-B1.jpeg'),
        'kids-wear': path.join(__dirname, 'images', 'lehengas', '04__RUPA_TAARANI-C1.jpeg'),
        'saree': path.join(__dirname, 'images', 'lehengas', '05__RANO_TAARANI-D1.jpeg'),
        'suit': path.join(__dirname, 'images', 'lehengas', '02__RANI_TAARANI-A1.jpeg')
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

// 404 handler for API routes - return JSON instead of HTML.
// This must be registered after all route handlers; otherwise it will intercept valid API endpoints.
app.use((req, res, next) => {
    if (req.path.startsWith('/api/') && req.method !== 'OPTIONS') {
        return res.status(404).json({
            success: false,
            message: `API endpoint not found: ${req.method} ${req.originalUrl}`
        });
    }
    next();
});

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

// Start server only if not in serverless environment (Vercel)
if (!isVercel) {
    app.listen(PORT, () => {
        console.log(`🚀 BABISHA Virtual Try-On API running on http://localhost:${PORT}`);
        console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
        console.log(`📁 Results directory: ${RESULT_DIR}`);
        console.log(`⏰ Image retention: ${IMAGE_RETENTION_HOURS} hours`);
    });
} else {
    console.log('Running on Vercel - serverless mode');
    console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
    console.log(`📁 Results directory: ${RESULT_DIR}`);
}

// Export for Vercel serverless functions
module.exports = app;

