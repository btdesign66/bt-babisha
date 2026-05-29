/**
 * Supabase payment_orders persistence layer.
 */
const { createClient } = require('@supabase/supabase-js');
const {
    pickFirstValue,
    resolvePositiveAmount,
    mapGatewayResponseToPaymentRecord
} = require('./hdfc-smartgateway');

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
const SUPABASE_PAYMENTS_TABLE = process.env.SUPABASE_PAYMENTS_TABLE || 'payment_orders';

let supabaseAdmin = null;

function getSupabaseAdmin() {
    if (supabaseAdmin) return supabaseAdmin;
    if (!SUPABASE_URL || !SUPABASE_SERVER_KEY) return null;
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVER_KEY, {
        auth: { persistSession: false }
    });
    return supabaseAdmin;
}

function mergeRawResponseJson(existingRaw, incomingRaw) {
    const base =
        existingRaw && typeof existingRaw === 'object' && !Array.isArray(existingRaw)
            ? existingRaw
            : {};
    const addition =
        incomingRaw && typeof incomingRaw === 'object' && !Array.isArray(incomingRaw)
            ? incomingRaw
            : { event: incomingRaw };

    const history = Array.isArray(base.history) ? [...base.history] : [];
    history.push({
        at: new Date().toISOString(),
        stage: addition.stage || addition.gatewayStatus || 'update',
        snapshot: addition
    });

    return {
        ...base,
        ...addition,
        history,
        lastUpdated: new Date().toISOString()
    };
}

function mergePaymentFields(existing, incoming) {
    if (!existing) return incoming;

    const merged = { ...incoming };
    const preserveIfEmpty = [
        'customer_email',
        'customer_phone',
        'customer_name',
        'customer_location',
        'customer_id',
        'merchant_id',
        'product_id',
        'product_name',
        'currency',
        'return_url',
        'txn_id',
        'txn_uuid',
        'payment_method',
        'payment_method_type',
        'auth_type',
        'gateway_reference_id'
    ];

    for (const key of preserveIfEmpty) {
        const newVal = merged[key];
        const oldVal = existing[key];
        if ((!newVal || String(newVal).trim() === '') && oldVal != null && String(oldVal).trim() !== '') {
            merged[key] = oldVal;
        }
    }

    const mergedAmount = resolvePositiveAmount(
        incoming.amount,
        existing.amount,
        existing.effective_amount
    );
    if (mergedAmount) {
        merged.amount = mergedAmount;
    } else if (existing.amount) {
        merged.amount = existing.amount;
    }

    if (incoming.gateway_id == null && existing.gateway_id != null) {
        merged.gateway_id = existing.gateway_id;
    }

    merged.raw_response_json = mergeRawResponseJson(
        existing.raw_response_json || existing.raw,
        incoming.raw_response_json
    );

    return merged;
}

function buildPaymentRecord(payload = {}) {
    const gatewayStatus = pickFirstValue(
        payload.gateway_status,
        payload.status,
        payload.order_status
    ).toUpperCase();

    const amount = resolvePositiveAmount(
        payload.amount,
        payload.order_amount,
        payload.effective_amount
    );

    const statusIdRaw = pickFirstValue(payload.status_id, payload.order_status_id);
    const statusIdNum = Number(statusIdRaw);
    const gatewayIdRaw = pickFirstValue(payload.gateway_id);
    const gatewayIdNum = Number(gatewayIdRaw);
    const refundedValue = payload.refunded;

    const rawResponse =
        payload.raw_response_json !== undefined
            ? payload.raw_response_json
            : payload.raw !== undefined
              ? payload.raw
              : {
                    stage: pickFirstValue(payload.stage) || 'snapshot',
                    capturedAt: new Date().toISOString(),
                    payload
                };

    return {
        order_id: pickFirstValue(payload.order_id, payload.orderId),
        sg_internal_id: pickFirstValue(
            payload.sg_internal_id,
            payload.sgInternalId,
            payload.internal_order_id
        ),
        merchant_id: pickFirstValue(payload.merchant_id, payload.merchantId),
        customer_id: pickFirstValue(payload.customer_id, payload.customerId),
        customer_email: pickFirstValue(payload.customer_email, payload.customerEmail),
        customer_phone: pickFirstValue(payload.customer_phone, payload.customerPhone),
        customer_name: pickFirstValue(payload.customer_name, payload.customerName),
        customer_location: pickFirstValue(
            payload.customer_location,
            payload.customerAddress,
            payload.customerLocation
        ),
        product_name: pickFirstValue(payload.product_name, payload.productName),
        product_id: pickFirstValue(payload.product_id, payload.productId),
        gateway_status: gatewayStatus || null,
        status: payload.status || 'pending',
        status_id: Number.isFinite(statusIdNum) ? statusIdNum : null,
        amount,
        currency: pickFirstValue(payload.currency, payload.order_currency) || 'INR',
        txn_id: pickFirstValue(payload.txn_id, payload.txnId),
        txn_uuid: pickFirstValue(payload.txn_uuid, payload.txnUuid),
        payment_method_type: pickFirstValue(payload.payment_method_type, payload.paymentMethodType),
        payment_method: pickFirstValue(payload.payment_method, payload.paymentMethod),
        auth_type: pickFirstValue(payload.auth_type, payload.authType),
        return_url: pickFirstValue(payload.return_url, payload.returnUrl),
        gateway_id: Number.isFinite(gatewayIdNum) ? gatewayIdNum : null,
        gateway_reference_id: pickFirstValue(
            payload.gateway_reference_id,
            payload.gatewayReferenceId
        ),
        refunded:
            refundedValue === true ||
            refundedValue === 'true' ||
            refundedValue === 1 ||
            (typeof refundedValue === 'string' &&
                ['true', '1', 'yes'].includes(refundedValue.toLowerCase())),
        amount_refunded: resolvePositiveAmount(payload.amount_refunded),
        effective_amount: resolvePositiveAmount(payload.effective_amount, amount),
        raw_response_json: rawResponse
    };
}

