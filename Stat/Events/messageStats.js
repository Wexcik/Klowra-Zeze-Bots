const MemberStats = require('../Models/MemberStats.js');

module.exports = async (message) => {
  if (message.author.bot || !message.guild) return;
  MemberStats.findOne({ guildID: message.guild.id, userID: message.author.id }, (err, data) => {
    let kanalID = message.channel.parentID || message.channel.id;
    if (!data) {
      let voiceMap = new Map();
      let chatMap = new Map();
      chatMap.set(kanalID, 1);
      let newMember = new MemberStats({
        guildID: message.guild.id,
        userID: message.author.id,
        voiceStats: voiceMap,
        voiceStats15: voiceMap,
        totalVoiceStats: 0,
        chatStats: chatMap,
        chatStats15: chatMap,
        totalChatStats: 1
      });
      newMember.save();
    } else {
      let onceki = data.chatStats.get(kanalID) || 0;
      let onceki15 = data.chatStats15.get(kanalID) || 0;

      data.chatStats.set(kanalID, Number(onceki) + 1);
      data.chatStats15.set(kanalID, Number(onceki15) + 1);

      data.totalChatStats++;
      data.save();
    };
  });
};

module.exports.configuration = {
  name: "message"
};