const mongoose = require("mongoose");

const haftalik = mongoose.Schema({
  _id: String,
  regular: Array,
  leaves: Array
});

module.exports = mongoose.model("haftalikdavet", haftalik);