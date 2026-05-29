/**
 * HDFC SmartGateway / Juspay payment gateway helpers.
 */
const crypto = require('crypto');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

const GATEWAY_STATUS_MAP = {
    CHARGED: 'success',
    FAILED: 'failed',
    PENDING_VBV: 'pending',
    AUTHORIZING: 'pending',
    NEW: 'pending',
    CREATED: 'pending',
    REFUNDED: 'refunded'
};

function pickFirstValue(...values) {
    for (const value of values) {
        if (value === undefined || value === null) continue;
        const trimmed = String(value).trim();
        if (trimmed) return trimmed;
    }
    return '';
}

function mapGatewayStatusToDb(gatewayStatus) {
    const key = String(gatewayStatus || '').trim().toUpperCase();
    if (!key) return 'pending';
    if (GATEWAY_STATUS_MAP[key]) return GATEWAY_STATUS_MAP[key];
    const lower = key.toLowerCase();
    if (lower.includes('charg') || lower.includes('success') || lower.includes('captured')) return 'success';
    if (lower.includes('fail') || lower.includes('declin') || lower.includes('cancel')) return 'failed';
    if (lower.includes('refund')) return 'refunded';
    return 'pending';
}

function isPaymentSuccessful(gatewayStatus) {
    return String(gatewayStatus || '').trim().toUpperCase() === 'CHARGED';
}

function resolvePositiveAmount(...candidates) {
    for (const value of candidates) {
        const num = typeof value === 'number' ? value : Number(value);
        if (Number.isFinite(num) && num > 0) {
            return num.toFixed(2);
        }
    }
    return null;
}

async function loadHdfcConfig() {
    let config = {};
    try {
        const raw = await fs.readFile(path.join(__dirname, '..', 'config.json'), 'utf8');
        config = JSON.parse(raw);
    } catch {
        // optional config.json
    }

    const baseUrl = (
        process.env.HDFC_SMARTGATEWAY_BASE_URL ||
        config.BASE_URL ||
        config.HDFC_SMARTGATEWAY_BASE_URL ||
        ''
    ).replace(/\/$/, '');

    const merchantId =
        process.env.HDFC_SMARTGATEWAY_MERCHANT_ID || config.MERCHANT_ID || '';
    const resellerId =
        process.env.HDFC_SMARTGATEWAY_RESELLER_ID || config.RESELLER_ID || 'hdfc_reseller';
    const auth = process.env.HDFC_SMARTGATEWAY_AUTH || config.HDFC_SMARTGATEWAY_AUTH || '';
    const responseKey =
        process.env.HDFC_SMARTGATEWAY_RESPONSE_KEY || config.RESPONSE_KEY || '';

    const normalizedAuth = auth.startsWith('Basic ') ? auth : auth ? `Basic ${auth}` : '';

    return {
        baseUrl,
        merchantId,
        resellerId,
        auth: normalizedAuth,
        responseKey
    };
}

function buildHdfcHeaders(config, customerId) {
    const version =
        process.env.HDFC_SMARTGATEWAY_API_VERSION ||
        new Date().toISOString().slice(0, 10);

    const headers = {
        Authorization: config.auth,
        'x-merchantid': config.merchantId,
        'x-resellerid': config.resellerId,
        version,
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    if (customerId) {
        headers['x-routing-id'] = customerId;
        headers['x-customerid'] = customerId;
    }

    return headers;
}

/**
 * Juspay return_url HMAC-SHA256 signature verification.
 * @see https://docs.juspay.io/hdfc-resources/docs/common-resources/status-verification
 */
function verifyReturnSignature(params = {}, responseKey) {
    if (!responseKey) {
        return { valid: true, skipped: true, reason: 'HDFC_SMARTGATEWAY_RESPONSE_KEY not configured' };
    }

    const signature = pickFirstValue(params.signature);
    const signatureAlgorithm = pickFirstValue(params.signature_algorithm);

    if (!signature) {
        return { valid: true, skipped: true, reason: 'No signature in callback payload' };
    }

    if (signatureAlgorithm && signatureAlgorithm.toUpperCase() !== 'HMAC-SHA256') {
        return { valid: false, reason: `Unsupported signature algorithm: ${signatureAlgorithm}` };
    }

    const entries = Object.entries(params).filter(([key]) => {
        const k = key.toLowerCase();
        return k !== 'signature' && k !== 'signature_algorithm';
    });

    entries.sort(([a], [b]) => a.localeCompare(b));

    const queryString = entries
        .map(([key, value]) => {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(String(value ?? ''));
            return `${encodedKey}=${encodedValue}`;
        })
        .join('&');

    const expectedHash = crypto
        .createHmac('sha256', responseKey)
        .update(queryString)
        .digest('base64');
    const received = String(signature).trim();

    const candidates = [expectedHash, encodeURIComponent(expectedHash), decodeURIComponent(received)];
    const valid = candidates.some((candidate) => {
        if (!candidate || candidate.length !== received.length) return false;
        try {
            return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(received));
        } catch {
            return false;
        }
    });

    return { valid, skipped: false, reason: valid ? 'ok' : 'signature mismatch' };
}

/**
 * GET /orders/{order_id} — final order status from HDFC.
 */
