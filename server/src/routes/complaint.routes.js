const express = require('express');
const {
    getComplaints,
    getComplaint,
    createComplaint,
    updateComplaint
} = require('../controllers/complaint.controller');

const router = express.Router();

router.route('/')
    .get(getComplaints)
    .post(createComplaint);

router.route('/:id')
    .get(getComplaint)
    .put(updateComplaint);

module.exports = router;
