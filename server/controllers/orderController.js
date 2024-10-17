const Order = require('../models/order');
const Product = require('../models/product');
const AuditLog = require("../models/audit");
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path')


const generateInvoicePDF = async (id, category, items, categoryTotal, invoicePath) => {
    try {
        const pdfDoc = await PDFDocument.create();

        // Add a blank page to the document
        const page = pdfDoc.addPage([600, 800]);

        // Set font and layout
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const fontSize = 12;
        let y = 750;

        page.drawText(`Invoice #${id}`, {
            x: 50,
            y: y,
            size: 24,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
        });

        y -= 40;
        const currentDate = new Date().toLocaleString('en-US', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
        
        page.drawText(`Date: ${currentDate}`, { x: 50, y, size: fontSize, font: timesRomanFont });
        y -= 20;
        page.drawText(`Category: ${category}`, { x: 50, y, size: fontSize, font: timesRomanFont });

        // Add table headers
        y -= 40;
        page.drawText('Product Name', { x: 50, y, size: fontSize, font: timesRomanFont });
        page.drawText('Quantity', { x: 200, y, size: fontSize, font: timesRomanFont });
        page.drawText('Price', { x: 300, y, size: fontSize, font: timesRomanFont });
        page.drawText('Total', { x: 400, y, size: fontSize, font: timesRomanFont });

        // Add table rows for each item
        y -= 20;
        items.forEach(item => {
            page.drawText(item.name, { x: 50, y, size: fontSize, font: timesRomanFont });
            page.drawText(item.quantity.toString(), { x: 200, y, size: fontSize, font: timesRomanFont });
            page.drawText(`${item.price.toFixed(2)} PKR`, { x: 300, y, size: fontSize, font: timesRomanFont });
            page.drawText(`${(item.price * item.quantity).toFixed(2)} PKR`, { x: 400, y, size: fontSize, font: timesRomanFont });
            y -= 20;
        });

        y -= 30;
        page.drawText(`Total Amount: ${categoryTotal.toFixed(2)} PKR`, { x: 50, y, size: 16, font: timesRomanFont });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(invoicePath, pdfBytes);

        return { success: true, path: invoicePath };
    } catch (err) {
        console.error('Error generating PDF:', err);
        return { success: false, error: err.message };
    }
};

const createOrder = async (req, res) => {
    try {
        const { products, type } = req.body;

        // Validate the products array
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required and cannot be empty' });
        }

        const productPromises = products.map(async (item) => {
            // Lookup each product by its name in the Product collection and populate category
            const foundProduct = await Product.findOne({ name: item.name }).populate('category');

            // If the product doesn't exist in the database, return an error
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

        // Resolve all product lookups
        const transformedProducts = await Promise.all(productPromises);

        // Create a new order instance
        const newOrder = new Order({
            products: transformedProducts,
            totalAmount: 0, // Initialize total amount
            type,
            status: (type === "delivery" || type === "dinein") ? "Pending" : "Delivered"
        });

        console.log("NEW", newOrder);

        // Group products by category for receipt printing
        const productsByCategory = transformedProducts.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {});

        // Create an array to hold paths of generated PDFs
        const pdfPaths = [];

        // Generate PDFs for each category
        for (const category of Object.keys(productsByCategory)) {
            const categoryItems = productsByCategory[category];
            const categoryTotal = categoryItems.reduce((total, item) => total + item.price * item.quantity, 0); // Calculate category total

            const invoicePath = path.join(__dirname, `./invoice-${category}-${Date.now()}.pdf`);
            await generateInvoicePDF(newOrder._id, category, categoryItems, categoryTotal, invoicePath); // Pass category total to PDF generation
            pdfPaths.push(invoicePath);
        }

        // Save the new order to the database
        newOrder.totalAmount = transformedProducts.reduce((total, item) => total + item.price * item.quantity, 0); // Update totalAmount for the order
        await newOrder.save();

        // Send a 201 response to the frontend without downloading any PDFs
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

// const addItemsToOrder = async (req, res) => {
//     const { orderId } = req.params;
//     const { newItems } = req.body;

//     try {
//         const order = await Order.findById(orderId).populate('products.product');

//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         newItems.forEach(async (item) => {
//             const existingProduct = order.products.find(
//                 product => product.product._id.toString() === item.product);

//             if (existingProduct) {
//                 existingProduct.quantity += item.quantity;
//             } else {
//                 const newProduct = await Product.findById(item.product);

//                 if (!newProduct) {
//                     throw new Error(`Product with ID ${item.product} not found`);
//                 }

//                 order.products.push({
//                     product: newProduct._id,
//                     quantity: item.quantity,
//                 });
//             }
//         });

//         order.totalAmount = order.products.reduce((total, product) => {
//             const productPrice = product.product.price;
//             if (productPrice != null && !isNaN(productPrice)) {
//                 return total + (productPrice * product.quantity);
//             }
//             return total;
//         }, 0);

//         await order.save();

//         return res.status(200).json(order);
//     } catch (error) {
//         console.error('Error updating order:', error);
//         return res.status(500).json({ message: 'Error updating order', error: error.message });
//     }
// };

const addItemsToOrder = async (req, res) => {
    const { orderId } = req.params; // Extract orderId from URL
    const { newItems } = req.body;  // Extract newItems from request body

    try {
        // Find the order by ID and populate product details
        const order = await Order.findById(orderId).populate('products.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Iterate over new items
        for (const item of newItems) {
            // Ensure item.product is valid
            if (!item.product || !item.quantity || item.quantity <= 0) {
                return res.status(400).json({ message: 'Invalid product ID or quantity' });
            }

            const existingProduct = order.products.find(
                product => product.product._id.toString() === item.product._id // Ensure product IDs match
            );

            if (existingProduct) {
                existingProduct.quantity += item.quantity;
            } else {
                const newProduct = await Product.findById(item.product);

                if (!newProduct) {
                    return res.status(404).json({ message: `Product with ID ${item.product} not found` });
                }

                console.log("NEWPRODUCT", newProduct);

                order.products.push({
                    product: newProduct,
                    quantity: item.quantity,
                });
            }
        }

        console.log("ORDERPRODUCTS:", order.products);

        order.totalAmount = order.products.reduce((total, product) => {
            const productPrice = product.product.price;
            // const productPrice = product.price;
            const productQuantity = product.quantity;

            console.log(product);

            if (productPrice != null && !isNaN(productPrice) && productQuantity > 0) {
                return total + (productPrice * productQuantity);
            }

            // If productPrice is invalid, log a warning and skip
            console.warn(`Invalid price or quantity for product ID: ${product.product._id}`);
            return total;
        }, 0);

        // Save the updated order to the database
        await order.save();

        // Return the updated order
        return res.status(200).json(order);

    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};


const getDineInOrder = async (req, res) => {
    try {
        const dineInOrders = await Order.find({ type: 'dinein', status: 'Pending' })
    .populate('products.product', 'name price');

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

// Fetch all delivery orders that are pending
const getPendingDeliveryOrders = async (req, res) => {
    try {
        const pendingOrders = await Order.find({ status: 'In Progress', type: 'delivery' }).populate('products.product', 'name').populate("rider");
        res.status(200).json(pendingOrders);

        // console.log(pendingOrders);
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
    addItemsToOrder
};
