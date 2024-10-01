const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController.js');

// Routes
router.post('/', createProduct); // Create a new product
router.get('/', getProducts); // Get all products
router.get('/:id', getProductById); // Get product by ID
router.put('/:id', updateProduct); // Update product by ID
router.delete('/:id', deleteProduct); // Delete product by ID

module.exports = router;
