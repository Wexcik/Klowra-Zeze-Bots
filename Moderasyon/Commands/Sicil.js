const Penalty = require('../Models/Penalty.js');

module.exports.execute = async (client, message, [user, ...args], ayar, emoji) => {
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const kullanici = message.mentions.users.first() || client.users.cache.get(user) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(' ').toLowerCase())).first() : message.author) || message.author;
    let uye = message.guild.member(kullanici);
    if (!uye) return message.lineReply('Geçerli bir sunucu üyesi belirtmelisin!').then(x => x.delete({ timeout: 5000 }));
    Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).exec((err, sicil) => {
        sicil = sicil.reverse();
        let listedPenal = sicil.length ? sicil.map((ceza, index) => `\`${index + 1}.\` **[${ceza.cezaTuru}]** ${new Date(ceza.atilmaTarihi).toTurkishFormatDate()} tarihinde **${ceza.cezaSebebi}** nedeniyle ${message.guild.members.cache.has(ceza.yetkiliID) ? message.guild.members.cache.get(ceza.yetkiliID).toString() : ceza.yetkiliID} tarafından cezalandırıldı!`).join('\n') : 'Temiz';
        let uyeDurum;
        if (sicil.length < 5) uyeDurum = 'Çok güvenli!';
        if (sicil.length >= 5 && sicil.length < 10) uyeDurum = 'Güvenli!';
        if (sicil.length >= 10 && sicil.length < 15) uyeDurum = 'Şüpheli!';
        if (sicil.length >= 15 && sicil.length < 20) uyeDurum = 'Tehlikeli!';
        if (sicil.length >= 20) uyeDurum = 'Çok tehlikeli!';
        client.splitEmbedWithDesc(`**${uye} Üyesinin Sicili** (\`${uyeDurum}\`)\n\n${listedPenal}`,
            { name: message.guild.name, icon: message.guild.iconURL({ dynamic: true, size: 2048 }) },
            false,
            { setColor: ['BLUE'] }).then(list => {
                list.forEach(item => {
                    message.lineReply(item);
                });
            });
    });
};
module.exports.configuration = {
    name: 'sicil',
    aliases: ['geçmiş'],
    usage: 'sicil [üye]',
    description: 'Belirtilen üyenin tüm sicilini gösterir.',
    permLevel: 0
};