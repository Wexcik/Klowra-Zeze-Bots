const mongoose = require("mongoose");

const market = mongoose.Schema({
  _id: String,
  envanter: Array
});

module.exports = mongoose.model("market", market);