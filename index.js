const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Simple route
app.get('/', (req, res) => {
  res.send('Hello Multi-Tenant App! 🚀');
});

// Start server
app.listen(port, () => {
  console.log(`Dummy Node.js app running on port ${port}`);
});
