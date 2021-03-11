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

app.post("/api/exercise/new-user", (req, res) => {
  res.status(200).json({ msg: "hello" });
});

app.post("/api/exercise/add", (req, res) => {
  res.status(200).json({ msg: "hello" });
});

app.get("/api/exercise/users", (req, res) => {
  res.status(200).json({ msg: "hello" });
});

app.get("/api/exercise/log", (req, res) => {
  res.status(200).json({ msg: "hello" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
