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

// Enable CORS - allow Vite dev server
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/complaints', require('./routes/complaint.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/roles', require('./routes/role.routes'));
app.use('/api/organization', require('./routes/organization.routes'));

module.exports = app;
