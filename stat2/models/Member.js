const mongoose = require('mongoose');

const Member = mongoose.Schema({
    guildID: String,
    userID: String,
    staffID: { type: String, default: null },
    afk: Object,
    history: Array,
    yetkili: Map,
});

module.exports = mongoose.model('Members', Member);