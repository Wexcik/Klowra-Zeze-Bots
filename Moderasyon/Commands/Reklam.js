/* eslint-disable linebreak-style */
const { MessageEmbed } = require('discord.js');
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("ff0013");
    if (!client.kullanabilir(message.author.id) && !ayar.reklamciRolu.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (banLimitleri.get(message.author.id) >= ayar.reklam) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``).then(x => x.delete({ timeout: 10000 }));
    if (!uye) return global.send(message.channel, embed.setDescription('Geçerli bir üye ve sebep belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    //  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.lineReply(embed.setDescription('Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!')).then(x => x.delete({timeout: 5000}));
    if (uye.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) return message.lineReply('`Yetkililer birbirlerini jaile atamazlar.`').then(x => x.delete({ timeout: 5000 }));

    let cezaNumara = await client.cezaNumara();
    await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.reklamRolu, ayar.boosterRolu] : [ayar.reklamRolu]).catch(() => {
        return undefined;
    });
    if (uye.voice.channelID) uye.voice.kick().catch();
    uye.setNickname(`${ayar.ikinciTag} Reklamcı`)
    message.lineReply(embed.setDescription(`${uye} isimli kullanıcıya ${message.author} tarafından ${message.guild.roles.cache.get(ayar.reklamRolu).toString()} rolü verildi!`)).then(x => x.delete({ timeout: 15000 })).catch();
    client.channels.cache.find(c => c.name === ayar.reklamLogKanali).send(new MessageEmbed().setColor('BLUE').setDescription(`Engelleyen: ${message.author} \`(${message.author.id})\`\nEngellenen: ${uye.user.tag} \`(${uye.id})\`\nCeza-i İşlem: Reklam \`(${cezaNumara})\``)).catch(console.error);
    message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`)
    
    let newPenalty = new Penalty({
        sunucuID: message.guild.id,
        uyeID: uye.id,
        yetkiliID: message.author.id,
        cezaTuru: 'REKLAM',
        cezaSebebi: "REKLAM",
        atilmaTarihi: Date.now(),
        bitisTarihi: null,
    });
    newPenalty.save();
    if (message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) return;
    banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) + 1);
    setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
    }, 1000 * 60 * 3);
};


module.exports.configuration = {
    name: 'reklam',
    aliases: ['req'],
    usage: 'reklam [üye]',
    description: 'Belirtilen üyeyi reklam sebepli jaile atar.',
};