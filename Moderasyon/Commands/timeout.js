const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
const moment = require('moment');
const ms = require("ms")
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("ff0013");
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (!ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id) && !ayar.timeoutçular.some(rol => message.member.roles.cache.has(rol))) return message.lineReply( embed.setDescription('`Yeterli Yetkin Bulunmamakta.`')).then(x => x.delete({ timeout: 5000 }));
    if (banLimitleri.get(message.author.id) >= ayar.timeoutlimit) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]); 
	if (!member) return message.lineReply("Üye belirtmedin!").then(x => x.delete({ timeout: 5000 }));
    if (message.member.roles.highest.position <= member.roles.highest.position && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(embed.setDescription('Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!')).then(x => x.delete({ timeout: 5000 }));
    let sure = args[1]
    const cezaNumara = await client.cezaNumara();
    if (!sure) return message.lineReply('Süre belirtmedin!').then(x => x.delete({ timeout: 5000 }));
    let reason = args[2]
    if (!reason) return message.lineReply('Sebep belirtmedin!').then(x => x.delete({ timeout: 5000 }));
    const atilisTarihi = Date.now()
    const bitisTarihi = Date.now() + ms(sure)
    if (!member.bannable) return message.lineReply('Belirttiğin kişi benden üstte ya da aynı roldeyim!')

        require("axios")({
            method: "patch",
            url: `https://discord.com/api/v9/guilds/${ayar.sunucuID}/members/${member.id}`,
            data: { communication_disabled_until: new Date(Date.now() + require("ms")(`${sure}`)) },
            headers: { authorization: `Bot ${client.token}` }
    })
    
    let newPenalty = new Penalty({
        sunucuID: message.guild.id,
        uyeID: member.id,
        yetkiliID: message.author.id,
        cezaTuru: 'TIMEOUT',
        cezaSebebi: reason,
        atilmaTarihi: atilisTarihi,
        bitisTarihi: bitisTarihi,
    });
    newPenalty.save();
    message.lineReply(embed.setDescription(`${member} \`(${moment.duration(ms(sure)).format('D [gün,] H [saat,] m [dakika]')})\` dakika boyunca ${reason} sebebiyle zaman aşımı uygulandı!`)).catch(console.error);
    client.channels.cache.find(c => c.name === ayar.muteLogKanali).send(new MessageEmbed().setColor('f39c12').setDescription(`Zaman aşımı atan: ${message.author} \`(${message.author.id})\`\nZaman aşımı atılan: ${member} \`(${member.id})\`\nSebep: ${reason}\nSüre: ${new Date(bitisTarihi).toTurkishFormatDate()} \`(${moment.duration(ms(sure)).format('D [gün,] H [saat,] m [dakika]')})\`\nCeza-i İşlem: Zaman aşımı \`(${cezaNumara})\``)).catch(console.error);
    setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
    }, 1000 * 60 * 3);
    message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`);
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
    }
}
module.exports.configuration = {
	name: 'timeout',
	aliases: ['zamanaşımı'],
	usage: 'timeout [üye] [süre] [sebep]',
	description: 'Belirtilen üyeye timeout atar.',
	permLevel: 0
};