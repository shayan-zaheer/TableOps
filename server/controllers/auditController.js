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
                delete dateFilter.$expr;
            }
        }

        const auditLogs = await AuditLog.find(dateFilter)
            .populate({
                path: 'order',
                populate: [
                    {
                        path: 'products.product',
                        model: 'Product',
                        populate: {
                            path: 'category',
                            model: 'Category'
                        }
                    },
                    {
                        path: 'rider',
                        model: 'Rider'
                    },
                    {
                        path: 'waiter',
                        model: 'Waiter'
                    }
                ]
            })
            .sort({ createdAt: -1 });

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
            action,
            createdAt: Date.now(),
        });

        await newAuditLog.save();

        res.status(201).json({
            success: true,
            message: "Audit log created for order",
            data: {
                auditLog: newAuditLog,
                order
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
