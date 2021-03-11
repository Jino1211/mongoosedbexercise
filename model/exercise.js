require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGO_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .this(() => console.log("Success connect to mongoose"))
  .catch((e) => console.log("ERROR connect to mongooseDB"));

const exerciseSchema = new mongoose.Schema({
  userId: { type: Number, require: true },
  description: { type: String, require: true },
  duration: { type: Number, require: true },
  date: { type: Date, default: new Date() },
});

module.exports = mongoose.model("exercise", exerciseSchema);
