const mongoose = require('mongoose');
const { types } = require('util');

const Funny = mongoose.Schema({
    guildID: String,
    userID: String,
    kazanılan: {type: Number, default:0},
    kaybedilen: {type: Number, default:0},
    klowrapara: {type: Number, default:0},
    coin: {type: Number, default:0},
    daily: {type: Number, default:0},
    energy: {type: Number, default:100},
    taş: {type: Number, default:0},
    yıkanmıştaş: {type: Number, default:0},
    elmas: {type: Number, default:0},
    altın: {type: Number, default:0},
    demir: {type: Number, default:0},
    bakır: {type: Number, default:0},
    kömür: {type: Number, default:0},
    taşkazma: {type: Boolean, default: false},
    demirkazma: {type: Boolean, default: false},
    altınkazma: {type: Boolean, default: false},
    elmaskazma: {type: Boolean, default: false},
    taşkazmacan: {type: Number, default: 0},
    demirkazmacan: {type: Number, default: 0},
    altınkazmacan: {type: Number, default: 0},
    elmaskazmacan: {type: Number, default: 0}
});

module.exports = mongoose.model('funny', Funny);