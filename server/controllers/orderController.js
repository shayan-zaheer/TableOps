const Order = require('../models/order');
const Product = require('../models/product');
const AuditLog = require("../models/audit");

const createOrder = async (req, res) => {
    try {
        const { products, type } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required and cannot be empty' });
        }

        const productPromises = products.map(async (item) => {
            const foundProduct = await Product.findOne({ name: item.name }).populate('category');

            if (!foundProduct) {
                throw new Error(`Product '${item.name}' not found`);
            }

            return {
                product: foundProduct._id,  // Use the product's _id from the database
                name: foundProduct.name,    // Product name for printing purposes
                category: foundProduct.category.title, // Get the category title
                quantity: item.quantity,    // Keep the quantity from the request
                price: foundProduct.price    // Get the price from the found product
            };
        });

        const transformedProducts = await Promise.all(productPromises);

        const newOrder = new Order({
            products: transformedProducts,
            totalAmount: 0,
            type,
            status: (type === "delivery" || type === "dinein") ? "Pending" : "Delivered"
        });

        newOrder.totalAmount = transformedProducts.reduce((total, item) => total + item.price * item.quantity, 0);  

        await newOrder.save();

        res.status(201).json(newOrder);
        
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: error.message || 'Error adding order' });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: error.message || 'Error updating order status' });
    }
};

const assignRiderToOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { riderId } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { rider: riderId, status: 'In Progress' }, 
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error assigning rider to order:', error);
        res.status(500).json({ message: 'Error assigning rider to order' });
    }
};

const assignWaiterToOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { waiterId } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { waiter: waiterId, status: 'Pending' },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error assigning rider to order:', error);
        res.status(500).json({ message: 'Error assigning waiter to order' });
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

const addItemsToOrder = async (req, res) => {
    const { orderId } = req.params;
    const { newItems } = req.body;

    try {
        const order = await Order.findById(orderId).populate('products.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        for (const item of newItems) {
            if (!item.product || !item.quantity || item.quantity <= 0) {
                return res.status(400).json({ message: 'Invalid product ID or quantity' });
            }

            const existingProduct = order.products.find(
                product => product.product._id.toString() === item.product._id
            );

            if (existingProduct) {
                existingProduct.quantity += item.quantity;
            } else {
                const newProduct = await Product.findById(item.product);

                if (!newProduct) {
                    return res.status(404).json({ message: `Product with ID ${item.product} not found` });
                }

                order.products.push({
                    product: newProduct,
                    quantity: item.quantity,
                });
            }
        }

        order.totalAmount = order.products.reduce((total, product) => {
            const productPrice = product.product.price;
            const productQuantity = product.quantity;

            if (productPrice != null && !isNaN(productPrice) && productQuantity > 0) {
                return total + (productPrice * productQuantity);
            }

            console.warn(`Invalid price or quantity for product ID: ${product.product._id}`);
            return total;
        }, 0);

        await order.save();
        return res.status(200).json(order);

    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

const getDineInOrder = async (req, res) => {
    try {
        const dineInOrders = await Order.find({ type: 'dinein', status: 'Pending' })
    .populate('products.product', 'name price').populate("waiter");

        return res.status(200).json(dineInOrders);
    } catch (error) {
        console.error('Error fetching dine-in orders:', error);
        return res.status(500).json({ message: 'Error fetching dine-in orders' });
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

const getPendingDeliveryOrders = async (req, res) => {
    try {
        const pendingOrders = await Order.find({ status: 'In Progress', type: 'delivery' }).populate('products.product', 'name').populate("rider");
        res.status(200).json(pendingOrders);

    } catch (error) {
        console.error('Error fetching pending delivery orders:', error);
        res.status(500).json({ message: 'Error fetching pending delivery orders' });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getPendingDeliveryOrders,
    deleteOrder,
    assignRiderToOrder,
    getDineInOrder,
    addItemsToOrder,
    assignWaiterToOrder
};
