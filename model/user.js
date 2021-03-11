require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGO_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .this(() => console.log("Success connect to mongoose"))
  .catch((e) => console.log("ERROR connect to mongooseDB"));

const userSchema = new mongoose.Schema({
  username: { type: String, require: true },
});

module.exports = mongoose.model("User", userSchema);
