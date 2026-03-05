const mongoose = require('mongoose');

const WorkerCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a worker category name'],
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('WorkerCategory', WorkerCategorySchema);
