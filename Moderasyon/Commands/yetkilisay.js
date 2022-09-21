const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  if (!client.kullanabilir(message.author.id) && !ayar.yetkilialım.some(role => message.member.roles.cache.has(role)) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  if (message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  let altyt = message.guild.roles.cache.get(ayar.enAltStaffRolu)
  let üstyt = message.guild.roles.cache.get(ayar.enUstStaffRolu)
  let filter = message.guild.roles.cache.filter(member => altyt.position <= member.position && üstyt.position >= member.position);
  let roles = filter.map(c => c.id)
  let members = message.guild.members.cache.filter(member => member.roles.cache.some(role => roles.includes(role.id)))
  let sesteOlmayanlar = members.filter(member => !member.user.bot && member.presence.status != "offline" && !member.voice.channelID);

  message.lineReply(`
     ${client.emojis.cache.find(c => c.name === 'klowrareg2')} **..Genel Bilgileri**\n
     ${client.emojis.cache.find(c => c.name === 'klowrareg3')} \`Toplam Yetkili Rolleri\` : **${filter.size}** rol\n
     ${client.emojis.cache.find(c => c.name === 'klowrareg3')} \`Yetkili Görevlileri\` : **${members.size}** kişi\n
     ${client.emojis.cache.find(c => c.name === 'klowrareg3')} \`Seste Olmayanlar\` : ${sesteOlmayanlar.map(member => member).size = 0 ? '\`Yetkililerde seste olmayan görevli yok!\`' : sesteOlmayanlar.map(member => member).join(', ')}\n
     ${client.emojis.cache.find(c => c.name === 'klowrareg2')} **..Yetkili Rolleri**\n
     ${filter.sort((a, b) => b.position - a.position).map(c => `${client.emojis.cache.find(c => c.name === 'klowrareg3')} \`${c.name}\`
      \`=>\` \`Görevlileri\` : **${message.guild.roles.cache.get(c.id).members.size}** kişi
      \`=>\` \`Seste Olmayanlar\` : ${message.guild.roles.cache.get(c.id).members.filter(member => !member.user.bot && member.presence.status != 'offline' && !member.voice.channelID).size != 0 ? message.guild.roles.cache.get(c.id).members.filter(member => !member.user.bot && member.presence.status != 'offline' && !member.voice.channelID).map(member => member).join(', ') : '\`Bu rolde seste olmayan üye yok!\`'}
      \`=>\` \`Aktif Olmayanlar\` : ${message.guild.roles.cache.get(c.id).members.filter(member => !member.user.bot && member.presence.status == 'offline').size != 0 ? message.guild.roles.cache.get(c.id).members.filter(member => !member.user.bot && member.presence.status == 'offline').map(member => member).join(', ') : '\`Bu rolde aktif olmayan üye yok!\`'}`).join('\n─────────────────────\n')}
     `,{ split: true })
};
module.exports.configuration = {
  name: "yetkilisay",
  aliases: ['staffsay'],
  usage: "yetkili-say",
  description: "Yetkili yoklaması.",
  permLevel: 2
};