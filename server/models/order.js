const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

orderSchema.pre('save', function (next) {
    const order = this;

    order.totalAmount = order.products.reduce((acc, item) => {
        return acc + item.quantity * item.product.price;
    }, 0);

    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;