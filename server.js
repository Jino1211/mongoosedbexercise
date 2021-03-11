const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./model/user");
const Exercise = require("./model/exercise");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", async (req, res) => {
  const { username } = req.body;

  try {
    const findUser = await User.find({ username: username });

    if (findUser.length !== 0) {
      return res.status(400).status("User already exist");
    }

    const newUser = new User({
      username: username,
    });

    newUser.save().then((doc) => {
      return res.status(200).json(doc);
    });
  } catch {
    return res.status(500).json({ ERROR: "Server problem" });
  }
});

app.post("/api/exercise/add", (req, res) => {
  const { userId, description, duration, date } = req.body;

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
