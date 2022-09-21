const mongoose = require('mongoose');

const Cezapuan = mongoose.Schema({
    guildID: String,
    userID: String,
    targetID: String,
    time: Date,
    eklenen: {type: Number, default: 0},
    silinen: {type: Number, default: 0}
});

module.exports = mongoose.model('cezayetkili', Cezapuan);