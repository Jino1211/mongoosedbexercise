require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./model/user");
const Exercise = require("./model/exercise");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", async (req, res) => {
  const { username } = req.body;
  console.log(req);

  try {
    const existUser = await User.find({ username: username });

    if (existUser.length !== 0) {
      return res.status(400).send("User already exist");
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
  console.log(req);
  const { userId, description, duration } = req.body;
  console.log(req.body);
  const date = req.body.date === "" ? undefined : new Date(req.body.date);
  console.log(userId);
  console.log(description);

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
      date: formatDate(saveExercise.date),
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

app.get("/api/exercise/log?:userId?:from?:to?:limit", async (req, res) => {
  const id = req.query.userId;
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);
  const limit = Number(req.query.limit);

  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).send("Unknown userId");

    const { _id, username } = user;
    const log = await Exercise.find({
      userId: _id,
      date: { $gt: from, $lt: to },
    })
      .limit(limit)
      .select("-__v -_id -userId -username");

    const newLog = [];

    log.forEach(({ description, duration, date }) => {
      const updateExercise = {
        description,
        duration,
        date: formatDate(date),
      };
      newLog.push(updateExercise);
    });
    const count = log.length;

    const userLog = {
      _id,
      username,
      count,
      log: newLog,
    };
    return res.status(200).json(userLog);
  } catch (e) {
    if (e.name === "CastError") {
      return res.status(400).json({ ERROR: "Cast Error" });
    }
    return res.status(500).json({ ERROR: "Server problem" });
  }
});

function formatDate(date) {
  const year = date.getFullYear();
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  );
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    date
  );
  return `${weekday} ${month} ${day} ${year}`;
}

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
