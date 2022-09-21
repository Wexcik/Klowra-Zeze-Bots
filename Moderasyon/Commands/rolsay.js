const { Util, MessageEmbed } = require("discord.js")

module.exports.execute = async (client, message, args, ayar, emoji) => {
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
if(!ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id) && !ayar.rolsayyt.some(role => message.member.roles.cache.has(role)))  return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(x => x.name.match(new RegExp(args.join(' '), 'gi')));
    if (!args[0] || !role || role.id === message.guild.id) return message.lineReply('Rol bulunamadı, bir rol belirt!');
message.lineReply(new MessageEmbed().setAuthor(message.author.tag.replace("`",""), message.author.avatarURL({dynamic: true})).setTitle(`İstediğin Rolün Bilgileri`).setDescription(`${client.emojis.cache.find(x => x.name === 'klowrareg3')} **Rol Adı:** \`${role.name}\`\n\n${client.emojis.cache.find(x => x.name === 'klowrareg3')} **Rol Id:** \`${role.id}\`\n\n${client.emojis.cache.find(x => x.name === 'klowrareg3')} **Roldeki Kişi Sayısı:** \`${role.members.size}\`\n\n${client.emojis.cache.find(x => x.name === 'klowrareg3')} **Roldeki Kişiler:**\n\n${role.members.array().map((x) => x.toString()).join(', ')}`))
    message.lineReply(role.members.array().map((x) => x.toString()).join(', '), { code: 'xl', split: { char: ', ' } });
};
module.exports.configuration = {
    name: 'rol-say',
    aliases: ["rolsay","rol"],
    usage: 'role-say',
    description: 'Yetkili yoklaması.',
    permLevel: 0
};