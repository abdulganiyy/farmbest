const express = require("express");
const {
  createInvestment,
  join,
} = require("../controllers/investmentsControllers");

const router = express.Router();

router.post("/", createInvestment);

router.patch("/join", join);

module.exports = router;
