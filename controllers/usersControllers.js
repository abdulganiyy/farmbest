const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const checkAuth = require("../utils/checkAuth");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username, email }],
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
      {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide correct fields details",
      });
    }

    const user = await User.findOne({
      email,
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
        username: user.username,
        role: user.role,
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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users) {
      return res.status(200).json({
        status: "success",
        users,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Users not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      return res.status(200).json({
        status: "success",
        user,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const decodeduser = checkAuth(req, res);

    if (decodeduser.role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "You are not authorised to perform this role",
      });
    }

    const hash = await bcrypt.hash(req.body.password, 8);

    const newUser = await User.create({
      ...req.body,
      password: hash,
    });

    return res.status(200).json({
      status: "success",
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const decodeduser = checkAuth(req, res);

    if (decodeduser.role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "You are not authorised to perform this role",
      });
    }
    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    checkAuth(req, res);
    const user = await User.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });

    return res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
