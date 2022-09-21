const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js')

module.exports.execute = async (client, message, args, ayar) => {

    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let dataBase = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id});
    if(!dataBase) { dataBase = await Funny.create({ guildID: message.guild.id, userID: message.author.id})};
    let para = dataBase.coin;
    if(!para) return message.lineReply('paran yok. :(').then(x => x.delete({timeout:5000}))
    let coin = dataBase.klowrapara;

    let dönüştürülmüş = para * 100 ;

if(!dataBase) { dataBase = await Funny.create({ guildID: message.guild.id, userID: message.author.id})
} else {
    let öncekicoin = dataBase.klowrapara || 0;
    dataBase.coin = 0
    dataBase.klowrapara = (Number(öncekicoin) + parseInt(dönüştürülmüş))
    dataBase.save();
}
message.lineReply(`${para} miktar coinini ${parseInt(dönüştürülmüş)} miktar klowraparasına dönüştürdün. \`Toplam Klowraparan:\` ${coin + parseInt(dönüştürülmüş)} ${client.emojis.cache.find(x => x.name === "klowracoin")}`).then(x => x.delete({timeout:10000}))

}
module.exports.configuration = {
    name: 'coindönüştür',
    aliases: ["cdönüştür","cçevir"],
    usage: 'dönüştür',
    description: 'Klowraparanızı coine dönüştürmenize yarar.',
    permLevel: 0
};