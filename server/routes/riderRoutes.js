const express = require("express");
const { addRider, getAllRiders, deleteRider } = require("../controllers/riderController");
const router = express.Router();

router.post("/", addRider);
router.get("/", getAllRiders)
router.delete("/:id", deleteRider)

module.exports = router;
