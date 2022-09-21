const { MessageEmbed } = require('discord.js');
const MemberStats = require('../Models/MemberStats.js');
var banLimitleri = new Map();

module.exports.execute = async(client, message, args,ayar,emoji) => {
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (banLimitleri.get(message.author.id) >= 1) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
    let mesaj = await message.lineReply('Veriler kontrol ediliyor...');
    if(!client.kullanabilir(message.author.id) && !message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.enAltYetkiliRolu).rawPosition <= rol.rawPosition)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const embed = new MessageEmbed().setColor("3f0000").setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true, size: 2048}));
    MemberStats.find({guildID: message.guild.id}).exec((err, data) => {
        data = data.filter(m => message.guild.members.cache.has(m.userID));
        let toplamSesSiralama = data.sort((uye1, uye2) => Number(uye2.totalVoiceStats)-Number(uye1.totalVoiceStats)).slice(0, 5).map((m, index) => `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")} ${message.guild.members.cache.get(m.userID).toString()} \`${client.convertDuration(Number(m.totalVoiceStats))}\``).join('\n');
        let haftalikSesSiralama = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            uye2.voiceStats.forEach(x => uye2Toplam += x);
            let uye1Toplam = 0;
            uye1.voiceStats.forEach(x => uye1Toplam += x);
            return uye2Toplam-uye1Toplam;
        }).slice(0, 5).map((m, index) => {
            let uyeToplam = 0;
            m.voiceStats.forEach(x => uyeToplam += x);
            return `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")} ${message.guild.members.cache.get(m.userID).toString()} \`${client.convertDuration(uyeToplam)}\``;
        }).join('\n');

        let toplamChatSiralama = data.sort((uye1, uye2) => Number(uye2.totalChatStats)-Number(uye1.totalChatStats)).slice(0, 5).map((m, index) => `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")} ${message.guild.members.cache.get(m.userID).toString()} \`${(Number(m.totalChatStats))} mesaj\``).join('\n');
        let haftalikChatSiralama = data.sort((uye1, uye2) => {
            let uye2Toplam = 0;
            uye2.chatStats.forEach(x => uye2Toplam += x);
            let uye1Toplam = 0;
            uye1.chatStats.forEach(x => uye1Toplam += x);
            return uye2Toplam-uye1Toplam;
        }).slice(0, 5).map((m, index) => {
            let uyeToplam = 0;
            m.chatStats.forEach(x => uyeToplam += x);
            return `**|** ${client.emojis.cache.find(x => x.name === "klowrareg")} ${message.guild.members.cache.get(m.userID).toString()} \`${Number(uyeToplam)} mesaj\``;
        }).join('\n');
        embed.setDescription(`${message.guild.name} sunucusunun genel ve haftalık chat-ses istatistikleri;`);
        embed.addField('|-----------------------------------------------------\n| Haftalık Ses Sıralama', haftalikSesSiralama);
        embed.addField('|-----------------------------------------------------\n| Haftalık Chat Sıralama', haftalikChatSiralama);
        embed.addField('|-----------------------------------------------------\n| Genel Ses Sıralama', toplamSesSiralama);
        embed.addField('|-----------------------------------------------------\n| Genel Chat Sıralama', toplamChatSiralama+"**\n|-----------------------------------------------------**");
        setTimeout(() => {
            mesaj.delete();
            message.lineReply(embed);
        }, 3000);
        });
        if (client.kullanabilir(message.author.id)) return 
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
setTimeout(() => {
    banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))-1);
}, 1000*60*3);

};
module.exports.configuration = {
    name: 'top',
    aliases: ['top10'],
    usage: 'top',
    description: 'Top 10 istatistikler.',
    permLevel: 0
};