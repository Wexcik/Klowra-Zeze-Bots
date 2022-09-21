const { MessageEmbed } = require('discord.js');
var banLimitleri = new Map();
module.exports.execute = (client, message, args, ayar, emoji) => {
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (banLimitleri.get(message.author.id) >= ayar.kayıtsız && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
    if (!client.kullanabilir(message.author.id) && !ayar.sahipRolu.some(r => message.member.roles.cache.has(r))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (!uye) return message.lineReply(embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    if (uye.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) return message.lineReply('`Yetkili birini kayıtsıza atamazsın.`');
    if (uye.manageable) uye.setNickname(`${ayar.ikinciTag} İsim | Yaş`).catch(() => {
        return undefined;
    });
    let rols = ayar.teyitsizRolleri;
    if (uye.roles.cache.has(ayar.boosterRolu)) rols = ayar.teyitsizRolleri.concat(ayar.boosterRolu);
    uye.roles.set(rols).catch(() => {
        return undefined;
    });
    message.lineReply(embed.setDescription(`${uye} üyesi, ${message.author} tarafından kayıtsız olarak ayarlandı!`)).catch(() => {
        return undefined;
    });
    const logChannel = client.channels.cache.find(c => c.name === ayar.kayıtsızlog); 
    if (logChannel) logChannel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından kayıtsız olarak ayarlandı!`))
    if (message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) return;
    banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) + 1);
    setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
    }, 1000 * 60 * 3);
};
module.exports.configuration = {
    name: 'kayıtsız',
    aliases: [],
    usage: 'kayıtsız [üye]',
    description: 'Belirtilen üyeyi kayıtsıza atar.',
    permLevel: 3
};
