const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists,try new username and password",
      });
    }

    const hash = await bcrypt.hash(password, 8);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "1hr" }
    );

    return res.status(201).json({
      status: "success",
      token: token,
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct fields details",
      });
    }

    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct username/email",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1hr" }
    );

    return res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// get all users

exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  if (users) {
    res.status(200).json({
      status: "success",
      users,
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "users not found",
    });
  }
};
