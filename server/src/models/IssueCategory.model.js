const mongoose = require('mongoose');

const IssueCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an issue category name'],
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('IssueCategory', IssueCategorySchema);
