const express = require("express");
const {
  createOrder,
  getAllOrders,
} = require("../controllers/ordersControllers");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);

module.exports = router;
