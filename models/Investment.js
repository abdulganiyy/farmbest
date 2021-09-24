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
      username: String,
      userid: String,
      paid: Boolean,
    },
  ],
  reviews: [{ username: String, userid: String, message: String }],
  ratings: [{ username: String, userid: String, rating: Number }],
  createdAt: Date,
});

const Investment = model("Investment", investmentSchema);

module.exports = Investment;
