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

// -------------------------
// Supabase (DB)
// -------------------------
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_PAYMENTS_TABLE = process.env.SUPABASE_PAYMENTS_TABLE || 'payment_orders';
let supabaseAdmin = null;

function getSupabaseAdmin() {
    if (supabaseAdmin) return supabaseAdmin;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false }
    });
    return supabaseAdmin;
}

async function upsertPaymentOrderToSupabase(orderStatusResp) {
    const client = getSupabaseAdmin();
    if (!client || !orderStatusResp?.order_id) return null;

    const row = {
        order_id: String(orderStatusResp.order_id),
        sg_internal_id: orderStatusResp.id ? String(orderStatusResp.id) : null,
        merchant_id: orderStatusResp.merchant_id ? String(orderStatusResp.merchant_id) : null,
        customer_id: orderStatusResp.customer_id ? String(orderStatusResp.customer_id) : null,
        customer_email: orderStatusResp.customer_email ? String(orderStatusResp.customer_email) : null,
        customer_phone: orderStatusResp.customer_phone ? String(orderStatusResp.customer_phone) : null,
        amount: orderStatusResp.amount ?? null,
        currency: orderStatusResp.currency ? String(orderStatusResp.currency) : null,
        status: orderStatusResp.status ? String(orderStatusResp.status) : null,
        status_id: orderStatusResp.status_id ?? null,
        txn_id: orderStatusResp.txn_id ? String(orderStatusResp.txn_id) : null,
        txn_uuid: orderStatusResp.txn_uuid ? String(orderStatusResp.txn_uuid) : null,
        payment_method_type: orderStatusResp.payment_method_type ? String(orderStatusResp.payment_method_type) : null,
        payment_method: orderStatusResp.payment_method ? String(orderStatusResp.payment_method) : null,
        auth_type: orderStatusResp.auth_type ? String(orderStatusResp.auth_type) : null,
        return_url: orderStatusResp.return_url ? String(orderStatusResp.return_url) : null,
        product_id: orderStatusResp.product_id ? String(orderStatusResp.product_id) : null,
        gateway_id: orderStatusResp.gateway_id ?? null,
        gateway_reference_id: orderStatusResp.gateway_reference_id ? String(orderStatusResp.gateway_reference_id) : null,
        refunded: typeof orderStatusResp.refunded === 'boolean' ? orderStatusResp.refunded : null,
        amount_refunded: orderStatusResp.amount_refunded ?? null,
        effective_amount: orderStatusResp.effective_amount ?? null,
        raw: orderStatusResp
    };

    const { data, error } = await client
        .from(SUPABASE_PAYMENTS_TABLE)
        .upsert(row, { onConflict: 'order_id' })
        .select('order_id')
        .single();

    if (error) {
        throw new Error(`Supabase upsert failed: ${error.message}`);
    }
    return data;
}

// -------------------------
// Local payment config.json (optional, keep NON-SECRETS here)
// -------------------------
let localPaymentConfig = null;
try {
    const cfgPath = path.join(__dirname, 'config.json');
    // Read once on startup; env vars still override.
    // config.json is expected to be in project root (same folder as server.js).
    // Recommended keys: MERCHANT_ID, BASE_URL, RESELLER_ID, ENABLE_LOGGING, PAYMENT_PAGE_CLIENT_ID
    // Avoid storing secrets (API_KEY / RESPONSE_KEY) in this file for production.
    // eslint-disable-next-line global-require
    localPaymentConfig = require(cfgPath);
} catch {
    localPaymentConfig = null;
}

// -------------------------
// HDFC SmartGateway (Payment)
// -------------------------
const HDFC_BASE_URL =
    process.env.HDFC_SMARTGATEWAY_BASE_URL ||
    localPaymentConfig?.BASE_URL ||
    (process.env.HDFC_SMARTGATEWAY_ENV === 'production'
        ? 'https://smartgateway.hdfc.bank.in'
        : 'https://smartgateway.hdfcuat.bank.in');

const HDFC_MERCHANT_ID =
    process.env.HDFC_SMARTGATEWAY_MERCHANT_ID ||
    localPaymentConfig?.MERCHANT_ID ||
    '';

const HDFC_RESELLER_ID =
    process.env.HDFC_SMARTGATEWAY_RESELLER_ID ||
    localPaymentConfig?.RESELLER_ID ||
    'hdfc_reseller';

// Production-safe default: take secrets from env only.
// SmartGateway S2S auth header is: Basic base64(API_KEY + ':')
// Put base64(API_KEY + ':') into HDFC_SMARTGATEWAY_AUTH (with or without "Basic ").
const HDFC_AUTH = process.env.HDFC_SMARTGATEWAY_AUTH || '';
const HDFC_RESPONSE_KEY = process.env.HDFC_SMARTGATEWAY_RESPONSE_KEY || '';

