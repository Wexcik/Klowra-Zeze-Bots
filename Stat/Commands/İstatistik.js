const { MessageEmbed } = require('discord.js');
const Member = require('../Models/Member.js');
const Penalty = require('../Models/Penalty.js');
const Cezapuan = require('../Models/cezapuanı.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar) => {
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(!ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && message.channel.name === ayar.chatKanali && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(' ').toLowerCase())).first() : message.author) || message.author;
    let uye = message.guild.member(kullanici);
    const embed = new MessageEmbed().setColor("ffd368").setAuthor(kullanici.tag.replace('`', '') + ` ( ` + kullanici.id + ` )`, kullanici.avatarURL({ dynamic: true, size: 2048 })).setThumbnail(kullanici.avatarURL({ dynamic: true, size: 2048 }))
        .addField('__**Kullanıcı Bilgisi**__', `${client.emojis.cache.find(x => x.name === "klowrareg2")} \`ID:\` ${kullanici.id}\n${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Profil:\` ${kullanici}\n${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Durum:\` ${kullanici.presence.activities[0] ? kullanici.presence.activities[0].name + ` ${(kullanici.presence.activities[0].type)}`.replace('PLAYING', 'Oynuyor').replace('STREAMING', 'Yayında').replace('LISTENING', 'Dinliyor').replace('WATCHING', 'İzliyor').replace('CUSTOM_STATUS', '') : (kullanici.presence.status).replace('offline', 'Görünmez/Çevrimdışı').replace('online', 'Çevrimiçi').replace('idle', 'Boşta').replace('dnd', 'Rahatsız Etmeyin')}\n${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Oluşturulma Tarihi:\` ${kullanici.createdAt.toTurkishFormatDate()}`);

    let yetkiliBilgisi = '';
    if (uye.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) {
        let teyitData = await Member.findOne({ guildID: message.guild.id, userID: uye.id });
        if (teyitData) {
            let erkekTeyit = teyitData.yetkili.get('erkekTeyit') || 0;
            let kizTeyit = teyitData.yetkili.get('kizTeyit') || 0;
            yetkiliBilgisi += `${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Teyitleri:\` **${erkekTeyit + kizTeyit}** (**${erkekTeyit}** erkek, **${kizTeyit}** kiz)\n`;
        }
        let data = await Cezapuan.findOne({ guildID: message.guild.id, userID: kullanici.id })
        let penaltiesData = await Penalty.find({ sunucuID: message.guild.id, yetkiliID: uye.id });
        let toplam = penaltiesData.length;
        let chatMute = penaltiesData.filter(c => c.cezaTuru === 'CHAT-MUTE').length;
        let sesMute = penaltiesData.filter(c => c.cezaTuru === 'VOICE-MUTE').length;
        let kick = penaltiesData.filter(c => c.cezaTuru === 'KICK').length;
        let ban = penaltiesData.filter(c => c.cezaTuru === 'BAN').length;
        let jail = penaltiesData.filter(c => c.cezaTuru === 'JAIL' || c.cezaTuru === 'TEMP-JAIL' || c.cezaTuru === 'REKLAM').length;
        yetkiliBilgisi += `${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Cezalandırmaları:\` **${toplam}** (**${chatMute}** chat | **${sesMute}** ses mute, **${jail}** jail, **${kick}** kick, **${ban}** ban)\n${client.emojis.cache.find(x => x.name === "klowrareg2")} ${data ? `\`Cezapuanı:\` **${data.puan}** puan` : ""}`;
    }
    if (uye) {
        embed.addField('__**Üyelik Bilgisi**__', `${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Takma Adı:\` ${uye.displayName.replace('`', '')} ${uye.nickname ? '' : '[Yok]'}\n${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Katılma Tarihi:\` ${uye.joinedAt.toTurkishFormatDate()}\n${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Katılım Sırası:\` ${(message.guild.members.cache.filter(a => a.joinedTimestamp <= uye.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}\n${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Rolleri:\` ${uye.roles.cache.size <= 10 ? uye.roles.cache.filter(x => x.name !== '@everyone').map(x => x).join(', ') : `Listelenemedi! (${uye.roles.cache.size})`}`)
        embed.addField('__**Moderasyon Bilgisi**__', `${yetkiliBilgisi ? yetkiliBilgisi : `${client.emojis.cache.find(x => x.name === "klowrareg2")} **\`Yetkili değilsin.\`**`}`);
    }
    message.lineReply(embed);
};
module.exports.configuration = {
    name: 'istatistik',
    aliases: ['bilgi', 'i', 'me', 'user', 'info'],
    usage: 'istatistik [üye]',
    description: 'Belirtilen üyenin tüm bilgilerini gösterir.',
    permLevel: 0
};
