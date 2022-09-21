const Discord = require('discord.js');
const moment = require('moment');
var kanaldeğişlimit = new Map()
 
module.exports.execute = async (client, message, args, ayar) => {
    if(!ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && message.channel.name === ayar.chatKanali && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(!ayar.kanalyönet.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(!args[0] || !args[0].includes('limit') && !args[0].includes('isim')) return message.lineReply('Bir argüman belirtmelisin. \`limit yada isim\`').then(c => c.delete({timeout: 5500}))
    if(kanaldeğişlimit.get(message.author.id) > 5 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply('Bu komut için limite ulaştın. Biraz beklemelisin!').then(c => c.delete({timeout: 5500}))
    kanaldeğişlimit.set(message.author.id, (Number(kanaldeğişlimit.get(message.author.id) || 0))+1);
    let channel = message.guild.channels.cache.get(message.member.voice.channelID)
    if(args[0] && args[0].includes('limit')) {
        let limit = Number(args[1])
        if (!limit) return message.lineReply('Bir limit belirtmelesin.').then(c => c.delete({ timeout: 5500}))
        if (limit > 99) return message.lineReply('Limit 99dan büyük olamaz.').then(c => c.delete({ timeout: 5500}))
        let eskilimit = channel.userLimit || 0;
        await channel.setUserLimit(limit)
        message.lineReply('Kanal limiti ayarlandı.').then(c => c.delete({ timeout: 7500}))
        await message.guild.channels.cache.find(c => c.name === ayar.kanallog).send(`<-------------------------------------------------->\nBir kanalın limiti değiştirildi.\nDeğiştiren kişi: \`${message.author.tag}\` (\`${message.author.id}\`)\nDeğiştirilen kanal: ${channel}\nDeğiştirilen limit:\`${limit}\`\nDeğiştirilmeden önceki limit: \`${eskilimit}\`\n<-------------------------------------------------->`)      
    }
    if(args[0] && args[0].includes('isim')) {
        if(kanaldeğişlimit.get(message.author.id) > 1 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply('Bu komut için limite ulaştın. Biraz beklemelisin!').then(c => c.delete({timeout: 5500}))
        let isim = args.slice(1).join(" ")
        if (!isim) return message.lineReply('Bir isim belirtmelisin.').then(c => c.delete({ timeout: 5500}))
        if (isim && client.chatKoruma(isim)) return message.lineReply('Bir isim belirtmelisin.').then(c => c.delete({ timeout: 5500}))
        let eskiisim = channel.name
        await channel.setName(`${ayar.tag} ${isim}`)
        message.lineReply('Kanal ismi ayarlandı.').then(c => c.delete({ timeout: 7500}))
        await message.guild.channels.cache.find(c => c.name === ayar.kanallog).send(`<-------------------------------------------------->\nBir kanalın adı değiştirildi.\nDeğiştiren kişi: \`${message.author.tag}\` (\`${message.author.id}\`)\nDeğiştirilen kanal: ${channel}\nDeğiştirilen isim: \`${ayar.tag} ${isim}\`\nDeğiştirilmeden önceki ismi: \`${eskiisim}\`\n<-------------------------------------------------->`)
    }
    setTimeout(() => {
        kanaldeğişlimit.set(message.author.id, (Number(kanaldeğişlimit.get(message.author.id) || 0))-1);
      }, 1000*60*3);
};
module.exports.configuration = {
    name: 'kanal',
    aliases: ['channel'],
    usage: 'kanal limit/name',
    description: 'Bu komut üst yönetim ve kuruculara özeldir.',
    permLevel: 0
};