// Optional dev fallback (explicitly opt-in) to allow secrets in config.json.
const ALLOW_CONFIG_PAYMENT_SECRETS = process.env.ALLOW_CONFIG_PAYMENT_SECRETS === '1';
const HDFC_AUTH_EFFECTIVE =
    HDFC_AUTH ||
    (ALLOW_CONFIG_PAYMENT_SECRETS && localPaymentConfig?.API_KEY
        ? Buffer.from(`${String(localPaymentConfig.API_KEY)}:`).toString('base64')
        : '');

const HDFC_RESPONSE_KEY_EFFECTIVE =
    HDFC_RESPONSE_KEY ||
    (ALLOW_CONFIG_PAYMENT_SECRETS && localPaymentConfig?.RESPONSE_KEY
        ? String(localPaymentConfig.RESPONSE_KEY)
        : '');

const HDFC_DATA_DIR = path.join(__dirname, 'data', 'hdfc');
const HDFC_ORDER_CTX_DIR = path.join(HDFC_DATA_DIR, 'orders');
const HDFC_LOG_DIR = path.join(__dirname, 'logs');
const HDFC_LOG_FILE = path.join(HDFC_LOG_DIR, 'hdfc-order-status.log.jsonl');
const HDFC_RETURN_LOG_FILE = path.join(HDFC_LOG_DIR, 'hdfc-return.log.jsonl');

async function ensureHdfcDirs() {
    await fs.mkdir(HDFC_ORDER_CTX_DIR, { recursive: true }).catch(() => {});
    await fs.mkdir(HDFC_LOG_DIR, { recursive: true }).catch(() => {});
}
ensureHdfcDirs();

function hdfcAuthHeader() {
    if (!HDFC_AUTH_EFFECTIVE) return '';
    return HDFC_AUTH_EFFECTIVE.startsWith('Basic ') ? HDFC_AUTH_EFFECTIVE : `Basic ${HDFC_AUTH_EFFECTIVE}`;
}

function newHdfcOrderId() {
    // Must be < 21 chars, alphanumeric, non-sequential.
    // Format: BBSH + 16 random base36 chars => 20 chars total.
    const rand = crypto.randomBytes(12).toString('hex'); // 24 hex chars
    const base36 = BigInt('0x' + rand).toString(36).toUpperCase(); // alphanumeric
    const padded = base36.padStart(16, '0').slice(0, 16);
    return `BBSH${padded}`; // 20 chars
}

function verifyHdfcSignedReturn(params, responseKey) {
    if (!responseKey) return { ok: null, reason: 'response_key_missing' };
    const signature = params?.signature;
    const signatureAlgorithm = params?.signature_algorithm;
    if (!signature || !signatureAlgorithm) return { ok: null, reason: 'signature_missing' };
    if (String(signatureAlgorithm).toUpperCase() !== 'HMAC-SHA256') {
        return { ok: false, reason: `unsupported_algorithm:${signatureAlgorithm}` };
    }

    const filtered = {};
    for (const [k, v] of Object.entries(params || {})) {
        if (k === 'signature' || k === 'signature_algorithm') continue;
        if (v === undefined || v === null) continue;
        filtered[k] = String(v);
    }

    const sortedKeys = Object.keys(filtered)
        .map((k) => encodeURIComponent(k))
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

    const encodedPairs = [];
    for (const encodedKey of sortedKeys) {
        const originalKey = Object.keys(filtered).find((k) => encodeURIComponent(k) === encodedKey);
        const originalVal = filtered[originalKey];
        encodedPairs.push(`${encodeURIComponent(originalKey)}=${encodeURIComponent(originalVal)}`);
    }

    const encodedString = encodeURIComponent(encodedPairs.join('&'));
    const computed = crypto.createHmac('sha256', responseKey).update(encodedString).digest('base64');
    const received = decodeURIComponent(String(signature));
    const ok = decodeURIComponent(computed) === received;
    return { ok, reason: ok ? 'ok' : 'mismatch' };
}

async function appendJsonl(filePath, obj) {
    const line = JSON.stringify(obj) + '\n';
    await fs.mkdir(path.dirname(filePath), { recursive: true }).catch(() => {});
    await require('fs').promises.appendFile(filePath, line, { encoding: 'utf8' });
}

async function saveOrderContext(orderId, ctx) {
    await ensureHdfcDirs();
    const p = path.join(HDFC_ORDER_CTX_DIR, `${orderId}.json`);
    await require('fs').promises.writeFile(p, JSON.stringify(ctx, null, 2), 'utf8');
}

