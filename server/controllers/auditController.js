const AuditLog = require("../models/audit");
const Order = require("../models/order");

const getAuditLogs = async (req, res) => {
    try {
        const { year, month, day } = req.query;

        // Build the date filter object
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

        // Fetch audit logs based on the constructed filter
        const auditLogs = await AuditLog.find(dateFilter)
            .populate('order') // Populate the order details
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
        const { orderId, action, auditLogEntry } = req.body;

        // Handle takeaway orders
        if (action === "Takeaway Order Confirmed") {
            // Create an order for takeaway
            const newOrder = new Order({
                items: auditLogEntry.items,
                totalAmount: auditLogEntry.totalPrice,
                type: 'takeaway',
                createdAt: Date.now(), // Current date and time
            });

            await newOrder.save();

            // Create audit log entry with the orderId of the new order
            const newAuditLog = new AuditLog({
                order: newOrder._id, // Associate the new takeaway order
                action, // Action description
                createdAt: Date.now(), // Current date and time
            });

            await newAuditLog.save();

            return res.status(201).json({
                success: true,
                message: "Audit log created for takeaway order",
                data: newAuditLog,
            });
        }

        // For dine-in orders, we fetch the order using orderId
        const order = await Order.findById(orderId);
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
            message: "Audit log created for dine-in order",
            data: newAuditLog,
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
