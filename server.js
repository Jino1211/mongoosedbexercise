const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGO_DB;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
  console.log("Success connect to mongoose")
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
