const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    let everyone = message.guild.roles.cache.find(a => a.name === '@everyone');
    let permObjesi = {};
    let everPermleri = message.channel.permissionOverwrites.get(everyone.id);
    everPermleri.allow.toArray().forEach(p => {
        permObjesi[p] = true;
    });
    everPermleri.deny.toArray().forEach(p => {
        permObjesi[p] = false;
    });
    if (message.channel.permissionsFor(everyone).has('SEND_MESSAGES')) {
        permObjesi['SEND_MESSAGES'] = false;
        message.channel.createOverwrite(everyone, permObjesi);
        message.lineReply(embed.setDescription('Kanal kilitlendi!'));
    } else {
        permObjesi['SEND_MESSAGES'] = null;
        message.channel.createOverwrite(everyone, permObjesi);
        message.lineReply(embed.setDescription('Kanal kilidi açıldı!'));
    }
};
module.exports.configuration = {
    name: 'kilit',
    aliases: ['lock'],
    usage: 'kilit',
    description: 'Komutun kullanıldığı chat kanalını kilitler.',
    permLevel: 2
};