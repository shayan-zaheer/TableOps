const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoriesWithProducts
} = require('../controllers/categoryController');

router.post('/', createCategory);
router.get('/', getCategories);
router.get('/with-products', getCategoriesWithProducts);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
