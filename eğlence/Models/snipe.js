const mongoose = require("mongoose");

const snipe = mongoose.Schema({
  _id: String,
  userID: String,
  content: String,
  createdTimestamp: Number,
  deletedTimestamp: Number
});

module.exports = mongoose.model("snipes", snipe);