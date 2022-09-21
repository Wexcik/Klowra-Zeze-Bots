const mongoose = require("mongoose");

const Stats = mongoose.Schema({
    guildID: String,
    userID: String,
    voiceStats: Map,
    voiceStats15: Map,
    totalVoiceStats: Number,
    chatStats: Map,
    chatStats15: Map,
    totalChatStats: Number
});

module.exports = mongoose.model("MemberStats", Stats);
