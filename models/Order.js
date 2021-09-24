const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  user: Schema.Types.ObjectId,
  paymentStatus: String,
  investments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investment",
    },
  ],
  createdAt: Date,
});

module.exports = mongoose.model("Order", orderSchema);
