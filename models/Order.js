const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
  user: Schema.Types.ObjectId,
  paymentStatus: String,
  items: [
    {
      investmentName: String,
      unitsBought: Number,
    },
  ],
  createdAt: Date,
});

module.exports = mongoose.model("Order", orderSchema);
