const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    assignRiderToOrder,
    getPendingDeliveryOrders,
    updateOrderStatus,
    getDineInOrder
} = require('../controllers/orderController');

// Routes
router.get('/pending-dinein', getDineInOrder)
router.get('/pendingdelivery', getPendingDeliveryOrders);
router.post('/', createOrder); // Create a new order
router.get('/', getOrders); // Get all orders
router.get('/:id', getOrderById);
router.put("/:orderId/assign-rider", assignRiderToOrder)
router.put('/:id/update-status', updateOrderStatus);
router.delete('/:id', deleteOrder); // Delete order by ID

module.exports = router;
