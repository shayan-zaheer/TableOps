const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['takeaway', 'delivery', 'dinein'],
        required: true,
    },
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rider',
    },
    waiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Waiter'
    },
    customerNumber:{
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

orderSchema.pre('save', async function (next) {
    if (!this.isNew) return next();

    const today = new Date().setHours(0, 0, 0, 0);
    try {
        const lastOrder = await mongoose.model('Order').findOne().sort({ createdAt: -1 });

        if (!lastOrder || lastOrder.createdAt.setHours(0, 0, 0, 0) < today) {
            this.orderNumber = 1;
        } else {
            this.orderNumber = (lastOrder.orderNumber || 0) + 1;
        }

        next();
    } catch (error) {
        console.error("Error in pre-save hook:", error);
        next(error);
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;