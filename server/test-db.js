require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log('Using connection string:', uri ? uri.replace(/\/\/.*@/, '//****@') : 'undefined');

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
    process.exit(0);
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
});