const { MessageEmbed } = require('discord.js');
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('GREEN');
    if (!args[0] || isNaN(args[0])) return message.lineReply(embed.setDescription('Geçerli bir kişi ID\'si belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    if (!ayar.bansorumlusu.some(r => message.member.roles.cache.has(r)) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply("Ban/Jail sorumlularına ulaşmalısın!").then(x => x.delete({ timeout: 5000 }));
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (banLimitleri.get(message.author.id) >= ayar.unban && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
    let kisi = await client.users.fetch(args[0]);
    if (kisi) {
        message.guild.members.unban(kisi.id).catch(() => message.lineReply(embed.setDescription('Belirtilen ID numarasına sahip bir ban bulunamadı!')).then(x => x.delete({ timeout: 5000 })));
        message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`).catch(() => {
            return undefined;
        });
        if (client.channels.cache.find(c => c.name === ayar.banLogKanali)) client.channels.cache.find(c => c.name === ayar.banLogKanali).send(new MessageEmbed().setColor('WHITE').setTitle('Ban Kaldırıldı!').setDescription(`**Kaldıran Yetkili:** ${message.author} (\`${message.author.id}\`)\n**Banı Kaldırılan Üye:** ${kisi.tag} (\`${kisi.id}\`)`));
    } else {
        message.lineReply(embed.setDescription('Geçerli bir kişi ID\'si belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    }
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
    }
        setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
    }, 1000 * 60 * 3);
};

module.exports.configuration = {
    name: 'unyargı',
    aliases: ['yasak-kaldır'],
    usage: 'unyargı [id] [isterseniz sebep]',
    description: 'Belirtilen kişinin banını kaldırır.',
    permLevel: 0
};