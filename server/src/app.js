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

// Enable CORS - allow Vite dev server and local network access
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow localhost on any port
        if (origin.match(/^http:\/\/localhost:\d+$/) || origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
            return callback(null, true);
        }

        // Allow specific production domains if needed
        const allowedOrigins = ['https://trackify-app.com'];
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'), false);
    },
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
app.use('/api/testimonials', require('./routes/testimonial.routes'));

module.exports = app;
