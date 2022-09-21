const LevelModel = require('../database/Level.js');
const FunnyModel = require('../database/Funny.js');
const { MessageEmbed, Collection } = require('discord.js');
const config = require('../../sunucuAyar.js');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(client, oldState, newState) {
    if (!oldState.member || oldState.member.user.bot || oldState.channelID === newState.channelID || newState.selfMute || newState.selfDeaf) return;

    const now = Date.now();
    if (!oldState.channelID && newState.channelID) {
      client.voices.set(oldState.id, {
        channel: newState.channel.parentID || newState.channelID,
        date: now
      });
      return;
    }

    if (!client.voices.has(oldState.id)) {
      client.voices.set(oldState.id, {
        channel: oldState.channel.parentID || newState.channel.parentID || newState.channelID,
        date: now
      });
    }

    const diff = now - client.voices.get(oldState.id).date;
    const xp = Math.round(diff / (60000)) * Math.floor(Math.random() * (90 - 60 + 1))
    if (oldState.channelID && !newState.channelID) {
      client.voices.delete(oldState.id);
      await addXP(client, oldState.member, xp);
    } else if (oldState.channelID && newState.channelID) {
      client.voices.set(oldState.id, {
        channel: newState.channel.parentID || newState.channelID,
        date: now
      });
      await addXP(client, oldState.member, xp);
    }
  }
};

async function addXP(client, member, xp) {

  const data = await LevelModel.findOne({ id: member.id }) || await LevelModel.create({ id: member.id });
  data.voiceCurrentXP += xp;
  if (data.voiceCurrentXP >= data.voiceRequiredXP) {
    data.voiceLevel += 1;
    data.voiceRequiredXP = 5 * (Math.pow(data.voiceLevel, 2)) + 50 * data.voiceLevel + 100;
    data.voiceCurrentXP = Math.abs(data.voiceRequiredXP - data.voiceCurrentXP);

    const newRole = config.voiceroles[data.voiceLevel];
    if (newRole) {
      const roles = Object.values(config.voiceroles).reduce((a, b) => a.concat(b), []).filter(role => member.roles.cache.has(role));
      if (roles.length) await member.roles.remove(roles);
      await member.roles.add(newRole[0]);
    }
    const klowraMoney = data.voiceLevel < 10 ? 1000 : 10000;
    if (klowraMoney > 0) {
      await FunnyModel.updateOne(
        { userID: member.id, guildID: config.sunucuID },
        { $inc: { klowrapara: klowraMoney } },
        { upsert: true }
      );

      const channel = client.channels.cache.find((channel) => channel.name === config.levellog);
      if (channel) {
        const klowrareg2 = client.emojis.cache.find(c => c.name === 'klowrareg2');
        const klowracoin = client.emojis.cache.find(c => c.name === 'klowracoin');
        channel.send(new MessageEmbed()
            .setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true, size: 2048 }))
            .setTitle(`${klowrareg2} Seste Level Atladın! ${klowrareg2}`)
            .setDescription(`${klowrareg2} **${data.voiceLevel}** leveline ulaştı! ${klowraMoney} ${klowracoin} kazandın. Tebrikler!!!`)
            .setTimestamp()
            .setFooter('Klowra was here...')
            .setColor('BLACK')
        );
      }
    }
  }

  await data.save();

}
