const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (!client.kullanabilir(message.author.id) && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipyedek)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.splice(1).join(" ");
    if (banLimitleri.get(message.author.id) >= ayar.banLimit && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.reply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
    if (!uye || !reason) return message.lineReply(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
    let roller = uye.roles.cache.map(x => x.id);
    let adı = uye.displayName
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.lineReply(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({ timeout: 5000 }));
    let cezaNumara = await client.cezaNumara();
    await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.jailRolu, ayar.boosterRolu] : [ayar.jailRolu]).catch(() => {
        return undefined;
    });
    if (uye.voice.channelID) uye.voice.kick().catch();
    message.lineReply(embed.setDescription(`${uye} isimli kullanıcıya ${message.author} tarafından ${message.guild.roles.cache.get(ayar.jailRolu).toString()} rolü verildi! ${reason ? `Sebep: ${reason}` : ''}`)).then(x => x.delete({ timeout: 15000 })).catch();
    client.channels.cache.find(c => c.name === ayar.jailLogKanali).send(new MessageEmbed().setColor('BLUE').setDescription(`Engelleyen: ${message.author} \`(${message.author.id})\`\nEngellenen: ${uye.user.tag} \`(${uye.id})\`\nSebep: ${reason}\nCeza-i İşlem: Jail \`(${cezaNumara})\``)).catch(console.error);
    let newPenalty = new Penalty({
        sunucuID: message.guild.id,
        uyeID: uye.id,
        yetkiliID: message.author.id,
        cezaTuru: "JAIL",
        cezaSebebi: reason,
        atilmaTarihi: Date.now(),
        bitisTarihi: null,
        yetkiler: roller,
        adı: adı

    });
    newPenalty.save()
    uye.setNickname(`${ayar.ikinciTag} Mahkum`)
    message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`).catch();
    banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) + 1);
    setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
    }, 1000 * 60 * 3);
};
module.exports.configuration = {
    name: "jail",
    aliases: ['cezalandır','cezalı', 'ceza'],
    usage: "jail [üye] [sebep]",
    description: "Belirtilen üyeyi jaile atar.",
    permLevel: 6
};