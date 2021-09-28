require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/User");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/users", require("./routes/usersRoutes"));
app.use("/investments", require("./routes/investmentsRoutes"));
app.use("/orders", require("./routes/ordersRoutes"));

const mongoURI = process.env.MONGOURI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err, "failed to connect");
  });

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
