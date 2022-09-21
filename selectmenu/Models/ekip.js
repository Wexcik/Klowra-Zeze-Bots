const mongoose = require("mongoose");

const Ekip = mongoose.Schema({
  guildID: String,
  ekipRol: String
});

module.exports = mongoose.model("Crew", Ekip);