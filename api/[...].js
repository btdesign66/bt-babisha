/**
 * Vercel Serverless Function - Catch-all API route
 * Handles all /api/* requests
 */

// Set Vercel environment before requiring server
process.env.VERCEL = '1';
process.env.VERCEL_ENV = process.env.VERCEL_ENV || 'production';

// Import the Express app
const app = require('../server');

// Export handler for Vercel
// Vercel will pass (req, res) to the Express app
module.exports = app;

