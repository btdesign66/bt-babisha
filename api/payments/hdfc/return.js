/**
 * Dedicated Vercel handler for HDFC return (GET/POST).
 */
process.env.VERCEL = '1';
process.env.VERCEL_ENV = process.env.VERCEL_ENV || 'production';

const app = require('../../../server');

module.exports = (req, res) => app(req, res);
