const mongoose = require('mongoose');
const { types } = require('util');

const Funny = mongoose.Schema({
    guildID: String,
    userID: String,
    kazanılan: {type: Number, default:0},
    kaybedilen: {type: Number, default:0},
    klowrapara: {type: Number, default:0},
    coin: {type: Number, default:0},
    daily: {type: Number, default:0}
});

module.exports = mongoose.model('funny', Funny);