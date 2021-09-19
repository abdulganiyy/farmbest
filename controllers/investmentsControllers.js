const Investment = require("../models/Investment");
const checkAuth = require("../utils/checkAuth");
const { cloudinary } = require("../utils/cloudinary");

exports.createInvestment = async (req, res) => {
  const decodeduser = checkAuth(req);

  const {
    name,
    description,
    maturityDate,
    harvestingDate,
    plantingDate,
    paymentClosingDate,
  } = req.body;

  try {
    let public_ids = await reqBody.images.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file, function (error, result) {
            if (error) reject(error);
            else resolve(result.public_id);
          });
        })
    );

    console.log(public_ids);

    let newInvestment = new Investment({
      name,
      images: [...public_ids],
      description,
      maturityDate,
      harvestingDate,
      plantingDate,
      paymentClosingDate,
      createdAt: new Date().toISOString(),
    });

    await newInvestment.save();

    return res.status(200).json({
      status: "success",
      investment: newInvestment,
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

exports.join = (req, res) => {
  const decodeduser = checkAuth(req);

  let investmentId = req.params.id;

  const investment = Investment.findById(investmentId);

  if (investment) {
    investment.participants.push({
      userId: decodeduser.id,
      paid: true,
    });

    await investment.save();

    res.json({
      status: "success",
      investment,
    });
  }
};
