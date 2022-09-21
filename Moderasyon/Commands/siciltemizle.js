const { MessageEmbed } = require('discord.js');
const Penalty = require('../Models/Penalty.js');

module.exports.execute = async (client, message, [user, ...args], ayar, emoji) => { 
    if (!ayar.sicilsorumluları.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!uye) return message.lineReply('Lütfen bir kişi etiketle.').then(x => x.delete({timeout: 5500}))

    let channel = message.guild.channels.cache.find(c => c.name === ayar.siciltemizlemelog)
    message.lineReply(new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setDescription(`${message.author}, ${uye} kişisinin sicillerini temizledi.`))
    if(channel) channel.send(new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setDescription(`${message.author}, ${uye} kişisinin sicillerini temizledi.\nSilinmeden önceki sicil büyüklüğü: ${await Penalty.find({ uyeID: uye.id }).lenght || 0}`))
    await Penalty.deleteMany({uyeID: uye.id})
}
module.exports.configuration = {
    name: 'sicilsil',
    aliases: ['ssil','siciltemizle','stemizle','arındır'],
    usage: 'sicilsil [üye]',
    description: 'Belirtilen üyenin tüm sicilini gösterir.',
    permLevel: 0
};