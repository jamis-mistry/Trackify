const express = require('express');
const router = express.Router();
const { getCategories, createCategory, deleteCategory } = require('../controllers/category.controller');
// We might need an auth middleware here if we want to restrict creation to admin
// For now, in this mock environment, we'll keep it simple.

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
