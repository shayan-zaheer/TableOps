const Order = require('../models/order');
const Product = require('../models/product');
const AuditLog = require("../models/audit");

// const createOrder = async (req, res) => {
    // const { products, totalAmount, type } = req.body;

    // try {
    //     const order = await Order.create({
    //         products,
    //         totalAmount,
    //         type,
    //     });

    //     if (type === 'takeaway') {
    //         await AuditLog.create({ order: order._id, action: 'Completed' });
    //         return res.status(201).json({ message: 'Order created successfully', order });
    //     } else if (type === 'delivery') {
    //         return res.status(201).json({ message: 'Order created successfully, please assign a rider.', order });
    //     }
    // } catch (error) {
    //     return res.status(500).json({ message: 'Error creating order', error });
    // }
// };

// const updateOrderStatus = async (req, res) => {
//     const { orderId, status } = req.body;

//     try {
//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Update order status
//         order.status = status;
//         await order.save();

//         if (status === 'Delivered') {
//             // Log to audit if delivered
//             await AuditLog.create({ order: order._id, action: 'Completed' });
//         }

//         return res.status(200).json({ message: 'Order status updated successfully', order });
//     } catch (error) {
//         return res.status(500).json({ message: 'Error updating order status', error });
//     }
// };

// const createOrder = async (req, res) => {
//     try {
//         const { products, totalAmount, type } = req.body; // Get necessary fields from request body

//         // Create a new order instance
//         const newOrder = new Order({
//             products,
//             totalAmount,
//             type,
//             status: type === "delivery" ? "Pending" : "Completed"
//         });

//         // Save the new order to the database
//         await newOrder.save();
//         res.status(201).json(newOrder);
//     } catch (error) {
//         console.error('Error adding order:', error);
//         res.status(500).json({ message: 'Error adding order' });
//     }
// };

// // Update an existing order to assign a rider
// exports.assignRiderToOrder = async (req, res) => {
//     try {
//         const { orderId } = req.params; // Get orderId from the request parameters
//         const { riderId } = req.body; // Get riderId from the request body

//         const updatedOrder = await Order.findByIdAndUpdate(
//             orderId,
//             { rider: riderId, status: 'In Progress' }, // Update assigned rider and status
//             { new: true } // Return the updated document
//         );

//         if (!updatedOrder) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         res.json(updatedOrder);
//     } catch (error) {
//         console.error('Error assigning rider to order:', error);
//         res.status(500).json({ message: 'Error assigning rider to order' });
//     }
// };

// const createOrder = async (req, res) => {
//     try {
//         const { products, totalAmount, type } = req.body; // Get necessary fields from request body

//         // Create a new order instance
//         const newOrder = new Order({
//             products,
//             totalAmount,
//             type,
//             status: type === "delivery" ? "Pending" : "Completed"
//         });

//         // Save the new order to the database
//         await newOrder.save();
//         res.status(201).json(newOrder); // Return the new order with _id
//     } catch (error) {
//         console.error('Error adding order:', error);
//         res.status(500).json({ message: 'Error adding order' });
//     }
// };

const createOrder = async (req, res) => {
    try {
        const { products, type } = req.body;

        // Validate the products array
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required and cannot be empty' });
        }

        const productPromises = products.map(async (item) => {
            // Lookup each product by its name in the Product collection
            const foundProduct = await Product.findOne({ name: item.name });

            // If the product doesn't exist in the database, return an error
            if (!foundProduct) {
                throw new Error(`Product '${item.name}' not found`);
            }

            return {
                product: foundProduct._id, // Use the product's _id from the database
                quantity: item.quantity,    // Keep the quantity from the request
                price: foundProduct.price    // Get the price from the found product
            };
        });

        // Resolve all product lookups
        const transformedProducts = await Promise.all(productPromises);

        console.log("TRANSFORMED!", transformedProducts);

        // Calculate totalAmount based on the transformed products
        const totalAmount = transformedProducts.reduce((total, item) => {
            return total + item.price * item.quantity; // Calculate total amount
        }, 0);

        // Create a new order instance
        const newOrder = new Order({
            products: transformedProducts,
            totalAmount, // Now it reflects the calculated total
            type,
            status: type === "delivery" ? "Pending" : "Completed"
        });

        console.log("NEW ORDER:", totalAmount);

        // Save the new order to the database
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
            { new: true } // Return the updated order
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
        const { orderId } = req.params; // Get orderId from the request parameters
        const { riderId } = req.body; // Get riderId from the request body

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { rider: riderId, status: 'In Progress' }, // Update assigned rider and status
            { new: true } // Return the updated document
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

// Fetch all delivery orders that are pending
const getPendingDeliveryOrders = async (req, res) => {
    try {
        const pendingOrders = await Order.find({ status: 'In Progress', type: 'delivery' }).populate('products.product', 'name').populate("rider");
        res.status(200).json(pendingOrders);

        console.log(pendingOrders);
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
    assignRiderToOrder
};
