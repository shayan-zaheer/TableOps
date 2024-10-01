const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');

// Routes
router.post('/', createCategory); // Create a new category
router.get('/', getCategories); // Get all categories
router.get('/:id', getCategoryById); // Get category by ID
router.put('/:id', updateCategory); // Update category by ID
router.delete('/:id', deleteCategory); // Delete category by ID

module.exports = router;
