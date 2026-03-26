/**
 * Vercel Serverless Function
 * Explicit handler for POST /api/try-on
 *
 * This forwards requests to the existing Express app in `server.js`.
 */

process.env.VERCEL = '1';
process.env.VERCEL_ENV = process.env.VERCEL_ENV || 'production';

const app = require('../server');

module.exports = (req, res) => app(req, res);

