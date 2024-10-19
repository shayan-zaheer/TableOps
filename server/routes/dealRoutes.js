const express = require('express');
const router = express.Router();
const {getDeals, addDeal, deleteDeal} = require("../controllers/dealController");

router.route("/with-products").get(getDeals);
router.route("/").post(addDeal);
router.route("/:id").delete(deleteDeal);

module.exports = router;