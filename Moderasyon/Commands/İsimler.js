/* eslint-disable linebreak-style */
const Database = require('../Models/Member.js');
const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar, emoji) => {
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    const kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(' ').toLowerCase())).first() : message.author) || message.author;
    let member = message.guild.member(kullanici);
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.enAltYetkiliRolu).rawPosition <= rol.rawPosition)) return message.react("⛔");
    if (!member) return message.lineReply('Geçerli bir sunucu üyesi belirtmelisin!').then(x => x.delete({ timeout: 5000 }));
    const memberData = await Database.findOne({ userID: member.id }) || {};
    const historyData = memberData.history || [];
    if (!memberData.history) return message.lineReply(embed.setAuthor(member.displayName, kullanici.avatarURL({ dynamic: true })).setDescription('Üyenin herhangi bir kayıtı bulunamadı.'));
    message.lineReply(embed.setAuthor(member.displayName, kullanici.avatarURL({ dynamic: true })).setDescription([
        `Bu üyenin toplamda ${historyData.length} isim kayıtı bulundu:\n`,
        historyData.map((x) => `\`▫️ ${x.name}\` (<@&${x.role}>)`).join('\n')
    ])).then(x => x.delete({ timeout: 10000 }));
};
module.exports.configuration = {
    name: 'isimler',
    aliases: [],
    usage: 'sicil [üye]',
    description: 'Belirtilen üyenin tüm sicilini gösterir.',
    permLevel: 0
};