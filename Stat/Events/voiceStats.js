const MemberStats = require('../Models/MemberStats.js');

const sesli = new Map();
const client = global.client;
const sunucuAyar = global.sunucuAyar;

client.on("ready", async () => {
  var afkKanali = sunucuAyar.afkChannelID;
  let guild = client.guilds.cache.get(sunucuAyar.sunucuID);
  guild.channels.cache.filter(e => e.type == "voice" && e.members.size > 0).forEach(channel => {
    channel.members.filter(member => !member.user.bot && !member.voice.selfDeaf).forEach(member => {
      sesli.set(member.id, {
        channel: channel.id === afkKanali ? channel.id : (channel.parentID || channel.id),
        duration: Date.now()
      });
    });
  });

  setInterval(() => {
    sesli.forEach((value, key) => {
      let uye = guild.members.cache.get(key);
      if (!uye || !uye.voice.channelID) return;
      voiceInit(key, value.channel, getDuraction(value.duration));
      if (sesli.has(key)) {
        sesli.set(key, {
          channel: value.channel,
          duration: Date.now()
        });
      }
    });
  }, 5000);
});

module.exports = async (oldState, newState) => {
  var afkKanali = sunucuAyar.afkChannelID;
  if (oldState.guild.id !== sunucuAyar.sunucuID) return;
  if (oldState.member && (oldState.member.user.bot || newState.selfDeaf)) return;
  if (!oldState.channelID && newState.channelID) {
    await MemberStats.updateOne({ userID: newState.member.user.id }, { lastChannel: newState.channelID, lastTime: Date.now() }, { upsert: true })
    sesli.set(oldState.id, {
      channel: newState.channelID === afkKanali ? afkKanali : (newState.channel.parentID || newState.channelID),
      duration: Date.now()
    });
  };
  if (!sesli.has(oldState.id))
    sesli.set(oldState.id, {
      channel: newState.channelID === afkKanali ? afkKanali : (newState.channel.parentID || newState.channelID),
      duration: Date.now()
    });

  let data = sesli.get(oldState.id);
  let duration = getDuraction(data.duration);
  if (oldState.channelID && !newState.channelID) {
    voiceInit(oldState.id, data.channel, duration);
    sesli.delete(oldState.id);
  } else if (oldState.channelID && newState.channelID) {
    await MemberStats.updateOne({ userID: newState.member.user.id }, { lastChannel: newState.channelID, lastTime: Date.now() }, { upsert: true })
    voiceInit(oldState.id, data.channel, duration);
    sesli.set(oldState.id, {
      channel: newState.channelID === afkKanali ? afkKanali : (newState.channel.parentID || newState.channelID),
      duration: Date.now()
    });
  }
};

module.exports.configuration = {
  name: "voiceStateUpdate"
};

function getDuraction(ms) {
  return Date.now() - ms;
};

function voiceInit(memberID, categoryID, duraction) {
  MemberStats.findOne({ guildID: sunucuAyar.sunucuID, userID: memberID }, (err, data) => {
    if (!data) {
      let voiceMap = new Map();
      let chatMap = new Map();
      voiceMap.set(categoryID, duraction);
      let newMember = new MemberStats({
        guildID: sunucuAyar.sunucuID,
        userID: memberID,
        voiceStats: voiceMap,
        voiceStats15: voiceMap,
        totalVoiceStats: duraction,
        chatStats: chatMap,
        chatStats15: chatMap,
        totalChatStats: 0
      });
      newMember.save();
    } else {
      let onceki = data.voiceStats.get(categoryID) || 0;
      let onceki15 = data.voiceStats15.get(categoryID) || 0;
      data.voiceStats.set(categoryID, Number(onceki) + duraction);
      data.voiceStats15.set(categoryID, Number(onceki15) + duraction);
      data.totalVoiceStats = Number(data.totalVoiceStats) + duraction;
      data.save();
    };
  });
};