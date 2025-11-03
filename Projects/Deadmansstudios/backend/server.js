// backend/server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON in requests
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Node.js backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});