const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Default to local if not in env
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/trackify');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
