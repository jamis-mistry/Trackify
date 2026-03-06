const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Please add a role/designation'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please add a company/organization'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please add testimonial content'],
        trim: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    isApproved: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
