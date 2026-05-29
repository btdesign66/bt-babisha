/**
 * Vercel Serverless Function - Catch-all API route
 * Handles all /api/* requests, including nested payment paths.
 */

process.env.VERCEL = '1';
process.env.VERCEL_ENV = process.env.VERCEL_ENV || 'production';

const app = require('../server');

module.exports = app;
