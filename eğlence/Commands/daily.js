const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js')

module.exports.execute = async (client, message, args, ayar) => {

    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let database = await client.dataBase.findOne({ guildID : message.guild.id, userID : message.author.id })
    if (!database){
       database = await client.dataBase.create({  guildID: message.guild.id, userID: message.author.id });
}
   let beklemeSuresi = database.daily
   const now = new Date();
    const süre = Date.now() + (new Date((now.getMonth()+1) + " " + (now.getDate() + 1) + " " + now.getFullYear()).getTime() - Date.now());
    if(beklemeSuresi) {
        if (beklemeSuresi > Date.now()) {return message.lineReply(`günde sadece 1 defa bu komutu **kullanabilirsin**.`).then(x => x.delete({timeout:5000}))
    }  
   }
      const eklenecek = Math.floor(Math.random() * (5000 - 1500 + 1)) + 1500;
      message.lineReply(new MessageEmbed()
    .setAuthor(`${message.author.tag}`, message.author.avatarURL({dynamic: true, size: 256}))
    .setThumbnail("https://media.discordapp.net/attachments/838122326142353488/843233395022495754/coin.png?width=465&height=465")
    .setDescription(`${message.author} günlük hediyeni aldın!\n ${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Günlük Hediyen:\` **${eklenecek}** ${client.emojis.cache.find(x => x.name === "klowracoin")} \n ${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Toplam Paran:\` **${database.klowrapara + eklenecek}** ${client.emojis.cache.find(x => x.name === "klowracoin")}`)
    .setColor("RANDOM")
    .setTimestamp()).then(x => x.delete({timeout:10000}))

    

     let öncekiveri = database.klowrapara || 0;
     database.klowrapara = (Number(öncekiveri) + eklenecek);
     database.daily = süre
    await database.save();
;
}
module.exports.configuration = {
    name: 'daily',
    aliases: ["günlük","hediye"],
    usage: 'daily',
    description: 'Günlük hediyenizi alırsınız.',
    permLevel: 0
}