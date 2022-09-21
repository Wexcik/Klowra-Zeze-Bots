const { MessageEmbed } = require('discord.js');
const Penalty = require('../Models/Penalty.js');
const moment = require('moment');
const ms = require('ms');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("ff0013");
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (!client.kullanabilir(message.author.id) && !ayar.sesMuteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.lineReply( embed.setDescription('`Yeterli Yetkin Bulunmamakta.`')).then(x => x.delete({ timeout: 5000 }));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!uye) return message.lineReply(embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    if (banLimitleri.get(message.author.id) >= ayar.mutelimit) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
    if (message.member.roles.highest.position <= uye.roles.highest.position && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(embed.setDescription('Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!')).then(x => x.delete({ timeout: 5000 }));
    let sure = args[1];
    let reason = args.splice(2).join(' ');
    if (!sure || !ms(sure) || !reason) return message.lineReply(embed.setDescription('Geçerli bir süre (1s/1m/1h/1d) ve sebep belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    const cezaNumara = await client.cezaNumara();
    const atilisTarihi = Date.now();
    const bitisTarihi = Date.now() + ms(sure);
    await message.react(`${client.emojis.cache.find(x => x.name === "chatmute")}`);
    await message.react(`${client.emojis.cache.find(x => x.name === "sesmute")}`);
    const filter = (reaction, user) => {
        return ["chatmute", "sesmute"].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    const collector = message.createReactionCollector(filter, { max: 1, time: 30000, error: ['time'] });
    collector.on('collect', async (reaction) => {
        if (reaction.emoji.name == "chatmute") {

            if (!client.kullanabilir(message.author.id) && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.lineReply(embed.setDescription('`Ne yazık ki chat mute atabilecek yetkiye sahip değilsin ancak ses mute atabilirisin`')).then(x => x.delete({ timeout: 10000 }));
            let newPenalty = new Penalty({
                sunucuID: message.guild.id,
                uyeID: uye.id,
                yetkiliID: message.author.id,
                cezaTuru: 'CHAT-MUTE',
                cezaSebebi: reason,
                atilmaTarihi: atilisTarihi,
                bitisTarihi: bitisTarihi,
            });
            uye.roles.add(ayar.muteRolu).catch(console.error);
            message.lineReply(embed.setDescription(`${uye} \`(${moment.duration(ms(sure)).format('D [gün,] H [saat,] m [dakika]')})\` dakika boyunca ${reason} sebebiyle chat kanallarında susturuldu!`)).catch(console.error);
            client.channels.cache.find(c => c.name === ayar.muteLogKanali).send(new MessageEmbed().setColor('f39c12').setDescription(`Engelleyen : ${message.author} \`(${message.author.id})\`\nEngellenen: ${uye} \`(${uye.id})\`\nSebep: ${reason}\nSüre: ${new Date(bitisTarihi).toTurkishFormatDate()} \`(${moment.duration(ms(sure)).format('D [gün,] H [saat,] m [dakika]')})\`\nCeza-i İşlem: Chat Mute \`(${cezaNumara})\``)).catch(console.error);
            
            newPenalty.save();
        } else if (reaction.emoji.name == "sesmute") {
            let newPenalty = new Penalty({
                sunucuID: message.guild.id,
                uyeID: uye.id,
                yetkiliID: message.author.id,
                cezaTuru: 'VOICE-MUTE',
                cezaSebebi: reason,
                atilmaTarihi: atilisTarihi,
                bitisTarihi: bitisTarihi,
            });
            message.lineReply(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${moment.duration(ms(sure)).format('D [gün,] H [saat,] m [dakika]')}** boyunca **${reason}** nedeniyle seste mutelendi!`)).catch();
            client.channels.cache.find(c => c.name === ayar.sesMuteLogKanali).send(new MessageEmbed().setColor('f39c12').setDescription(`Engelleyen : ${message.author} \`(${message.author.id})\`\nEngellenen: ${uye} \`(${uye.id})\`\nSebep: ${reason}\nSüre: ${new Date(bitisTarihi).toTurkishFormatDate()} \`(${moment.duration(ms(sure)).format('D [gün,] H [saat,] m [dakika]')})\`\nCeza-i İşlem: Ses Mute \`(${cezaNumara})\``)).catch(console.error);
            if (uye.manageable && !uye.displayName.includes('[ Muted ]')) uye.setNickname(`[ Muted ] ${uye.displayName}`).catch(() => { return undefined; });
            if (uye.voice.channelID) uye.voice.setMute(true).catch(console.error);
            newPenalty.save();
        }
        
    });
    setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
    }, 1000 * 60 * 3);

    collector.on('end', async () => {
        await message.reactions.removeAll();
        message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`);
        if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
            banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
        }
                collector.on('error', () => message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`));
    });
};
module.exports.configuration = {
    name: 'mute',
    aliases: ['ses-mute', 'sesmute', 'voice-mute', 'sestesustur', 'vmute', 'mute', 'cmute', 'chat-mute'],
    usage: 'sesmute/mute [üye] [süre] [sebep]',
    description: 'Belirtilen üyeyi seste belirtilen süre kadar muteler.',
    permLevel: 0
};