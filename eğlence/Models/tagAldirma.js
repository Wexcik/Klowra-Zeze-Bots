const mongoose = require("mongoose");

const tagAldirma = mongoose.Schema({
  sunucuID: String,
  tagAlanUye: String,
  tagAldiranUye: String,
  tarih: Number
});

module.exports = mongoose.model("tagAldirma", tagAldirma);