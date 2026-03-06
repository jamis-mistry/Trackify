const Testimonial = require('../models/Testimonial.model');

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res) => {
    try {
        const filter = {};
        // Admin can see all; public sees only approved
        if (!req.query.all) {
            filter.isApproved = true;
        }
        const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private (Admin)
exports.createTestimonial = async (req, res) => {
    try {
        const { name, role, company, content, rating } = req.body;

        if (!name || !role || !company || !content) {
            return res.status(400).json({ success: false, error: 'Please provide name, role, company, and content' });
        }

        const testimonial = await Testimonial.create({ name, role, company, content, rating: rating || 5 });
        res.status(201).json({ success: true, data: testimonial });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Toggle approval status
// @route   PATCH /api/testimonials/:id/approve
// @access  Private (Admin)
exports.toggleApproval = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json({ success: false, error: 'Testimonial not found' });
        }
        testimonial.isApproved = !testimonial.isApproved;
        await testimonial.save();
        res.status(200).json({ success: true, data: testimonial });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
