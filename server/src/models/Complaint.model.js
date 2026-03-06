const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please choose a category']
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
        default: 'Open'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false // User is sometimes anonymous
    },
    userName: {
        type: String,
        default: 'Anonymous'
    },
    organizationName: {
        type: String,
        required: [true, 'Organization name is required to route complaint']
    },
    assignedWorkerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Worker'
    },
    assignedWorkerName: {
        type: String
    },
    assignedDate: {
        type: Date
    },
    progress: {
        type: Number,
        default: 0
    },
    attachments: [{
        url: String,
        type: { type: String }, // 'image' or 'video'
        name: String
    }],
    workLog: [{
        note: String,
        progress: Number,
        status: String,
        by: String,
        at: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
