const Deal = require("../models/deal");

const getDeals = async (req, res) => {
    try {
        const deals = await Deal.find().populate({
            path: 'products.productId',
            model: 'Product'
        });

        console.log(deals);

        res.status(200).json(deals);
    } catch (error) {
        console.error("Error fetching deals:", error);
        res.status(500).json({ error: "Failed to fetch deals." });
    }
};

const addDeal = async (req, res) => {
    const { name, price, products } = req.body;

    try {
        const newDeal = new Deal({ name, price, products });
        await newDeal.save();
        res.status(201).json(newDeal);
    } catch (error) {
        console.error("Error creating deal:", error);
        res.status(500).json({ error: "Failed to create deal." });
    }
};

const deleteDeal = async (req, res) => {
    try {
        const deletedDeal = await Deal.findByIdAndDelete(req.params.id);
        if (deletedDeal) {
            res.json({ message: "Deal deleted successfully." });
        } else {
            res.status(404).json({ error: "Deal not found." });
        }
    } catch (error) {
        console.error("Error deleting deal:", error);
        res.status(500).json({ error: "Failed to delete deal." });
    }
};

module.exports = {
    getDeals, addDeal, deleteDeal
};