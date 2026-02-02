const express = require('express');
const cors = require('cors');

// Route files
const auth = require('./routes/auth.routes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/complaints', require('./routes/complaint.routes'));

module.exports = app;
