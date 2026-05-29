/**
 * GET /api/payments/hdfc/order/:orderId
 */
process.env.VERCEL = '1';
process.env.VERCEL_ENV = process.env.VERCEL_ENV || 'production';

const app = require('../../../../server');

module.exports = (req, res) => app(req, res);
