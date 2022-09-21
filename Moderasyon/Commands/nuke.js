const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {
    let channel = message.channel
    await channel.clone({ reason: "Nuke Algılandı" }).then(async kanal => {
        if (channel.parentID != null) await kanal.setParent(channel.parentID, {lockPermissions: false});
        await kanal.setPosition(channel.position);
        if (channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));
    })

    await message.channel.delete()

};
module.exports.configuration = {
    name: 'nuke',
    aliases: [],
    usage: 'nuke',
    description: 'nuke',
    permLevel: 2
};