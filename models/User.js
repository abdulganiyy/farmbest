const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
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

const User = model("User", userSchema);

module.exports = User;
