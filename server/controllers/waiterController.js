const Waiter = require('../models/waiter'); // Adjust the path as necessary

// Get all waiters
const getAllWaiters = async (req, res) => {
    try {
        const waiters = await Waiter.find();
        res.status(200).json(waiters);
    } catch (error) {
        console.error('Error fetching waiters:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Add a new waiter
const addWaiter = async (req, res) => {
    const { name, phone } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ message: 'Name and phone are required.' });
    }

    try {
        const newWaiter = new Waiter({ name, phone });
        await newWaiter.save();
        res.status(201).json(newWaiter);
    } catch (error) {
        console.error('Error adding waiter:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a waiter by ID
const deleteWaiter = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedWaiter = await Waiter.findByIdAndDelete(id);
        if (!deletedWaiter) {
            return res.status(404).json({ message: 'Waiter not found.' });
        }
        res.status(200).json({ message: 'Waiter deleted successfully.' });
    } catch (error) {
        console.error('Error deleting waiter:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllWaiters,
    addWaiter,
    deleteWaiter
}