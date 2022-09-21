const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js')

module.exports.execute = async (client, message, args, ayar) => {
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

    let user = message.mentions.users.first() || client.users.cache.get(args[0])
    if (!user) return message.lineReply('bir id yada etiket belirtmelisin.').then(c => c.delete({timeout: 5000}))

    let para = parseInt(Number(args[1]))
    if (!para) return message.lineReply('göndericeğin para miktarını belirtmelisin.').then(c => c.delete({timeout: 5000}))

let database = await Funny.findOne({ guildID: message.guild.id, userID: user.id})
if (!database) { database = await Funny.create({ guildID: message.guild.id, userID: user.id})}
let databasesahip = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id })
if (!databasesahip) { databasesahip = await Funny.create({ guildID: message.guild.id, userID: message.author.id })}
if (para > databasesahip.klowrapara) return message.lineReply('yeterli paran yok.').then(c => c.delete({timeout: 5000}))
if( para > 50000 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`göndereceğin miktar 50000 ${client.emojis.cache.find(c => c.name === 'klowracoin')} fazla olamaz.`).then(c => c.delete({timeout:5000}))
if( para < 0 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`göndereceğin miktar 0 ${client.emojis.cache.find(c => c.name === 'klowracoin')} az olamaz.`).then(c => c.delete({timeout:5000}))

if (!database) {
    authorData = await Funny.create({
        guildID: message.guild.id,
        userID: winner.id,
        kazanılan: 1,
    });
} else {
let öncekipara = database.klowrapara || 0;
database.klowrapara = (Number(öncekipara) + para)
database.save();
}
if (!databasesahip) {
    authorData1 = await Funny.create({
        guildID: message.guild.id,
        userID: looser.id,
        kaybedilen: 1,
    });
} else {
let öncekiparasahip = databasesahip.klowrapara || 0;
databasesahip.klowrapara = (Number(öncekiparasahip) - para)
databasesahip.save();
}
user.send(`${user}`, new MessageEmbed()
.setAuthor(`${user.tag}`, user.avatarURL({dynamic: false, size: 256}))
.setThumbnail("https://media.discordapp.net/attachments/838122326142353488/843233395022495754/coin.png?width=465&height=465")
.setColor("RANDOM")
.addField(`${client.emojis.cache.find(x => x.name === "klowrareg2")} Para Geldi!!!`, `${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Gönderen Kişi:\` ${message.author} \n ${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Gönderdiği Klowraparası:\` **${para}** ${client.emojis.cache.find(x => x.name === "klowracoin")} \n ${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Toplam Klowraparan:\` **${database.klowrapara}** ${client.emojis.cache.find(x => x.name === "klowracoin")}`))
message.lineReply(`${user}`, new MessageEmbed()
.setAuthor(`${user.tag}`, user.avatarURL({dynamic: false, size: 256}))
.setThumbnail("https://media.discordapp.net/attachments/838122326142353488/843233395022495754/coin.png?width=465&height=465")
.setColor("RANDOM")
.addField(`${client.emojis.cache.find(x => x.name === "klowrareg2")} Para Geldi!!!`, `${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Gönderen Kişi:\` ${message.author} \n ${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Gönderdiği Klowraparası:\` **${para}** ${client.emojis.cache.find(x => x.name === "klowracoin")} \n ${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Toplam Klowraparan:\` **${database.klowrapara}** ${client.emojis.cache.find(x => x.name === "klowracoin")}`)).then(c => c.delete({timeout: 15000}))
}
module.exports.configuration = {
    name: 'paraver',
    aliases: ["paragönder","send","gönder"],
    usage: 'gönder <@kişietiketi>',
    description: 'Klowrapara göndermenize yarar.',
    permLevel: 0
}