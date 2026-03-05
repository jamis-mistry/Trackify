const User = require('../models/User.model');
const Organization = require('../models/Organization.model');
const Worker = require('../models/Worker.model');

// Helper: find any user across all collections by email
const findAcrossCollections = async (query) => {
    let record = await User.findOne(query);
    if (!record) record = await Organization.findOne(query);
    if (!record) record = await Worker.findOne(query);
    return record;
};

// Helper: find any user across all collections by _id
const findByIdAcrossCollections = async (id) => {
    let record = await User.findById(id);
    if (!record) record = await Organization.findById(id);
    if (!record) record = await Worker.findById(id);
    return record;
};

// @desc   Get all users in an organization
// @route  GET /api/organization/users
// @access Private (Org admin)
exports.getOrgUsers = async (req, res) => {
    try {
        const { organizationName } = req.query;
        if (!organizationName) {
            return res.status(400).json({ success: false, error: 'organizationName query param required' });
        }

        const query = { organizationName };
        const users = await User.find(query).select('-password');
        const workers = await Worker.find(query).select('-password');

        const all = [...users, ...workers];
        res.status(200).json({ success: true, data: all });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc   Search user by email (across any collection)
// @route  GET /api/organization/search?email=...
// @access Private (Org admin)
exports.searchUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, error: 'email query param required' });
        }

        const user = await findAcrossCollections({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: 'No user found with that email' });
        }

        const { password, ...safeUser } = user.toObject();
        res.status(200).json({ success: true, data: safeUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc   Add (link) an existing user to an organization
// @route  POST /api/organization/users
// @access Private (Org admin)
exports.addUserToOrg = async (req, res) => {
    try {
        const { email, organizationName } = req.body;

        if (!email || !organizationName) {
            return res.status(400).json({ success: false, error: 'email and organizationName are required' });
        }

        // Check across all collections
        let user = await User.findOneAndUpdate(
            { email },
            { organizationName },
            { new: true }
        );
        if (!user) {
            user = await Worker.findOneAndUpdate(
                { email },
                { organizationName },
                { new: true }
            );
        }

        if (!user) {
            return res.status(404).json({ success: false, error: 'No user found with that email' });
        }

        const { password, ...safeUser } = user.toObject();
        res.status(200).json({ success: true, data: safeUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc   Remove a user from an organization (unlink)
// @route  DELETE /api/organization/users/:id
// @access Private (Org admin)
exports.removeUserFromOrg = async (req, res) => {
    try {
        const { id } = req.params;

        let user = await User.findByIdAndUpdate(id, { organizationName: null }, { new: true });
        if (!user) {
            user = await Worker.findByIdAndUpdate(id, { organizationName: null }, { new: true });
        }

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User removed from organization' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc   Get org stats (member count, complaint counts)
// @route  GET /api/organization/stats
// @access Private (Org admin)
exports.getOrgStats = async (req, res) => {
    try {
        const { organizationName } = req.query;
        if (!organizationName) {
            return res.status(400).json({ success: false, error: 'organizationName required' });
        }

        const Complaint = require('../models/Complaint.model');
        const userCount = await User.countDocuments({ organizationName });
        const workerCount = await Worker.countDocuments({ organizationName });

        let totalComplaints = 0, openComplaints = 0, resolvedComplaints = 0;
        try {
            totalComplaints = await Complaint.countDocuments({ organizationName });
            openComplaints = await Complaint.countDocuments({ organizationName, status: 'Open' });
            resolvedComplaints = await Complaint.countDocuments({ organizationName, status: 'Resolved' });
        } catch (e) {
            // Complaint model might be json-based, ignore
        }

        res.status(200).json({
            success: true,
            data: {
                totalMembers: userCount + workerCount,
                totalComplaints,
                openComplaints,
                resolvedComplaints
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
