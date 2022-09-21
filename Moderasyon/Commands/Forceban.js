/* eslint-disable linebreak-style */
const { MessageEmbed } = require('discord.js');
const Penalty = require('../Models/Penalty.js');

module.exports.execute = async (client, message, args, ayar) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let reason = args.splice(1).join(' ');
    if (!reason) return message.lineReply(embed.setDescription('Geçerli bir üye ve sebep belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    let cezaNumara = await client.cezaNumara();
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.lineReply(embed.setDescription('Banlamaya çalıştığın üye senle aynı yetkide veya senden üstün!')).then(x => x.delete({ timeout: 5000 }));
    if (!uye.bannable) return message.lineReply(embed.setDescription('Botun yetkisi belirtilen üyeyi banlamaya yetmiyor!')).then(x => x.delete({ timeout: 5000 }));
    uye.send(embed.setDescription(`${message.author} tarafından **${reason}** sebebiyle sunucudan banlandın.`)).catch(() => {
        return undefined;
    });
    uye.kick({ reason: reason }).then(() => message.react("☑️")).catch(() => {
        return undefined;
    });
    message.lineReply(embed.setDescription(`\`${uye.user.tag}\` üyesi ${message.author} tarafından **${reason}** nedeniyle sunucudan **yasaklandı!**`));
    if (client.channels.cache.has(ayar.banLogKanali)) client.channels.cache.find(c => c.name === ayar.banLogKanali).send( new MessageEmbed().setColor('BLACK').setDescription(`${uye} üyesi sunucudan **yasaklandı!**\n\n• Ceza ID: \`#${cezaNumara}\`\n• Yasaklanan Üye: ${uye} (\`${uye.user.tag}\` - \`${uye.id}\`)\n• Yasaklayan Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Yasaklanma Tarihi: \`${new Date().toTurkishFormatDate()}\`\n• Yasaklanma Sebebi: \`${reason}\``));
    let newPenalty = new Penalty({
        sunucuID: message.guild.id,
        uyeID: uye.id,
        yetkiliID: message.author.id,
        cezaTuru: 'FORCEBAN',
        cezaSebebi: reason,
        atilmaTarihi: Date.now(),
        bitisTarihi: null,
    });
    newPenalty.save();
};
module.exports.configuration = {
    name: 'forceban',
    aliases: ["forceban","infaz","bubenimyargım"],
    usage: 'forceban [üye] [sebep] [id]',
    description: 'Belirtilen üyeyi sunucudan yasaklar.',
    permLevel: 1
};