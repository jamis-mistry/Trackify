const express = require('express');
const cors = require('cors');

// Route files
const auth = require('./routes/auth.routes');

const app = express();
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, '..', 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'uploads'), { recursive: true });
}

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/complaints', require('./routes/complaint.routes'));

module.exports = app;
