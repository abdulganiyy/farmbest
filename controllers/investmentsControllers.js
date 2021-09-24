const Investment = require("../models/Investment");
const checkAuth = require("../utils/checkAuth");
const { cloudinary } = require("../utils/cloudinary");

exports.createInvestment = async (req, res) => {
  const decodeduser = checkAuth(req, res);

  if (decodeduser.role !== "admin") {
    return res.status(401).json({
      status: "fail",
      message: "You are not authorised to perform this role",
    });
  }

  const reqBody = { ...req.body };

  try {
    // res_promises will be an array of promises
    let public_ids = await reqBody.images.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file, function (error, result) {
            if (error) reject(error);
            else resolve(result.public_id);
          });
        })
    );

    public_ids = await Promise.all(public_ids);

    const newInvestment = new Investment({
      ...req.body,
      images: [...public_ids],
      createdAt: new Date().toISOString(),
    });

    newInvestment.save().then((result) => {
      return res.status(200).json({
        status: "success",
        investment: result,
      });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.join = async (req, res) => {
  try {
    const decodeduser = checkAuth(req, res);

    const investmentId = req.params.id;

    const investment = await Investment.findById(investmentId);

    if (investment) {
      investment.participants.unshift({
        userid: decodeduser.id,
        username: decodeduser.username,
        paid: false,
      });

      let savedDoc = await investment.save();

      return res.status(200).json({
        status: "success",
        investment: savedDoc,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.getAllInvestments = async (req, res) => {
  try {
    const investments = await Investment.find();

    if (investments) {
      return res.status(200).json({
        status: "success",
        investments,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Investments not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.getInvestment = async (req, res) => {
  try {
    const id = req.params.id;
    const investment = await Investment.findById(id);

    if (investment) {
      return res.status(200).json({
        status: "success",
        investment,
      });
    } else {
      return res.status(404).json({
        status: "fail",
        message: "Investment not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

exports.deleteInvestment = async (req, res) => {
  try {
    const decodeduser = checkAuth(req, res);

    if (decodeduser.role !== "admin") {
      return res.status(401).json({
        status: "fail",
        message: "You are not authorised to perform this role",
      });
    }

    const investmentId = req.params.id;
    await Investment.findByIdAndDelete(investmentId);

    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
