const mongoose = require("mongoose");

const shop = mongoose.Schema({
  _id: String,
  envanter: Array
});

module.exports = mongoose.model("shop", shop);