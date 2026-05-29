# Fix HTTP 405 on live payments

## Vercel project settings (required)

1. Open [Vercel Dashboard](https://vercel.com) → project **bt-babisha** → **Settings** → **General**
2. **Build & Development Settings**
3. Set **Output Directory** to **empty** (not `dist`)
4. **Framework Preset**: Other
5. Save and **Redeploy** (Deployments → … → Redeploy)

If Output Directory is `dist`, Vercel serves `api/*.js` as static files → POST returns **405**.

## Verify after deploy

- https://www.babisha.com/api/health must return JSON: `{"status":"ok",...}`
- It must **NOT** show JavaScript source code.

## API files (one serverless function per route)

- `api/health.js`
- `api/payments/hdfc/create-order.js`
- `api/payments/hdfc/return.js`
- `api/payments/hdfc/order/[orderId].js`
- `api/try-on.js`
