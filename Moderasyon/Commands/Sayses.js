const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar, emoji) => {
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.enAltYetkiliRolu).rawPosition <= rol.rawPosition)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const embed = new MessageEmbed().setColor(client.randomColor()).setImage().setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }));
    message.lineReply([
        `**\n                     Online Üye : ${client.emojiSayi(`${message.guild.members.cache.filter(u => u.presence.status != 'offline').size}`)}**\n`,
        `**Taglı Üye Sayısı : ${client.emojiSayi(`${message.guild.members.cache.filter(m => m.user.username && m.user.username.includes(ayar.tag)).size || 'Ayarlanmamış'}`)}** ** Sesteki Üye Sayısı : ${client.emojiSayi(`${message.guild.channels.cache.filter(channel => channel.type == 'voice').map(channel => channel.members.size).reduce((a, b) => a + b)}`)}**`,
    ]).then(x => x.delete({ timeout: 50000 }));
};

module.exports.configuration = {
    name: 'ses',
    aliases: [],
    usage: 'sesli',
    description: 'Seste Bulunan Üyeler.',
    permLevel: 0
};