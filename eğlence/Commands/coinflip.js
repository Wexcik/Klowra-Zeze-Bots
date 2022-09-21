const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js')

module.exports.execute = async (client, message, args, ayar) => {

    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    
    let dataBase = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id });
    if(!dataBase) { dataBase = Funny.create({ guildID: message.guild.id, userID: message.author.id })};
    
    let para = parseInt(Number(args[0])) || 1;
    let klowrapara = dataBase.klowrapara;
    if( args[0] && args[0].includes('all') && 10000 < dataBase.klowrapara) { para = 10000 }
    if( args[0] && args[0].includes('all') && 10000 > dataBase.klowrapara) { para = dataBase.klowrapara }
    if( dataBase.klowrapara <= 0 ) return message.lineReply('hiç paran yok.').then(m => m.delete({timeout:5000}))
    if( para > klowrapara) return message.lineReply('bunun için yeterli paran yok.').then(d => d.delete({timeout:5000}));
    if( para > 10000 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`bahse gireceğin miktar 10000 ${client.emojis.cache.find(c => c.name === 'klowracoin')} fazla olamaz.`).then(c => c.delete({timeout:5000}))
    if( para < 0 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`bahse gireceğin miktar 0 ${client.emojis.cache.find(c => c.name === 'klowracoin')} az olamaz.`).then(c => c.delete({timeout:5000}))

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    let msj = await message.lineReply(`${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')} bahis yaptın. 2 yüzlü madeni para havaya fırlatıldı. ${client.emojis.cache.find(c => c.name === 'klowracf')}`)

    const miss = Math.floor(Math.random() * 2);
                    if (!miss) {
                        await sleep(5000); // saniye
                        await msj.edit(`${message.author} Tebrikler ${para*2} ${client.emojis.cache.find(c => c.name === 'klowracoin')} kazandın.`);
                        let öncekipara = dataBase.klowrapara || 0;
                        dataBase.klowrapara = (Number(öncekipara) + para)
                        dataBase.save()
                    } else {
                        await sleep(5000); // saniye
                        await msj.edit(`${message.author} Üzgünüm ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')} kaybettin.`);
                        let öncekipara = dataBase.klowrapara || 0;
                        dataBase.klowrapara = (Number(öncekipara) - para)
                        dataBase.save()
                    }
}
module.exports.configuration = {
    name: 'coinflip',
    aliases: ["cf","flip"],
    usage: 'cf 10000',
    description: 'Kumar ile para kazanma şansınız olabilicek bir komut.',
    permLevel: 0,
    cooldown: 10
}