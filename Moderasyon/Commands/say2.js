const { MessageEmbed } = require('discord.js');

module.exports.execute = async(client, message, args, ayar, emoji) => {
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.enAltYetkiliRolu).rawPosition <= rol.rawPosition)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const emojii = client.emojis.cache.find(c => c.name === 'klowrareg2');
    const embed = new MessageEmbed().setColor('BLACK').setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }));
    message.lineReply(embed.setDescription([
        `${emojii} \`Toplam Üye:\` **${client.emojiSayi(`${message.guild.memberCount}`)}**  `,
        `${emojii} \`Çevrimiçi Üye:\` **${client.emojiSayi(`${message.guild.members.cache.filter(u => u.presence.status != 'offline').size}`)}** `,
        `${emojii} \`Taglı Üye:\` **${client.emojiSayi(`${message.guild.members.cache.filter(m => m.user.username && m.user.username.includes(ayar.tag)).size || 'Ayarlanmamış'}`)}** `,
        `${emojii} \`Boost:\` **${client.emojiSayi(`${message.guild.premiumSubscriptionCount}`)}** `,
        `${emojii} \`Sesli:\`  **${client.emojiSayi(`${message.guild.channels.cache.filter(channel => channel.type == 'voice').map(channel => channel.members.size).reduce((a, b) => a + b)}`)}** `
    ]).setFooter(`${ayar.tag} Tagımızı Alarak Bize Destek Çıkabilirsin ^^`).setThumbnail(message.guild.iconURL({ dynamic: true })).setTimestamp());
};

module.exports.configuration = {
    name: 'say',
    aliases: ['count', 'yoklama'],
    usage: 'say',
    description: 'Sunucu sayımı.',
    permLevel: 0
};


