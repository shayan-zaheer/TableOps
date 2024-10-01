const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
} = require('../controllers/orderController');

// Routes
router.post('/', createOrder); // Create a new order
router.get('/', getOrders); // Get all orders
router.get('/:id', getOrderById); // Get order by ID
router.put('/:id', updateOrder); // Update order by ID
router.delete('/:id', deleteOrder); // Delete order by ID

module.exports = router;
