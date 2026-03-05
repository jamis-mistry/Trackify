const User = require('../models/User.model');
const Organization = require('../models/Organization.model');
const Worker = require('../models/Worker.model');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, orgName, workerCategories } = req.body;

        let user;
        if (role === 'organization') {
            user = await Organization.create({
                name, email, password, role, organizationName: orgName
            });
        } else if (role === 'worker') {
            user = await Worker.create({
                name, email, password, role, workerCategories, organizationName: orgName
            });
        } else {
            user = await User.create({
                name, email, password, role, organizationName: orgName
            });
        }

        sendAuthResponse(user, 200, res);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for user in all collections
        let user = await User.findOne({ email }).select('+password');
        if (!user) user = await Organization.findOne({ email }).select('+password');
        if (!user) user = await Worker.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendAuthResponse(user, 200, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) user = await Organization.findOne({ email: req.body.email });
        if (!user) user = await Worker.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ success: false, error: 'There is no user with that email' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("### TESTING OTP:", otp); // For testing purposes

        // Set token and expire (10 minutes)
        user.resetPasswordToken = otp; // In production, consider hashing this
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        // Create message
        const message = `Your password reset OTP is: ${otp}\n\nIt expires in 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Trackify Password Reset OTP',
                message
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, error: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Verify OTP (Optional check step)
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const query = {
            email,
            resetPasswordToken: otp,
            resetPasswordExpire: { $gt: Date.now() }
        };

        let user = await User.findOne(query);
        if (!user) user = await Organization.findOne(query);
        if (!user) user = await Worker.findOne(query);

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        res.status(200).json({ success: true, data: 'OTP verified' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp, password } = req.body;

        const query = {
            email,
            resetPasswordToken: otp,
            resetPasswordExpire: { $gt: Date.now() }
        };

        let user = await User.findOne(query);
        if (!user) user = await Organization.findOne(query);
        if (!user) user = await Worker.findOne(query);

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid OTP or expired' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendAuthResponse(user, 200, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all users (Admin/Org)
// @route   GET /api/auth/users
// @access  Private (Admin/Org)
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        const orgs = await Organization.find({});
        const workers = await Worker.find({});

        const allUsers = [...users, ...orgs, ...workers].map(u => {
            const userObj = u.toObject ? u.toObject() : u;
            const { password, ...rest } = userObj;
            return rest;
        });

        res.status(200).json({ success: true, data: allUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Helper to send auth response without token
const sendAuthResponse = (user, statusCode, res) => {
    res.status(statusCode).json({
        success: true,
        data: {
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
            organizationName: user.organizationName || null,
            workerCategories: user.workerCategories || []
        }
    });
};

// @desc    Delete any user/org/worker by ID (Admin)
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        let deleted = await User.findByIdAndDelete(id);
        if (!deleted) deleted = await Organization.findByIdAndDelete(id);
        if (!deleted) deleted = await Worker.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const updates = req.body;
        const email = updates.email; // Should probably use ID from auth middleware in real app

        let user = await User.findOneAndUpdate({ email }, updates, { new: true });
        if (!user) user = await Organization.findOneAndUpdate({ email }, updates, { new: true });
        if (!user) user = await Worker.findOneAndUpdate({ email }, updates, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        sendAuthResponse(user, 200, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update user role (Admin)
// @route   PUT /api/auth/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        let user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) user = await Organization.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) user = await Worker.findByIdAndUpdate(id, { role }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
