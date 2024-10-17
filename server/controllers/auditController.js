const AuditLog = require("../models/audit");
const Order = require("../models/order");
const Rider = require("../models/rider");
const Product = require("../models/product");
const Waiter = require("../models/waiter");

const getAuditLogs = async (req, res) => {
    try {
        const { year, month, day } = req.query;

        let dateFilter = {};

        if (year || month || day) {
            dateFilter.$expr = {
                $and: []
            };

            if (year) {
                dateFilter.$expr.$and.push({ $eq: [{ $year: "$createdAt" }, parseInt(year)] });
            }

            if (month) {
                dateFilter.$expr.$and.push({ $eq: [{ $month: "$createdAt" }, parseInt(month)] });
            }

            if (day) {
                dateFilter.$expr.$and.push({ $eq: [{ $dayOfMonth: "$createdAt" }, parseInt(day)] });
            }

            if (dateFilter.$expr.$and.length === 0) {
                delete dateFilter.$expr; // Remove unnecessary $expr if no date filter is added
            }
        }

        const auditLogs = await AuditLog.find(dateFilter)
            .populate({
                path: 'order', // Populate the order details
                populate: [
                    {
                        path: 'products.product', // Populate the products within the order
                        model: 'Product', // Ensure this matches your Product model name
                        populate: {
                            path: 'category', // Populate the category within the product
                            model: 'Category' // Ensure this matches your Category model name
                        }
                    },
                    {
                        path: 'rider', // Populate the rider for delivery orders
                        model: 'Rider' // Ensure this matches your Rider model name
                    },
                    {
                        path: 'waiter', // Populate the waiter
                        model: 'Waiter' // Ensure this matches your Waiter model name
                    }
                ]
            })
            .sort({ createdAt: -1 }); // Sorting by most recent

        res.status(200).json({
            success: true,
            count: auditLogs.length,
            data: auditLogs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


const addAuditLog = async (req, res) => {
    try {
        const { orderId, action } = req.body;
        const order = await Order.findById(orderId).populate({
            path: "products.product",
            model: "Product"
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const newAuditLog = new AuditLog({
            order: orderId,
            action, // Action description
            createdAt: Date.now(), // Current date and time
        });

        await newAuditLog.save();

        res.status(201).json({
            success: true,
            message: "Audit log created for order",
            data: {
                auditLog: newAuditLog,
                order // Return the populated order with product details
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    getAuditLogs,
    addAuditLog,
};
