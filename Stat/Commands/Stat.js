const { MessageEmbed } = require('discord.js');
const MemberStats = require('../Models/MemberStats.js');
const Member = require('../Models/Member.js');
const Penalty = require('../Models/Penalty.js');
const LevelModel = require('../Models/Level.js');
const haftalikInvite = require('../Models/haftalikDavet.js') 
var banLimitleri = new Map();

module.exports.execute = async(client, message, args, ayar) => {
    if(!ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && message.channel.name === ayar.chatKanali && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
   let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(' ').toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanici);
    let embed = new MessageEmbed().setColor("3f0000").setAuthor(kullanici.tag.replace('`', '')+` ( ` + kullanici.id + ` )` , kullanici.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.avatarURL({dynamic: true, size: 2048}));
    let yetkiliBilgisi = '';
    let haftalikDavetVerisi = await haftalikInvite.findById(uye.id) || { regular: [], leaves: [] };
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
        yetkiliBilgisi += `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")} \`Cezalandırmaları:\` ${toplam}\n**|** (**${chatMute}** chat | **${sesMute}** ses mute, **${jail}** jail, **${kick}** kick,**${ban}** ban)`;
    }
    MemberStats.findOne({ guildID: message.guild.id, userID: uye.id }, (err, data) => {
        if (!data) return message.lineReply(embed.setDescription('Belirtilen üyeye ait herhangi bir veri bulunamadı!'));
        let haftalikSesToplam = 0;
        data.voiceStats.forEach(c => haftalikSesToplam += c);
        let haftalikSesListe = '';
        let sesmik = 0;
        data.voiceStats.forEach((value, key) => {
            sesmik+=1
            if (sesmik == 10) return;
            haftalikSesListe += `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`${message.guild.channels.cache.has(key) ? message.guild.channels.cache.get(key).name : 'Bilinmeyen'}:\` ** ${client.convertDuration(value)}**\n`
        });
        let haftalikChatToplam = 0;
        data.chatStats.forEach(c => haftalikChatToplam += c);
        let haftalikChatListe = '';
        let chatmik = 0;
        data.chatStats.forEach((value, key) => {
            chatmik+=1
            if (chatmik == 10) return;
            haftalikChatListe += `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\` ${message.guild.channels.cache.has(key) ? message.guild.channels.cache.get(key).name : 'Bilinmeyen'}:\`** ${value} mesaj**\n`
        });
        embed.addField('|-----------------------------------------------------\n| Genel İstatistik',`**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Genel Toplam Ses:\` ** ${client.convertDuration(data.totalVoiceStats || 0)}**\n**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Genel Toplam Chat:\` ** ${data.totalChatStats || 0} mesaj**`);
        embed.addField('|-----------------------------------------------------\n| Haftalık Ses Durumu',`**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Toplam:\`  ** ${client.convertDuration(haftalikSesToplam)}** \n ${haftalikSesListe}`);
        embed.addField('|-----------------------------------------------------\n| Haftalık Chat Durumu',`**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Toplam:\`  ** ${haftalikChatToplam} mesaj** \n ${haftalikChatListe}`)
        embed.addField('|-----------------------------------------------------\n| Haftalık Davet Durumu',`**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Toplam:\`  ** ${haftalikDavetVerisi.regular ? haftalikDavetVerisi.regular.length : 0}** \`davete sahip!\`(**${haftalikDavetVerisi.leaves ? haftalikDavetVerisi.leaves.length : 0}** \`ayrılan\`)`)
        embed.addField('|-----------------------------------------------------\n| Genel Level Durumu',`**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Mesaj Seviyesi:\` **${datalevel.messageLevel}** \`Level\` **${datalevel.messageCurrentXP}/${datalevel.messageRequiredXP}**\`XP\`\n **|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Ses Seviyesi:\` **${datalevel.voiceLevel}** \`Level\` **${datalevel.voiceCurrentXP}/${datalevel.voiceRequiredXP}**\`XP\`\n **|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Invite Seviyesi:\` **${datalevel.inviteLevel}** \`Level\` **${datalevel.inviteCurrentXP}/${datalevel.inviteRequiredXP}**\`XP\``)
        embed.addField('|-----------------------------------------------------\n| Moderasyon Durumu',`${!enalt ? `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")}\`Yetkili Değilsin!\`` : yetkiliBilgisi} \n**|-----------------------------------------------------**`);
        message.lineReply(embed);
});

await checkStatRoles(uye);

};
module.exports.configuration = {
    name: 'stat',
    aliases: ['vinfo', 'cinfo'],
    usage: 'stat [üye]',
    description: 'Belirtilen üyenin tüm ses ve chat bilgilerini gösterir.',
    permLevel: 0
};
const joinedAtRoles = [
    { role: "847929375647465532", duration: 2629800000 },// 1
    { role: "847929450028597278", duration: 7889400000 }, // 3
    { role: "847929490390253609", duration: 15778800000 }, // 6
    { role: "847929496937431111", duration: 23668200000 }, // 9
    { role: "847929531233861672", duration: 31557600000 }, // 1yıl
];
const messageRoles = [
    { role: "915702596407283712", count: 1500 },
];
const voiceRoles = [
    { role: "915702657874800660", duration: 1000*60*60*25 },
];

async function checkStatRoles(member) {
    let statData = await MemberStats.findOne({ guildID: member.guild.id, userID: member.id }) || {};
    let message = Number(statData.chatStats);
    let voice = Number(statData.voiceStats);
    let joinedAt = member.joinedTimestamp;
    let joinedAtRole, messageRole, voiceRole;
    for (let data of joinedAtRoles.sort((x, y) => y.duration-x.duration)) {
        if ((Date.now()-joinedAt) >= data.duration) {
            joinedAtRole = data.role;
            break;
        };
    };

    for (let data of messageRoles.sort((x, y) => y.count-x.count)) {
        if (message >= data.count) {
            messageRole = data.role;
            break;
        };
    };

    for (let data of voiceRoles.sort((x, y) => y.duration-x.duration)) {
        if (voice >= data.duration) {
            voiceRole = data.role;
            break;
        };
    };

    let memberRoles = member.roles.cache.map(r => r.id);
    let joinedAtRoless = joinedAtRoles.filter(x => x.role !== joinedAtRole).map(x => x.role);
    let messageRoless = messageRoles.filter(x => x.role !== messageRole);
    let voiceRoless = voiceRoles.filter(x => x.role !== voiceRole);
    memberRoles = memberRoles.filter(x => !joinedAtRoless.includes(x) && !messageRoless.includes(x) && !voiceRoless.includes(x));
    if (!memberRoles.includes(joinedAtRole)) memberRoles.push(joinedAtRole);
    if (!memberRoles.includes(messageRole)) memberRoles.push(messageRole);
    if (!memberRoles.includes(voiceRole)) memberRoles.push(voiceRole);
    member.roles.set(memberRoles);
};