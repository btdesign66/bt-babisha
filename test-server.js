// Quick test to see if server can start
const express = require('express');
const app = express();
const PORT = 3000;

app.use(require('cors')());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`✅ Test server running on http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log(`\n✅ If you see this, the server is working!`);
    console.log(`\nPress Ctrl+C to stop.\n`);
});


