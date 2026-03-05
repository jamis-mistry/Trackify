const Category = require('../models/Category.json.js');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const query = {};
        if (req.query.type) query.type = req.query.type;

        const categories = await Category.find(query);
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

        const category = await Category.create({ name, type });
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
    try {
        const success = await Category.findByIdAndDelete(req.params.id);
        if (!success) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
