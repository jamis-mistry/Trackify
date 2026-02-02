const express = require('express');
const { register, login, forgotPassword, resetPassword, verifyOtp, getUsers } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/users', getUsers);

module.exports = router;
