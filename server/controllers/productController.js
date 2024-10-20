const Product = require("../models/product");
const Category = require("../models/category");

const createProduct = async (req, res) => {
    try {
        const { name, category, price } = req.body;
        const image = req.file ? `/images/${req.file.filename}` : '';

        const product = new Product({ name, category, price, image });
        await product.save();

        await Category.findByIdAndUpdate(category, { $push: { products: product._id } });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category'); // Populate category details
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, category, price } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, price  },
            { new: true } // Return the updated product
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await Category.findByIdAndUpdate(
            product.category,
            { $pull: { products: id } }
        );

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
