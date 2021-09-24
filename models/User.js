const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  avatar: String,
  password: String,
  address: String,
  occupation: String,
  registered: Date,
  role: {
    type: String,
    default: "admin",
    enum: ["investor", "farm manager", "admin"],
  },
});

userSchema.virtual("fullName").get(function () {
  return this.firstname + " " + this.lastname;
});

module.exports = mongoose.model("User", userSchema);
