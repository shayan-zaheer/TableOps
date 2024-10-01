const Order = require('../models/order');
const Product = require('../models/product');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { products } = req.body;

        let totalAmount = 0;
        const orderProducts = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product not found: ${item.product}`);
                }
                totalAmount += product.price * item.quantity;
                return { product: product._id, quantity: item.quantity };
            })
        );

        const order = new Order({ products: orderProducts, totalAmount });
        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate({
            path: 'products.product',
            model: 'Product',
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate({
            path: 'products.product',
            model: 'Product',
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { products } = req.body;

        let totalAmount = 0;
        const orderProducts = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product not found: ${item.product}`);
                }
                totalAmount += product.price * item.quantity;
                return { product: product._id, quantity: item.quantity };
            })
        );

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { products: orderProducts, totalAmount },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
