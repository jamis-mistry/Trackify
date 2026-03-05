const IssueCategory = require('../models/IssueCategory.model');
const WorkerCategory = require('../models/WorkerCategory.model');

// @desc    Get all categories by type
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const { type } = req.query;

        let categories;
        if (type === 'issue') {
            categories = await IssueCategory.find({});
        } else if (type === 'worker') {
            categories = await WorkerCategory.find({});
        } else {
            // If no type, return both (optional, but good for completeness)
            const issues = await IssueCategory.find({});
            const workers = await WorkerCategory.find({});
            categories = { issues, workers };
        }

        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
    try {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({ success: false, error: 'Please provide name and type' });
        }

        let category;
        if (type === 'issue') {
            category = await IssueCategory.create({ name });
        } else if (type === 'worker') {
            category = await WorkerCategory.create({ name });
        } else {
            return res.status(400).json({ success: false, error: 'Invalid category type' });
        }

        res.status(201).json({ success: true, data: category });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Category already exists' });
        }
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.query; // Need type to know which collection

        if (!type) {
            return res.status(400).json({ success: false, error: 'Please provide category type to delete' });
        }

        let success;
        if (type === 'issue') {
            success = await IssueCategory.findByIdAndDelete(id);
        } else if (type === 'worker') {
            success = await WorkerCategory.findByIdAndDelete(id);
        }

        if (!success) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
