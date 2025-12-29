/**
 * Vercel Serverless Function Entry Point
 * This wraps the Express app for Vercel deployment
 */

// Set Vercel environment before requiring server
process.env.VERCEL = '1';
process.env.VERCEL_ENV = process.env.VERCEL_ENV || 'production';

// Import the Express app
const app = require('../server');

// Export the Express app directly - Vercel will handle it
module.exports = app;


