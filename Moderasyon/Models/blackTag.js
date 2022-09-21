const mongoose = require('mongoose');

const Blacktag = mongoose.Schema({
    guildID: String,
    taglar: { type: Array, default: []},
});

module.exports = mongoose.model('blacktag', Blacktag);