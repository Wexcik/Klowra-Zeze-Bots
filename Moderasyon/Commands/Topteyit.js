const { MessageEmbed } = require('discord.js');
const Member = require('../Models/Member.js');
var banLimitleri = new Map();

module.exports.execute = async(client, message, args, ayar) => {
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.enAltYetkiliRolu).rawPosition <= rol.rawPosition) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({timeout: 7500}))
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (banLimitleri.get(message.author.id) >= 1) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
    let embed = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setThumbnail(message.guild.iconURL({dynamic: true})).setColor('ff0013');
    let mesaj = await message.lineReply('Veriler kontrol ediliyor...');
    if(ayar.embedImage) embed.setImage(ayar.embedImage);
    Member.find({guildID: message.guild.id}).exec((err, data) => {
        let listedMembers = data.filter(d => message.guild.members.cache.has(d.userID) && d.yetkili && (d.yetkili.get('erkekTeyit') || d.yetkili.get('kizTeyit'))).sort((a, b) => Number((b.yetkili.get('erkekTeyit') || 0)+(b.yetkili.get('kizTeyit') || 0))-Number((a.yetkili.get('erkekTeyit') || 0)+(a.yetkili.get('kizTeyit') || 0))).map((uye, index) => `\`${index+1}.\` ${message.guild.members.cache.get(uye.userID).toString()} | \`${client.sayilariCevir((uye.yetkili.get('erkekTeyit') || 0) + (uye.yetkili.get('kizTeyit') || 0))} teyit\``).splice(0, 30);
        
    setTimeout(() => {
        mesaj.delete();
        message.lineReply(embed.setDescription(`**Top Teyit Listesi**\n\n${listedMembers.join('\n') || 'Teyit verisi bulunamadı!'}`)).then(x => x.delete({timeout: 30000}))
    }, 3000);
    });
    if (message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) return;
    banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
    setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))-1);
    }, 1000*60*3);
};
module.exports.configuration = {
    name: 'topteyit',
    aliases: ['top-teyit', 'teyit-top'],
    usage: 'topteyit',
    description: 'Top teyit istatistikleri.',
    permLevel: 0
};