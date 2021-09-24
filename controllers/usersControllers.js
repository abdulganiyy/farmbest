const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

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
      {
        id: newUser._id,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
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
        firstname: user.firstname,
        lastname: user.lastname,
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
