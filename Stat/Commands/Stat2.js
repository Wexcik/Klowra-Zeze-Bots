const { MessageEmbed } = require('discord.js');
const MemberStats = require('../Models/MemberStats.js');
const Member = require('../Models/Member.js');
const Penalty = require('../Models/Penalty.js');
const LevelModel = require('../Models/Level.js');
const inviteData = require('../Models/Inviter.js');
var banLimitleri = new Map();

module.exports.execute = async(client, message, args,ayar) => {
    if(![ayar.sahipRolu].some(role => message.member.roles.cache.has(role)) && message.channel.name === ayar.chatKanali && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`)
   let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(' ').toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanici);
    let embed = new MessageEmbed().setColor("3f0000").setAuthor(kullanici.tag.replace('`', '')+` ( ` + kullanici.id + ` )` , kullanici.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.avatarURL({dynamic: true, size: 2048}));
    let yetkiliBilgisi = '';
    let datalevel = await LevelModel.findOne({ id: kullanici.id }).exec();
    let enalt = uye.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position
    if(enalt) {
        let teyitData = await Member.findOne({ guildID: message.guild.id, userID: uye.id });
        if (teyitData) {
            let erkekTeyit = teyitData.yetkili.get('erkekTeyit') || 0;
            let kizTeyit = teyitData.yetkili.get('kizTeyit') || 0;
            yetkiliBilgisi += `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")} \`Teyitleri:\` ${erkekTeyit+kizTeyit} (**${erkekTeyit}** erkek, **${kizTeyit}** kiz)\n`;
        }
        let penaltiesData = await Penalty.find({ sunucuID: message.guild.id, yetkiliID: uye.id });
        let toplam = penaltiesData.length;
        let chatMute = penaltiesData.filter(c => c.cezaTuru === 'CHAT-MUTE').length;
        let sesMute = penaltiesData.filter(c => c.cezaTuru === 'VOICE-MUTE').length;
        let kick = penaltiesData.filter(c => c.cezaTuru === 'KICK').length;
        let ban = penaltiesData.filter(c => c.cezaTuru === 'BAN').length;
        let jail = penaltiesData.filter(c => c.cezaTuru === 'JAIL' || c.cezaTuru === 'TEMP-JAIL').length;
        yetkiliBilgisi += `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")} \`Cezalandırmaları:\` ${toplam}\n **|** (**${chatMute}** chat | **${sesMute}** ses mute, **${jail}** jail, **${kick}** kick,**${ban}** ban)`;
    }
    MemberStats.findOne({ guildID: message.guild.id, userID: uye.id }, (err, data) => {
        if (!data) return message.lineReply(embed.setDescription('Belirtilen üyeye ait herhangi bir veri bulunamadı!'));
        let haftalikSesToplam = 0;
        data.voiceStats15.forEach(c => haftalikSesToplam += c);
        let haftalikSesListe = '';
        let sesmik = 0;
        data.voiceStats.forEach((value, key) => {
            sesmik+=1
            if (sesmik == 10) return;
            haftalikSesListe += `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`${message.guild.channels.cache.has(key) ? message.guild.channels.cache.get(key).name : 'Bilinmeyen'}:\` ** ${client.convertDuration(value)}**\n`
        });
        let haftalikChatToplam = 0;
        data.chatStats15.forEach(c => haftalikChatToplam += c);
        let haftalikChatListe = '';
        let chatmik = 0;
        data.chatStats.forEach((value, key) => {
            chatmik+=1
            if (chatmik == 10) return;
            haftalikChatListe += `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\` ${message.guild.channels.cache.has(key) ? message.guild.channels.cache.get(key).name : 'Bilinmeyen'}:\`** ${value} mesaj**\n`
        });
        inviteData.findOne({ guildID: message.guild.id, userID: uye.id }, (err, inviterData) => {
        inviteData.find({ guildID: message.guild.id, inviterID: uye.id }).sort().exec((err, inviterMembers) => {
        inviterMembers = inviterMembers.filter(x => message.guild.members.cache.has(x.userID));
        let dailyInvites = 0;
        if (inviterMembers.length) {
          dailyInvites = inviterMembers.filter(x => (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 1000 * 60 * 60 * 24).length;
        };
        embed.addField('|-----------------------------------------------------\n| Genel İstatistik',`**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Genel Toplam Ses:\` ** ${client.convertDuration(data.totalVoiceStats || 0)}**\n**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Genel Toplam Chat:\` ** ${data.totalChatStats || 0} mesaj**`);
        embed.addField('|-----------------------------------------------------\n| Genel Ses Durumu',`**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Toplam:\`  ** ${client.convertDuration(haftalikSesToplam)}** \n ${haftalikSesListe}`);
        embed.addField('|-----------------------------------------------------\n| Genel Chat Durumu',`**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Toplam:\`  ** ${haftalikChatToplam} mesaj** \n ${haftalikChatListe}`)
        embed.addField('|-----------------------------------------------------\n| Genel Davet Durumu',`**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Toplam:\`  ** ${!inviterData ? '0' : inviterData.regular + inviterData.bonus}** \`davete sahip!\`\n**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Gerçek\`: **${!inviterData ? '0' : inviterData.regular}** \`davet.\`\n**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Bonus\`: **${!inviterData ? '0' : inviterData.bonus}** \`davet.\`\n**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Fake\`: **${!inviterData ? '0' : inviterData.fake}** \`davet.\`\n**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Günlük\`: **${!inviterData ? '0' : dailyInvites}** \`davet.\``)
        embed.addField('|-----------------------------------------------------\n| Genel Level Durumu',`**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Mesaj Seviyesi:\` **${datalevel.messageLevel}** \`Level\` **${datalevel.messageCurrentXP}/${datalevel.messageRequiredXP}**\`XP\`\n **|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Ses Seviyesi:\` **${datalevel.voiceLevel}** \`Level\` **${datalevel.voiceCurrentXP}/${datalevel.voiceRequiredXP}**\`XP\`\n **|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Invite Seviyesi:\` **${datalevel.inviteLevel}** \`Level\` **${datalevel.inviteCurrentXP}/${datalevel.inviteRequiredXP}**\`XP\``)
        embed.addField('|-----------------------------------------------------\n| Moderasyon Durumu',`${!enalt ? `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Yetkili Değilsin!\`` : yetkiliBilgisi} **\n|-----------------------------------------------------**`);
        message.lineReply(embed);
    });
});
    });
};
module.exports.configuration = {
    name: 'stat2',
    aliases: ['stats15','stat15', 'vinfo15', 'cinfo15'],
    usage: 'stat [üye]',
    description: 'Belirtilen üyenin tüm ses ve chat bilgilerini gösterir.',
    permLevel: 0
};