function stripMissingPaymentColumns(record, errorMessage = '') {
    const msg = String(errorMessage).toLowerCase();
    const stripped = { ...record };
    const optionalColumns = [
        'gateway_status',
        'product_name',
        'customer_location',
        'customer_name',
        'raw_response_json',
        'effective_amount',
        'sg_internal_id',
        'product_id'
    ];

    for (const column of optionalColumns) {
        if (msg.includes(column)) {
            delete stripped[column];
            if (column === 'raw_response_json' && record.raw) {
                stripped.raw = record.raw_response_json || record.raw;
            }
        }
    }

    return stripped;
}

async function fetchPaymentOrder(orderId) {
    const client = getSupabaseAdmin();
    if (!client || !orderId) return null;

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

async function upsertPaymentOrder(payload = {}) {
    const client = getSupabaseAdmin();
    if (!client) {
        throw new Error(
            'Supabase payments are not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in .env.'
        );
    }

    let record = buildPaymentRecord(payload);
    if (!record.order_id) {
        throw new Error('Cannot save payment order without order_id.');
    }

    if (!record.amount) {
        throw new Error(
            `Refusing to save order ${record.order_id} with empty/zero amount. Provide a valid order amount.`
        );
    }

    const existing = await fetchPaymentOrder(record.order_id);
    if (existing) {
        record = mergePaymentFields(existing, record);
    }

    let { data, error } = await client
        .from(SUPABASE_PAYMENTS_TABLE)
        .upsert(record, { onConflict: 'order_id' })
        .select()
        .single();

    if (error) {
        const fallbackRecord = stripMissingPaymentColumns(record, error.message);
        const removedColumns = Object.keys(record).filter((key) => !(key in fallbackRecord));
        if (removedColumns.length > 0) {
            console.warn(
                `Payment upsert retry without columns [${removedColumns.join(', ')}]: ${error.message}`
            );
            ({ data, error } = await client
                .from(SUPABASE_PAYMENTS_TABLE)
                .upsert(fallbackRecord, { onConflict: 'order_id' })
                .select()
                .single());
        }
    }

    if (error) {
        console.error('Supabase payment save failed:', error.message, { order_id: record.order_id });
        throw new Error(`Supabase payment save failed: ${error.message}`);
    }

    console.log(
        'Payment order saved:',
        record.order_id,
        'gateway_status=',
        record.gateway_status,
        'status=',
        record.status,
        'amount=',
        record.amount
    );
    return data;
}

/**
 * Verify HDFC return, fetch order status API, persist final row.
 */
async function verifyAndPersistPaymentFromGateway(orderId, callbackPayload = {}, options = {}) {
    const { loadHdfcConfig, verifyReturnSignature, fetchHdfcOrderStatus } = require('./hdfc-smartgateway');

    const config = await loadHdfcConfig();
    const existing = await fetchPaymentOrder(orderId);

    const signatureVerification = verifyReturnSignature(callbackPayload, config.responseKey);
    if (!signatureVerification.valid) {
        throw new Error(`HDFC return signature verification failed: ${signatureVerification.reason}`);
    }

    const customerId = pickFirstValue(
        callbackPayload.customer_id,
        callbackPayload.customerId,
        existing?.customer_id,
        options.customerId
    );

    const gatewayData = await fetchHdfcOrderStatus(orderId, customerId);

    const record = mapGatewayResponseToPaymentRecord(gatewayData, {
        orderId,
        merchantId: config.merchantId,
        existing,
        callbackPayload,
        signatureVerification,
        checkoutAmount: existing?.amount
    });

    if (!record.order_id) {
        record.order_id = orderId;
    }

    return upsertPaymentOrder(record);
}

module.exports = {
    getSupabaseAdmin,
    buildPaymentRecord,
    fetchPaymentOrder,
    upsertPaymentOrder,
    verifyAndPersistPaymentFromGateway,
    mapGatewayResponseToPaymentRecord
};
