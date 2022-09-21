const { table } = require('table');
const MemberStats = require('../Models/MemberStats.js');
const Inviter = require('../Models/Inviter.js');

module.exports.execute = async(client, message, args, ayar) => {
    if(!client.kullanabilir(message.author.id)) return message.lineReply('bu komutu kullanabilmek için gerekli rollere sahip değilsin!').then(x => x.delete({timeout: 5000}));
    if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.lineReply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }))
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(x => x.name === args.slice(1).join(' '));
    if (!['haftalık', 'haftalik', 'genel', 'tüm'].includes(args[0])) return message.lineReply('Hangi verilere bakacağını belirtmelisin! (haftalık/genel)');
    if (!rol) return message.lineReply('Geçerli bir rol belirtmelisin!').then(x => x.delete(5000));
    let mesaj = await message.lineReply('Veriler kontrol ediliyor...');
    let uyeler = rol.members.array();
  
    let sonuc = [
        ['YETKILI', 'DAVET', 'TDAVET', 'CHAT', 'SES']
    ];
    for (var i = 0; i < uyeler.length; i++) {
        let uye = uyeler[i];
        MemberStats.findOne({guildID: message.guild.id, userID: uye.id}, (err, staffData) => {
            Inviter.find({guildID: message.guild.id, inviterID: uye.id}).exec(async(err, invitedMembers) => {
                invitedMembers = invitedMembers.filter(invite => message.guild.members.cache.has(invite.userID) && Date.now()-message.guild.members.cache.get(invite.userID).user.createdTimestamp > 1000*60*60*24*7);
                if (!staffData) staffData = {
                    voiceStats: new Map(),
                    chatStats: new Map()
                };
                if (args[0] === 'haftalık' || args[0] === 'haftalik') {
                    let haftalikSesToplam = 0;
                    staffData.voiceStats.forEach(x => haftalikSesToplam += x);
                    let haftalikChatToplam = 0;
                    staffData.chatStats.forEach(x => haftalikChatToplam += x);
                    let haftalikInvite = invitedMembers.filter(invite => Date.now()-message.guild.members.cache.get(invite.userID).joinedTimestamp < 1000*60*60*24*7);
                    let haftalikTagliInvite = haftalikInvite.filter(invite => message.guild.members.cache.get(invite.userID).user.username.includes(ayar.tag));
                    sonuc.push(new Array(`${uye.id}\n${uye.displayName}`, `${haftalikInvite.length}`, `${haftalikTagliInvite.length}`, `${haftalikChatToplam} mesaj`, `${client.convertDuration(haftalikSesToplam)}`));
                }

                if (args[0] === 'genel' || args[0] === 'tüm') {
                    let sesToplam = staffData.totalVoiceStats || 0;
                    let chatToplam = staffData.totalChatStats || 0;
                    let invite = invitedMembers;
                    let tagliInvite = invitedMembers.filter(invite => message.guild.members.cache.get(invite.userID).user.username.includes(ayar.tag));
                    sonuc.push(new Array(`${uye.id}\n${uye.displayName}`, `${invite.length}`, `${tagliInvite.length}`, `${chatToplam} mesaj`, `${client.convertDuration(sesToplam)}`));
                }
            });
        });
    }
    setTimeout(() => {
        mesaj.delete();
        message.lineReply(table(sonuc), {split: true, code: 'xl'});
    }, 5000);
};

module.exports.configuration = {
    name: 'yetkili-stat',
    aliases: ['yetkilistat', 'yetkili-stats'],
    usage: 'yetkili-stat',
    description: 'Yetkililerin statslarını gösterir.',
    permLevel: 0
};