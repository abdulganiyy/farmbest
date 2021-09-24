require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/users", require("./routes/usersRoutes"));
app.use("/investments", require("./routes/investmentsRoutes"));

//

const mongoURI = process.env.MONGOURI;
// "mongodb+srv://tajudeenazeez:azeez2021@cluster0.tshny.mongodb.net/farm-best?retryWrites=true&w=majority";
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
