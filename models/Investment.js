const { model, Schema } = require("mongoose");

const investmentSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  images: [String],
  maturityDate: String,
  harvestingDate: String,
  plantingDate: String,
  paymentClosingDate: String,
  participants: [{ userId: String, paid: Boolean }],
  createdAt: Date,
});

const Investment = model("User", investmentSchema);

module.exports = Investment;
