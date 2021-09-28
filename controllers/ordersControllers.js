const Order = require("../models/Order");
const checkAuth = require("../utils/checkAuth");

exports.createOrder = async (req, res) => {
  const decodeduser = checkAuth(req, res);
  let newOrder = new Order({
    user: decodeduser.id,
    paymentStatus: "processing",
    items: [...req.body.items],
  });

  newOrder = await newOrder.save();

  return res.status(201).json({
    status: "success",
    order: newOrder,
  });
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = Order.find();

    return res.status(201).json({
      status: "success",
      orders,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