async function fetchHdfcOrderStatus(orderId, customerId) {
    const config = await loadHdfcConfig();
    if (!config.baseUrl || !config.auth || !config.merchantId) {
        throw new Error('HDFC SmartGateway is not configured for order status lookup.');
    }

    const url = `${config.baseUrl}/orders/${encodeURIComponent(orderId)}`;
    const result = await axios.get(url, {
        headers: buildHdfcHeaders(config, customerId),
        proxy: false,
        timeout: 60000,
        validateStatus: (status) => status < 500
    });

    if (result.status >= 400) {
        const detail =
            typeof result.data === 'string'
                ? result.data
                : result.data?.error_message || result.data?.message || JSON.stringify(result.data);
        throw new Error(`HDFC order status failed (${result.status}): ${detail}`);
    }

    return result.data || {};
}

/**
 * Map HDFC order status API + callback payload into payment_orders row shape.
 */
function mapGatewayResponseToPaymentRecord(gatewayData = {}, context = {}) {
    const gatewayStatus = pickFirstValue(
        gatewayData.status,
        gatewayData.order_status,
        context.callbackPayload?.status,
        context.callbackPayload?.order_status
    ).toUpperCase();

    const txn = gatewayData.txn_detail || gatewayData.transaction || gatewayData.payment || {};
    const card = gatewayData.card || txn.card || {};

    const amount = resolvePositiveAmount(
        gatewayData.amount,
        gatewayData.order_amount,
        gatewayData.effective_amount,
        context.checkoutAmount,
        context.existing?.amount,
        context.callbackPayload?.amount,
        context.callbackPayload?.effective_amount
    );

    const amountRefunded = resolvePositiveAmount(
        gatewayData.amount_refunded,
        gatewayData.refunded_amount
    );

    const paymentMethod = pickFirstValue(
        gatewayData.payment_method,
        txn.payment_method,
        card.card_brand,
        card.brand,
        gatewayData.payment_method_type
    );

    const paymentMethodType = pickFirstValue(
        gatewayData.payment_method_type,
        txn.payment_method_type,
        card.card_type
    );

    const gatewayIdRaw = pickFirstValue(gatewayData.gateway_id, txn.gateway_id);
    const gatewayIdNum = Number(gatewayIdRaw);

    const statusIdRaw = pickFirstValue(gatewayData.status_id, gatewayData.order_status_id);
    const statusIdNum = Number(statusIdRaw);

    const refundedFlag = gatewayData.refunded;
    const refunded =
        refundedFlag === true ||
        refundedFlag === 'true' ||
        String(gatewayStatus).toUpperCase() === 'REFUNDED' ||
        (amountRefunded && Number(amountRefunded) > 0);

    const rawResponse = {
        gatewayStatus,
        normalizedStatus: mapGatewayStatusToDb(gatewayStatus),
        verifiedAt: new Date().toISOString(),
        orderStatusApi: gatewayData,
        returnCallback: context.callbackPayload || null,
        signatureVerification: context.signatureVerification || null
    };

    return {
        order_id: pickFirstValue(gatewayData.order_id, gatewayData.orderId, context.orderId),
        sg_internal_id: pickFirstValue(gatewayData.id, gatewayData.sg_internal_id),
        merchant_id: pickFirstValue(gatewayData.merchant_id, context.merchantId, context.existing?.merchant_id),
        customer_id: pickFirstValue(
            gatewayData.customer_id,
            gatewayData.customerId,
            context.existing?.customer_id
        ),
        customer_name: pickFirstValue(context.existing?.customer_name, context.checkout?.customerName),
        customer_email: pickFirstValue(
            gatewayData.customer_email,
            gatewayData.customerEmail,
            context.existing?.customer_email,
            context.checkout?.customerEmail
        ),
        customer_phone: pickFirstValue(
            gatewayData.customer_phone,
            gatewayData.customerPhone,
            context.existing?.customer_phone,
            context.checkout?.customerPhone
        ),
        customer_location: pickFirstValue(context.existing?.customer_location, context.checkout?.customerAddress),
        product_name: pickFirstValue(context.existing?.product_name, context.checkout?.productName),
        product_id: pickFirstValue(gatewayData.product_id, context.existing?.product_id),
        amount,
        currency: pickFirstValue(gatewayData.currency, context.existing?.currency) || 'INR',
        gateway_status: gatewayStatus || null,
        status: mapGatewayStatusToDb(gatewayStatus),
        status_id: Number.isFinite(statusIdNum) ? statusIdNum : null,
        txn_id: pickFirstValue(gatewayData.txn_id, gatewayData.txnId, txn.txn_id, txn.id),
        txn_uuid: pickFirstValue(gatewayData.txn_uuid, gatewayData.txnUuid, txn.txn_uuid),
        payment_method: paymentMethod,
        payment_method_type: paymentMethodType,
        auth_type: pickFirstValue(gatewayData.auth_type, gatewayData.authType, txn.auth_type),
        gateway_id: Number.isFinite(gatewayIdNum) ? gatewayIdNum : null,
        gateway_reference_id: pickFirstValue(
            gatewayData.gateway_reference_id,
            gatewayData.gatewayReferenceId,
            txn.gateway_reference_id,
            txn.reference_id
        ),
        return_url: pickFirstValue(gatewayData.return_url, context.existing?.return_url),
        refunded: refunded || false,
        amount_refunded: amountRefunded,
        effective_amount: resolvePositiveAmount(gatewayData.effective_amount, amount),
        raw_response_json: rawResponse
    };
}

module.exports = {
    GATEWAY_STATUS_MAP,
    pickFirstValue,
    mapGatewayStatusToDb,
    isPaymentSuccessful,
    resolvePositiveAmount,
    loadHdfcConfig,
    buildHdfcHeaders,
    verifyReturnSignature,
    fetchHdfcOrderStatus,
    mapGatewayResponseToPaymentRecord
};
