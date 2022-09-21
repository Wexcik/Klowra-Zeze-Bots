const MemberStats = require('../Models/MemberStats.js');
const Member = require('../Models/Member.js');
const Inviter = require('../Models/Inviter.js');

module.exports.execute = async(client, message, args) => {
    if(!client.kullanabilir(message.author.id)) return message.lineReply('Bu komutu kullanabilmek için gerekli rollere sahip değilsin!').then(x => x.delete({timeout: 5000}));
    if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.lineReply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }))
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(x => x.name === args.slice(0).join(' '));
    if (!rol) return message.lineReply('Geçerli bir rol belirtmelisin!').then(x => x.delete({ timeout: 5000 }));
    let mesaj = await message.lineReply('Veriler kontrol ediliyor...');
    let uyeler = rol.members.array();
    let sonuc = `**\`${rol.name}\` adlı rolün üyelerinin detaylı verileri (Özel stat verileri gösterilmektedir, elle sıfırlamadığınız sürece gitmez.);**\n\n`;
    for (var i = 0; i < uyeler.length; i++) {
        let uye = uyeler[i];
        let veri = await memberData(uye.id, client);
        sonuc += veri;
    }
    setTimeout(() => {
        mesaj.delete();
        message.lineReply(sonuc, {split: true});
    }, 5000);
};

module.exports.configuration = {
    name: 'yetkili-stat15',
    aliases: ['yetkilistat15', 'yetkili-stats15'],
    usage: 'yetkili-stat2',
    description: 'Belirtilen roldeki üyelerin statslarını gösterir.',
    permLevel: 0
};

async function memberData(userID, client) {
    let guild = client.guilds.cache.get(global.sunucuAyar.sunucuID);
    if (!guild) return;
    let memberStats = await MemberStats.findOne({ guildID: guild.id, userID: userID }) || { voiceStats15: new Map(), chatStats15: new Map() };
    let staffData = await Member.findOne({ guildID: guild.id, userID: userID }) || { yetkili: new Map() };
    let inviteData = await Inviter.find({ guildID: guild.id, inviterID: userID });
    inviteData = inviteData.filter(invite => guild.members.cache.has(invite.userID) && Date.now()-guild.members.cache.get(invite.userID).user.createdTimestamp > 1000*60*60*24*7);
    let toplamTeyit = Number(staffData.yetkili.get('erkekTeyit') || 0)+Number(staffData.yetkili.get('kizTeyit') || 0);
    let haftalikSesToplam = 0;
    memberStats.voiceStats15.forEach(x => haftalikSesToplam += x);
    let haftalikSesListe = '';
    memberStats.voiceStats15.forEach((value, key) => haftalikSesListe += `${guild.channels.cache.has(key) ? guild.channels.cache.get(key).name : 'Bilinmeyen'}: **${client.convertDuration(value)}**\n`);
    let haftalikChatToplam = 0;
    memberStats.chatStats15.forEach(x => haftalikChatToplam += x);
    let haftalikChatListe = '';
    memberStats.chatStats15.forEach((value, key) => haftalikChatListe += `${guild.channels.cache.has(key) ? guild.channels.cache.get(key).name : 'Bilinmeyen'}: **${value} mesaj**\n`);
    let haftalikInvite = inviteData.filter(invite => Date.now()-guild.members.cache.get(invite.userID).joinedTimestamp < 1000*60*60*24*15);
    let haftalikTagliInvite = haftalikInvite.filter(invite => guild.members.cache.get(invite.userID).user.username.includes(global.sunucuAyar.tag));
    let sonuc = `${guild.members.cache.get(userID).toString()} üyesinin istatistikleri;\n\`•\` **${inviteData.length}** genel davet, **${inviteData.filter(invite => guild.members.cache.get(invite.userID).user.username.includes(global.sunucuAyar.tag)).length}** genel taglı davet, **${haftalikInvite.length}** 15 günlük davet, **${haftalikTagliInvite.length}** 15 günlük taglı davet verisi bulunmakta!\n\`•\` **${toplamTeyit}** adet toplam teyit verisi bulunmakta!\n\`•\` Genel Toplam Ses: **${client.convertDuration(memberStats.totalVoiceStats || 0)}**\n\`•\` Genel Toplam Chat: **${memberStats.totalChatStats || 0} mesaj**\n\n\`# Haftalık;\`\n\`•\` Toplam Ses: **${client.convertDuration(haftalikSesToplam)}**\n${haftalikSesListe}\n\`•\` Toplam Chat: **${haftalikChatToplam} mesaj**\n${haftalikChatListe}\n─────────────────\n`;
    return sonuc;
}