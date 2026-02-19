const express = require('express');
const {
    getComplaints,
    getComplaint,
    createComplaint,
    updateComplaint
} = require('../controllers/complaint.controller');

const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

router.route('/')
    .get(getComplaints)
    .post(upload.array('attachments', 5), createComplaint);

router.route('/:id')
    .get(getComplaint)
    .put(updateComplaint);

module.exports = router;
