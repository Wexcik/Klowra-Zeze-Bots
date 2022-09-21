const { MessageEmbed } = require('discord.js');
const Penalty = require('../Models/Penalty.js');
module.exports.execute = async (client, message, args, ayar) => {
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
      const cezaBilgiEmbed = new MessageEmbed().setColor("ff0013").setDescription('`Belirtilen ID numarasına sahip bir ceza verisi bulunamadı!`');
    const ID = args[0];
    if (!ID || isNaN(ID)) return message.lineReply(cezaBilgiEmbed);
    Penalty.find({ sunucuID: message.guild.id }).exec(async (err, cezalar) => {
        const ceza = cezalar[ID];
        if (ceza) {
            const cezalandirilanUye = await client.users.fetch(ceza.uyeID);
            const cezalandiranYetkili = await client.users.fetch(ceza.yetkiliID);
            cezaBilgiEmbed.setDescription(`Ceza \`#${args[0]}\`\n\n• Cezalandırılan Üye: ${cezalandirilanUye ? `${cezalandirilanUye.toString()} (\`${cezalandirilanUye.tag}\` - \`${cezalandirilanUye.id}\`)` : `\`${ceza.uyeID}\``}\n• Cezalandıran Yetkili: ${cezalandiranYetkili ? `${cezalandiranYetkili.toString()} (\`${cezalandiranYetkili.tag}\` - \`${cezalandiranYetkili.id}\`)` : `\`${ceza.yetkiliID}\``}\n• Ceza Türü: \`${ceza.cezaTuru}\`\n• Ceza Atılma Tarihi: \`${new Date(ceza.atilmaTarihi).toTurkishFormatDate()}\`\n• Ceza Sebebi: \`${ceza.cezaSebebi}\`\n• Ceza Bitiş Tarihi: \`${ceza.bitisTarihi ? new Date(ceza.bitisTarihi).toTurkishFormatDate() : 'Belirtilmemiş!'}\``);
            message.lineReply(cezaBilgiEmbed).then(x => x.delete({ timeout: 15000 })).catch(console.error);
        }
    });
    message.react(`${client.emojis.cache.find(c => c.name === "klowratik")}`)

};
module.exports.configuration = {
    name: 'cezabilgi',
    aliases: ['ceza-bilgi', 'cezasorgu', 'ceza-sorgu'],
    usage: 'cezabilgi cezaID',
    description: 'Belirtilen ceza hakkında detaylı bilgi verir.',
    permLevel: 0
};