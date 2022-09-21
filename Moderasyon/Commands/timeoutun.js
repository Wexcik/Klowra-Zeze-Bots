const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
const moment = require('moment');
const ms = require("ms")
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("ff0013");
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (!ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id) && !ayar.timeoutçular.some(rol => message.member.roles.cache.has(rol))) return message.lineReply( embed.setDescription('`Yeterli Yetkin Bulunmamakta.`')).then(x => x.delete({ timeout: 5000 }));
    if (banLimitleri.get(message.author.id) >= ayar.mutelimit) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]); 
	if (!member) return message.lineReply("Üye belirtmedin!").then(x => x.delete({ timeout: 5000 }));
    if (message.member.roles.highest.position <= member.roles.highest.position && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(embed.setDescription('Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!')).then(x => x.delete({ timeout: 5000 }))
    if (!member.bannable) return message.lineReply('Belirttiğin kişi benden üstte ya da aynı roldeyim!')
    
    try {
        require("axios")({
            method: "patch",
            url: `https://discord.com/api/v9/guilds/${ayar.sunucuID}/members/${member.id}`,
            data: { communication_disabled_until: null },
            headers: { authorization: `Bot ${client.token}` }
        });
    } catch (err) {
        return;
    }

    message.lineReply(embed.setDescription(`${member} üyesinin, ${message.author} tarafından zaman aşımı kaldırıldı!`)).catch(console.error);
    client.channels.cache.find(c => c.name === ayar.sesMuteLogKanali).send(new MessageEmbed().setColor('GREEN').setDescription(`Zaman aşımını kaldıran: ${message.author} \`(${message.author.id})\`\nZaman aşımı kalkan: ${member} \`(${member.user.tag})\`\nCeza-i İşlem: Zaman aşımı`)).catch(console.error);
    Penalty.find({ sunucuID: message.guild.id, uyeID: member.id }).sort({ atilmaTarihi: -1 }).exec(async (err, data) => {
        let cezalar = data.filter(d => (d.cezaTuru === "TIMEOUT") && (!d.bitisTarihi || d.bitisTarihi > Date.now()))
        if (!cezalar.length) return message.lineReply("Kullanıcıya bot ile zaman aşımı atılmamış, sağtık ile atılan zaman aşımı kaldırıldı.").then(x => x.delete({timeout: 75000}))
        cezalar.forEach(async d => {
            d.bitisTarihi = Date.now();
            d.save();

            if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
                banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
            }
                                setTimeout(() => {
                banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
            }, 1000 * 60 * 3);
    let yetkili = await client.users.fetch(cezalar[0].yetkiliID)
    if (cezalar[0].yetkiliID === message.author.id) return
    await yetkili.send(`${message.author} yetkilisi ${member}'ye attığın **Zaman Aşımını** kaldırdı.`).catch(err => undefined);
});
});
}
module.exports.configuration = {
	name: 'untimeout',
    aliases: [],
	usage: 'untimeout [üye] [süre] [sebep]',
	description: 'Belirtilen üyeye timeout atar.',
	permLevel: 0
};