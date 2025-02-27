console.log("Starting server...");

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS to allow frontend communication
app.use(express.json()); // Allow JSON request body

// Simple API route
app.get('/api/message', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});