async function loadOrderContext(orderId) {
    const p = path.join(HDFC_ORDER_CTX_DIR, `${orderId}.json`);
    try {
        const raw = await require('fs').promises.readFile(p, 'utf8');
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function hdfcVersionHeader() {
    return new Date().toISOString().slice(0, 10);
}

function requireHdfcConfig() {
    const missing = [];
    if (!HDFC_MERCHANT_ID) missing.push('HDFC_SMARTGATEWAY_MERCHANT_ID');
    if (!HDFC_AUTH) missing.push('HDFC_SMARTGATEWAY_AUTH');
    if (!HDFC_RESELLER_ID) missing.push('HDFC_SMARTGATEWAY_RESELLER_ID');
    if (missing.length) {
        const err = new Error(`Missing SmartGateway config: ${missing.join(', ')}`);
        err.status = 500;
        throw err;
    }
}

async function hdfcCreateOrder({
    orderId,
    amount,
    currency = 'INR',
    customerId,
    customerEmail,
    customerPhone,
    returnUrl,
    description,
    udf1,
    udf3,
    udf4,
    udf5,
    udf6,
    udf7,
    udf8,
    udf9,
    udf10
}) {
    requireHdfcConfig();
    if (!customerId) {
        const err = new Error('customerId is required (unique per customer) to send x-routing-id');
        err.status = 400;
        throw err;
    }

    const url = `${HDFC_BASE_URL}/orders`;
    const body = new URLSearchParams();
    body.set('order_id', orderId);
    body.set('amount', String(amount));
    body.set('currency', currency);
    body.set('customer_id', String(customerId));
    if (customerEmail) body.set('customer_email', String(customerEmail));
    if (customerPhone) body.set('customer_phone', String(customerPhone));
    if (returnUrl) body.set('return_url', String(returnUrl));
    if (description) body.set('description', String(description));

    // Per bank note: do not use udf2 (blocked for tokenization). Keep it unset.
    if (udf1) body.set('udf1', String(udf1));
    if (udf3) body.set('udf3', String(udf3));
    if (udf4) body.set('udf4', String(udf4));
    if (udf5) body.set('udf5', String(udf5));
    if (udf6) body.set('udf6', String(udf6));
    if (udf7) body.set('udf7', String(udf7));
    if (udf8) body.set('udf8', String(udf8));
    if (udf9) body.set('udf9', String(udf9));
    if (udf10) body.set('udf10', String(udf10));

    const headers = {
        version: hdfcVersionHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-merchantid': HDFC_MERCHANT_ID,
        'x-resellerid': HDFC_RESELLER_ID,
        'x-routing-id': String(customerId),
        Authorization: hdfcAuthHeader(),
    };

    const resp = await axios.post(url, body.toString(), { headers, timeout: 30000 });
    return resp.data;
}

async function hdfcOrderStatus(orderId, customerId) {
    requireHdfcConfig();
    if (!customerId) {
        const err = new Error('customerId is required (unique per customer) to send x-routing-id');
        err.status = 400;
        throw err;
    }
    const url = `${HDFC_BASE_URL}/orders/${encodeURIComponent(orderId)}`;
    const headers = {
        version: hdfcVersionHeader(),
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-merchantid': HDFC_MERCHANT_ID,
        'x-resellerid': HDFC_RESELLER_ID,
        'x-routing-id': String(customerId),
        Authorization: hdfcAuthHeader(),
    };
    const resp = await axios.get(url, { headers, timeout: 30000 });
    return resp.data;
}

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
const SUPABASE_TRYON_BUCKET = process.env.SUPABASE_TRYON_BUCKET || 'tryon-results';

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
 * HDFC SmartGateway: create order and return payment page link
 * POST /api/payments/hdfc/create-order
 * body: { amount, customerId, customerEmail?, customerPhone?, currency?, description? }
 */
app.post('/api/payments/hdfc/create-order', async (req, res, next) => {
    try {
        const amountRaw = req.body?.amount;
        const amount = typeof amountRaw === 'string' || typeof amountRaw === 'number' ? Number(amountRaw) : NaN;
        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Valid amount is required' });
        }

        const customerId = String(req.body?.customerId || '').trim();
        if (!customerId) {
            return res.status(400).json({ success: false, message: 'customerId is required (unique per customer)' });
        }

        const orderId = newHdfcOrderId();
        const returnUrl = `${req.protocol}://${req.get('host')}/payments/hdfc/return`;

        const data = await hdfcCreateOrder({
            orderId,
            amount: amount.toFixed(2),
            currency: (req.body?.currency || 'INR').toString(),
            customerId,
            customerEmail: req.body?.customerEmail,
            customerPhone: req.body?.customerPhone,
            returnUrl,
            description: req.body?.description || `BABISHA Order ${orderId}`,
            udf1: req.body?.udf1,
            // udf2 intentionally not used
            udf3: req.body?.udf3,
            udf4: req.body?.udf4,
            udf5: req.body?.udf5,
            udf6: req.body?.udf6,
            udf7: req.body?.udf7,
            udf8: req.body?.udf8,
            udf9: req.body?.udf9,
            udf10: req.body?.udf10,
        });

        await saveOrderContext(orderId, {
            orderId,
            amount: amount.toFixed(2),
            currency: (req.body?.currency || 'INR').toString(),
            customerId,
            createdAt: new Date().toISOString(),
            paymentLinkWeb: data?.payment_links?.web || null
        });

        return res.json({
            success: true,
            orderId,
            amount: amount.toFixed(2),
            currency: (req.body?.currency || 'INR').toString(),
            paymentUrl: data?.payment_links?.web,
            raw: data
        });
    } catch (e) {
        next(e);
    }
});

/**
 * HDFC SmartGateway: proxy order status (and log)
 * GET /api/payments/hdfc/order-status/:orderId
 */
app.get('/api/payments/hdfc/order-status/:orderId', async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
        const ctx = await loadOrderContext(orderId);
        const customerId = (ctx?.customerId || req.query?.customerId || '').toString();
        if (!customerId) {
            return res.status(400).json({ success: false, message: 'customerId is required to check order status' });
        }

        const startedAt = Date.now();
        let data;
        try {
            data = await hdfcOrderStatus(orderId, customerId);
        } finally {
            await appendJsonl(HDFC_LOG_FILE, {
                ts: new Date().toISOString(),
                type: 'order_status',
                orderId,
                customerId,
                elapsedMs: Date.now() - startedAt
            });
        }

        // Store the full order status response in Supabase (best-effort).
        try {
            await upsertPaymentOrderToSupabase(data);
        } catch (e) {
            await appendJsonl(HDFC_LOG_FILE, {
                ts: new Date().toISOString(),
                type: 'supabase_upsert_error',
                orderId,
                message: e?.message || String(e)
            }).catch(() => {});
        }

        return res.json({ success: true, data });
    } catch (e) {
        // Log errors too (without leaking auth)
        await appendJsonl(HDFC_LOG_FILE, {
            ts: new Date().toISOString(),
            type: 'order_status_error',
            orderId,
            message: e?.message || String(e),
            status: e?.response?.status,
            data: e?.response?.data
        }).catch(() => {});
        next(e);
    }
});

