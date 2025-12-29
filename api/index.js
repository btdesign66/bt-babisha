/**
 * Vercel Serverless Function Entry Point
 * This wraps the Express app for Vercel deployment
 */

// Set Vercel environment
process.env.VERCEL = '1';

const app = require('../server');

// Export handler for Vercel serverless functions
module.exports = (req, res) => {
    // Vercel serverless function handler
    return app(req, res);
};


