require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGO_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Success connect to mongoose"))
  .catch((e) => console.log("ERROR connect to mongooseDB"));

const exerciseSchema = new mongoose.Schema({
  userId: { type: String, require: true },
  username: { type: String },
  description: { type: String, require: true },
  duration: { type: Number, require: true },
  date: { type: Date, default: new Date().toDateString() },
});

exerciseSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("exercise", exerciseSchema);