/**
 * HDFC SmartGateway: return URL handler (GET or POST).
 * Must NOT depend solely on client params; we verify using server-side order status API.
 */
async function handleHdfcReturn(req, res, next) {
    try {
        const params = Object.assign({}, req.query || {}, req.body || {});
        const orderId = params.order_id || params.orderId;
        if (!orderId) {
            return res.status(400).send('Missing order_id');
        }

        const sig = verifyHdfcSignedReturn(params, HDFC_RESPONSE_KEY_EFFECTIVE);

        await appendJsonl(HDFC_RETURN_LOG_FILE, {
            ts: new Date().toISOString(),
            type: 'return',
            method: req.method,
            path: req.originalUrl,
            orderId,
            signature: sig,
            receivedKeys: Object.keys(params || {})
        });

        const ctx = await loadOrderContext(orderId);
        const customerId = ctx?.customerId || '';
        let orderStatusResp = null;
        if (customerId) {
            try {
                orderStatusResp = await hdfcOrderStatus(orderId, customerId);
                await appendJsonl(HDFC_LOG_FILE, {
                    ts: new Date().toISOString(),
                    type: 'order_status_from_return',
                    orderId,
                    customerId,
                    status: orderStatusResp?.status,
                    status_id: orderStatusResp?.status_id,
                    amount: orderStatusResp?.amount
                });

                // Persist for bank testing / reconciliation (best-effort).
                try {
                    await upsertPaymentOrderToSupabase(orderStatusResp);
                } catch (e) {
                    await appendJsonl(HDFC_LOG_FILE, {
                        ts: new Date().toISOString(),
                        type: 'supabase_upsert_error',
                        orderId,
                        message: e?.message || String(e)
                    }).catch(() => {});
                }
            } catch (e) {
                await appendJsonl(HDFC_LOG_FILE, {
                    ts: new Date().toISOString(),
                    type: 'order_status_from_return_error',
                    orderId,
                    customerId,
                    message: e?.message || String(e),
                    status: e?.response?.status,
                    data: e?.response?.data
                }).catch(() => {});
            }
        }

        const status = orderStatusResp?.status || params.status || 'UNKNOWN';
        const amount = (orderStatusResp?.amount ?? ctx?.amount ?? '').toString();
        const currency = (orderStatusResp?.currency ?? ctx?.currency ?? 'INR').toString();

        const isSuccess = String(status).toUpperCase() === 'CHARGED';
        const humanMessage = isSuccess
            ? 'Payment successful'
            : String(status).toUpperCase() === 'PENDING'
                ? 'Payment pending'
                : `Payment status: ${status}`;

        const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Payment Response - BABISHA</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body{background:#0b1220;color:#e7edf7}
    .card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12)}
    .muted{color:rgba(231,237,247,.75)}
    .pill{display:inline-flex;align-items:center;gap:.5rem;padding:.35rem .75rem;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12)}
    .ok{color:#7CFFB2} .warn{color:#FFD37C} .bad{color:#FF8A8A}
    code{color:#b7d3ff}
  </style>
</head>
<body class="py-5">
  <div class="container" style="max-width:880px">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h1 class="h3 mb-1">Payment response</h1>
        <div class="muted">This page verifies status from HDFC SmartGateway in real-time.</div>
      </div>
      <a class="btn btn-outline-light" href="/index.html">Back to Home</a>
    </div>

    <div class="card p-4 mb-3">
      <div class="d-flex flex-wrap gap-2 mb-3">
        <span id="statusPill" class="pill ${isSuccess ? 'ok' : (String(status).toUpperCase().includes('PENDING') ? 'warn' : 'bad')}">
          <strong id="statusText">${humanMessage}</strong>
        </span>
        <span class="pill"><span class="muted">Order number</span> <code id="orderId">${orderId}</code></span>
        <span class="pill"><span class="muted">Amount</span> <code id="amount">${amount} ${currency}</code></span>
      </div>

      <div class="muted small">
        Signature check: <code>${sig.ok === null ? 'not_configured' : (sig.ok ? 'verified' : 'failed')}</code>
      </div>
    </div>

    <div class="card p-4">
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <div class="h5 mb-1">Live status</div>
          <div class="muted">If the payment is still updating, this page will refresh status automatically.</div>
        </div>
        <button id="refreshBtn" class="btn btn-light btn-sm">Refresh now</button>
      </div>
      <hr class="border-light opacity-10"/>
      <pre id="raw" class="small mb-0" style="white-space:pre-wrap"></pre>
    </div>
  </div>

  <script>
    const orderId = ${JSON.stringify(orderId)};
    const hasCustomerId = ${JSON.stringify(Boolean(customerId))};
    const refreshBtn = document.getElementById('refreshBtn');
    const raw = document.getElementById('raw');
    const statusText = document.getElementById('statusText');
    const amountEl = document.getElementById('amount');
    const statusPill = document.getElementById('statusPill');

    function setPill(kind){
      statusPill.classList.remove('ok','warn','bad');
      statusPill.classList.add(kind);
    }

    async function refresh() {
      if (!hasCustomerId) {
        raw.textContent = "Missing stored customerId for this order on the server. Create the order via /payment.html so the server can verify status.";
        return;
      }
      const r = await fetch('/api/payments/hdfc/order-status/' + encodeURIComponent(orderId));
      const j = await r.json();
      raw.textContent = JSON.stringify(j, null, 2);
      if (j && j.success && j.data) {
        const st = String(j.data.status || 'UNKNOWN');
        const amt = (j.data.amount ?? '').toString();
        const cur = (j.data.currency ?? 'INR').toString();
        amountEl.textContent = (amt ? (amt + " " + cur) : amountEl.textContent);
        if (st.toUpperCase() === 'CHARGED') {
          statusText.textContent = 'Payment successful';
          setPill('ok');
        } else if (st.toUpperCase().includes('PENDING')) {
          statusText.textContent = 'Payment pending';
          setPill('warn');
        } else {
          statusText.textContent = 'Payment status: ' + st;
          setPill('bad');
        }
      }
    }

    refreshBtn.addEventListener('click', refresh);
    refresh();
    setInterval(refresh, 2000);
  </script>
</body>
</html>`;

        res.set('Content-Type', 'text/html; charset=utf-8');
        return res.send(html);
    } catch (e) {
        next(e);
    }
}

app.get('/payments/hdfc/return', handleHdfcReturn);
app.post('/payments/hdfc/return', handleHdfcReturn);

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

