const AuditLog = require("../models/audit");
const Order = require("../models/order");
const Product = require("../models/product");

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
                populate: { 
                    path: 'products.product', // Populate the products within the order
                    model: 'Product' // Ensure this matches your Product model name
                }
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
