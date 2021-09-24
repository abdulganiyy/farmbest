const express = require("express");
const {
  login,
  register,
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require("../controllers/usersControllers");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/", getAllUsers);

router.post("/", createUser);

router.get("/:id", getUser);

router.delete("/:id", deleteUser);

router.patch("/:id", updateUser);

module.exports = router;
