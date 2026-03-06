const express = require('express');
const router = express.Router();
const {
    getTestimonials,
    createTestimonial,
    deleteTestimonial,
    toggleApproval
} = require('../controllers/testimonial.controller');

router.get('/', getTestimonials);
router.post('/', createTestimonial);
router.delete('/:id', deleteTestimonial);
router.patch('/:id/approve', toggleApproval);

module.exports = router;
