const mongoose = require("mongoose");

const verilecekroller = mongoose.Schema({
    Id: String,
    Name: String,
    Roller: Array,
}, {timestamps: true});

module.exports = mongoose.model("givebackroles", verilecekroller);