const Rider = require('../models/rider.js');

const addRider = async (req, res) => {
    const { name, phone } = req.body;
    try {
        const rider = new Rider({ name, phone });
        await rider.save();
        res.status(201).send(rider);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getAllRiders = async (req, res) => {
    try {
        const riders = await Rider.find();
        res.status(200).send(riders);
    } catch (error) {
        res.status(500).send(error);
    }
};

const deleteRider = async (req, res) => {
    const { id } = req.params;
    try {
        const rider = await Rider.findByIdAndDelete(id);
        if (!rider) {
            return res.status(404).send();
        }
        res.status(200).send(rider);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

module.exports = {addRider, getAllRiders, deleteRider}
