const { MessageEmbed } = require('discord.js');
const LevelModel = require('../database/Level.js');
const FunnyModel = require('../database/Funny.js');
const config = require('../../sunucuAyar.js');

module.exports = {
  name: 'guildMemberAdd',
  async execute(client, member) {
    if (member.user.bot) return;

    const isFake = (Date.now() - member.user.createdTimestamp) < 7 * 24 * 60 * 60 * 1000;
    const beforeInvites = (client.invites.get(member.guild.id) || new Collection()).clone();
    const afterInvites = await member.guild.fetchInvites();
    client.invites.set(member.guild.id, afterInvites);

    const invite = afterInvites.find((inv) => beforeInvites.has(inv.code) && beforeInvites.get(inv.code).uses < inv.uses) || beforeInvites.find((inv) => afterInvites.has(inv.code));
    if (invite && invite.inviter && invite.inviter.id !== member.id && !isFake) {
      const data = await LevelModel.findOne({ id: invite.inviter.id }) || await LevelModel.create({ id: invite.inviter.id });

      data.inviteCurrentXP += Number(Math.floor(Math.random() * (150 - 50 + 1)) + 25);
      if (data.inviteCurrentXP >= data.inviteRequiredXP) {
        data.inviteLevel += 1;
        data.inviteRequiredXP = 5 * (Math.pow(data.inviteLevel, 2)) + 50 * data.inviteLevel + 100;
        data.inviteCurrentXP = +Number(data.inviteRequiredXP - data.inviteCurrentXP);

        const newRole = config.inviteroles[data.inviteLevel];
        if (newRole) {
          const inviteMember = member.guild.members.cache.get(invite.inviter.id);
          if (!inviteMember) return;

          const roles = Object.values(config.inviteroles).reduce((a, b) => a.concat(b), []).filter(role => inviteMember.roles.cache.has(role));
          if (roles.length) await inviteMember.roles.remove(roles);
          await inviteMember.roles.add(newRole);
        }
        const klowraMoney = data.inviteLevel < 10 ? 1000 : 10000;
        if (klowraMoney > 0) {
          await FunnyModel.updateOne(
            { userID: invite.inviter.id, guildID: member.guild.id },
            { $inc: { klowrapara: klowraMoney } },
            { upsert: true }
          );
  
          const channel = client.channels.cache.find((channel) => channel.name === config.levellog);
          if (channel) {
            const klowrareg2 = client.emojis.cache.find(c => c.name === 'klowrareg2');
            const klowracoin = client.emojis.cache.find(c => c.name === 'klowracoin');
            const inviter = await client.users.fetch(invite.inviter.id);
            channel.send(new MessageEmbed()
                .setAuthor(inviter.tag, inviter.avatarURL({ dynamic: true, size: 2048 }))
                .setTitle(`${klowrareg2} Davette Level Atladın! ${klowrareg2}`)
                .setDescription(`${klowrareg2} **${data.inviteLevel}** leveline ulaştı! ${klowraMoney} ${klowracoin} kazandın. Tebrikler!!!`)
                .setTimestamp()
                .setFooter('Klowra was here...')
                .setColor('BLACK')
            );
          }
        }
      }


      data.save();
    }
  }
};
