const express = require("express");
const { getAllWaiters, addWaiter, deleteWaiter } = require("../controllers/waiterController");
const router = express.Router();

router.route("/").get(getAllWaiters).post(addWaiter);
router.delete("/:id", deleteWaiter)

module.exports = router;
