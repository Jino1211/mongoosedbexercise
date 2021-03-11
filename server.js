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
    const existUser = await User.find({ username: username });

    if (existUser.length !== 0) {
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

app.post("/api/exercise/add", async (req, res) => {
  const { userId, description, duration } = req.body;

  const date = req.body.date === "" ? undefined : new Date(req.body.date);

  try {
    const existUser = await User.findById(userId);
    const exercise = new Exercise({
      userId: existUser._id,
      username: existUser.username,
      description: description,
      duration: duration,
      date: date,
    });

    const saveExercise = await exercise.save();

    const newExercise = {
      username: saveExercise.username,
      description: saveExercise.description,
      duration: saveExercise.duration,
      date: saveExercise.date,
      _id: saveExercise.userId,
    };

    return res.status(200).json(newExercise);
  } catch (e) {
    if (e.name === "ValidationError") {
      return res.status(400).json({ ERROR: e.message });
    }
    return res.status(500).json({ ERROR: "Server problem" });
  }
});

app.get("/api/exercise/users", (req, res) => {
  User.find({})
    .select("-__v")
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((e) => res.status(500).json({ msg: "ERROR" }));
});

app.get("/api/exercise/log", (req, res) => {
  res.status(200).json({ msg: "hello" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
