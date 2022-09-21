const Penalty = require('../Models/Penalty.js');
const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("ff0013");
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "zezeiptal")}`);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  
    if (!args[0]) return message.reply("Geçerli bir üye belirtmelisin!");
    let uye = message.mentions.members.first() 
    if (uye) {
        uye = uye.id;
    } else {
        if (isNaN(args[0])) return message.reply("Geçerli bir üye belirtmelisin!");
        uye = args[0];
    };

    let cezalar = await Penalty.find({ sunucuID: message.guild.id, uyeID: uye }) || [];
    cezalar = cezalar.filter(c => !c.bitisTarihi || c.bitisTarihi > Date.now()).sort((c1, c2) => Number(c2.atilmaTarihi) - Number(c1.atilmaTarihi));
    const cezaBilgi = (ceza) => `• Cezalandıran Yetkili: ${ceza ? `${message.guild.members.cache.has(ceza.yetkiliID) ? `${message.guild.members.cache.get(ceza.yetkiliID).toString()} (\`${ceza.yetkiliID}\`)` : `${ceza.yetkiliID}`}\n• Cezalandırma Tarihi: \`${new Date(ceza.atilmaTarihi).toTurkishFormatDate()}\`\n• Bitiş Tarihi: \`${ceza.bitisTarihi ? new Date(ceza.bitisTarihi).toTurkishFormatDate() : 'Belirtilmemiş!'}\`\n• Ceza Sebebi: \`${ceza.cezaSebebi}\`` : '\`Herhangi bir ses mute bulunamadı!\`'}`;
    embed.addField('Cezalı Bilgisi', cezaBilgi(cezalar.filter(c => c.cezaTuru === 'JAIL' || c.cezaTuru === 'TEMP-JAIL')[0]));
    embed.addField('Chat Mute Bilgisi', cezaBilgi(cezalar.filter(c => c.cezaTuru === 'CHAT-MUTE')[0]));
    embed.addField('Ses Mute Bilgisi', cezaBilgi(cezalar.filter(c => c.cezaTuru === 'VOICE-MUTE')[0]));
    embed.addField("Ban Bilgisi", cezaBilgi(cezalar.filter(c => c.cezaTuru === 'BAN')[0]));
    message.lineReply(embed).then(x => x.delete({ timeout: 15000 })).catch(console.error);
    message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`)

};
module.exports.configuration = {
    name: 'cezalar',
    aliases: ['penalties'],
    usage: 'cezalar [üye]',
    description: 'Belirtilen ceza hakkında detaylı bilgi verir.',
    permLevel: 0
};
