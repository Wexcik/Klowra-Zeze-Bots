const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    if (!uye) return message.lineReply(embed.setDescription('Ses odana çekilecek üyeyi belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    if (!message.member.voice.channelID || !uye.voice.channelID || message.member.voice.channelID == uye.voice.channelID) return message.lineReply(embed.setDescription('Belirtilen üyenin ve kendinin ses kanalında olduğundan emin ol!')).then(x => x.delete({ timeout: 5000 }));    
    if (client.kullanabilir(message.author.id) || ayar.transport.some(r => message.member.roles.cache.has(r))) {
        await uye.voice.setChannel(message.member.voice.channelID).catch(() => {
            return undefined;
        });
        message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`);
    } else {
        
        const reactionFilter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === uye.id;
        message.lineReply(`${uye}`, { embed: embed.setAuthor(uye.displayName, uye.user.avatarURL({ dynamic: true, size: 2048 })).setDescription(`${message.author} seni ses kanalına çekmek için izin istiyor! Onaylıyor musun?`) }).then(async msj => {
            await msj.react('✅');
            msj.awaitReactions(reactionFilter, { max: 1, time: 15000, error: ['time'] }).then(c => {
                let cevap = c.first();
                if (cevap) {
                    if (uye.voice.channelID) uye.voice.setChannel(message.member.voice.channelID).catch(() => {
                        return undefined;
                    });
                    msj.delete().catch(() => {
                        return undefined;
                    });
                    message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`);
                }
            }).catch(() => msj.delete());
        });
    }
};
module.exports.configuration = {
    name: 'çek',
    aliases: ['move', 'taşı', 'cek'],
    usage: 'çek [üye]',
    description: 'Belirtilen üyeyi ses kanalınıza çekmeyi sağlar.',
    permLevel: 0
};