const express = require("express");
const router = express.Router();

const {
  createInvestment,
  getAllInvestments,
  deleteInvestment,
  getInvestment,
  join,
} = require("../controllers/investmentsControllers");

router.post("/", createInvestment);

router.patch("/:id/join", join);

router.get("/", getAllInvestments);

router.delete("/:id", deleteInvestment);

router.get("/:id", getInvestment);

module.exports = router;
