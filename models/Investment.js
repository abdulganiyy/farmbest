const { model, Schema } = require("mongoose");

const investmentSchema = new Schema({
  name: String,
  price: Number,
  description: String,
  images: [String],
  address: String,
  maturityDate: String,
  harvestingDate: String,
  plantingDate: String,
  units: Number,
  paymentClosingDate: String,
  participants: [
    {
      name: String,
      id: String,
      paid: Boolean,
    },
  ],
  reviews: [{ name: String, id: String, message: String }],
  ratings: [{ name: String, id: String, rating: Number }],
  createdAt: Date,
});

const Investment = model("Investment", investmentSchema);

module.exports = Investment;
