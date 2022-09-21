const mongoose = require('mongoose');

const Cezapuan = mongoose.Schema({
    guildID: String,
    userID: String,
    puan: {type: Number, default: 100},
});

module.exports = mongoose.model('cezapuan', Cezapuan);