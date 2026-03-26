/**
 * Vercel Serverless Function
 * Explicit handler for GET /api/health
 */

process.env.VERCEL = '1';
process.env.VERCEL_ENV = process.env.VERCEL_ENV || 'production';

const app = require('../server');

module.exports = (req, res) => app(req, res);

