const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/trackify';

        // Detailed logging for debugging connection failures (masking credentials)
        const maskedURI = mongoURI.replace(/\/\/.*:.*@/, '//****:****@');
        console.log(`Attempting to connect to MongoDB: ${maskedURI}`);

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            connectTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            family: 4 // Use IPv4
        });

        conn.deleteModel("Organization")

        console.log(` MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(` MongoDB Connection Error: ${error.message}`);
        // Keep retrying or exit? Development usually exits but let's see.
        process.exit(1);
    }
};

module.exports = connectDB;
