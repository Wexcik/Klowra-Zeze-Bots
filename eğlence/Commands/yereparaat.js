const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js')

module.exports.execute = async (client, message, args, ayar) => {
    
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    
    let dataBase = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id });
    if(!dataBase) { dataBase = Funny.create({ guildID: message.guild.id, userID: message.author.id })};
    
    let para = parseInt(Number(args[0])) || 1;
    let klowrapara = dataBase.klowrapara;
    
    if( para > klowrapara) return message.lineReply('bunun için yeterli paran yok.').then(d => d.delete({timeout:5000}));
    if( para > 10000 && !ayar.sahip.some(id => message.author.id === id) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role))) return message.lineReply(`yere atacağın miktar 10000 ${client.emojis.cache.find(c => c.name === 'klowracoin')} fazla olamaz.`).then(c => c.delete({timeout:5000}))
    if( para < 0 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`yere atacağın miktar 0 ${client.emojis.cache.find(c => c.name === 'klowracoin')} az olamaz.`).then(c => c.delete({timeout:5000}))

    const question = await message.lineReply(`${message.author} yere **${para}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} attı. 🪙 emojisine ilk basan **${para}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kazanır.`);
			await question.react(client.emojis.cache.find(c => c.name === 'klowracoin'));

            const collector = await question.createReactionCollector((reaction, user) => reaction.emoji.name === "klowracoin" && message.guild.members.cache.get(user.id), { max: 1 });
            collector.on("collect", async(_, user) => {
                let dataBaseb = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id });
                let öncekiparas = dataBaseb.klowrapara || 0;
                dataBaseb.klowrapara = (Number(öncekiparas) - para)
                dataBaseb.save()
                let kdataBase = await Funny.findOne({ guildID: message.guild.id, userID: user.id });
                if(!kdataBase) { dataBase = Funny.create({ guildID: message.guild.id, userID: user.id })};
                let öncekipara = kdataBase.klowrapara || 0;
                kdataBase.klowrapara = (Number(öncekipara) + para)
                kdataBase.save();
                question.edit(`${user} yere atılan **${para}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kazananı oldu`)
            });     
}
module.exports.configuration = {
    name: 'yereat',
    aliases: ["parayere","kapanalsın"],
    usage: 'parayere <miktar>',
    description: 'Günlük hediyenizi alırsınız.',
    permLevel: 0,
    cooldown: 0
}