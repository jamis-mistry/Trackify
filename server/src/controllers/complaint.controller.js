const Complaint = require('../models/Complaint.model');
const User = require('../models/User.model');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res, next) => {
    try {
        let query = {};

        // If user is not admin, only show their own complaints (Optional logic, for now show all or filter by query)
        // For migration simplicity, we support query params:
        if (req.query.userId) {
            query.userId = req.query.userId;
        }

        const complaints = await Complaint.find(query);

        res.status(200).json({ success: true, count: complaints.length, data: complaints });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res, next) => {
    try {
        // req.body contains { title, description, category, priority, userId, ... }

        // Enrich with user name if possible
        let userName = 'Anonymous';
        if (req.body.userId) {
            const user = await User.findOne({ _id: req.body.userId }); // We might need to adjust User.json.js to support findById or use findOne({_id: ...})
            if (user) userName = user.name;
        }

        // Map uploaded files to URLs
        let attachments = [];
        if (req.files && req.files.length > 0) {
            attachments = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                type: file.mimetype.startsWith('video') ? 'video' : 'image',
                name: file.originalname
            }));
        }

        const complaint = await Complaint.create({
            ...req.body,
            userName,
            attachments,
            status: 'Open',
            createdAt: new Date()
        });

        res.status(201).json({ success: true, data: complaint });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
exports.updateComplaint = async (req, res, next) => {
    try {
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }

        complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ success: true, data: complaint });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
