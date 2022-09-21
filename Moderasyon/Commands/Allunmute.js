const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (!message.member.voice.channelID) return message.lineReply('lütfen bir ses kanalına giriş yap');
    message.member.voice.channel.members.forEach((member) => member.voice.setMute(false));
    message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`)

};
module.exports.configuration = {
    name: 'allunmute',
    aliases: [],
    usage: 'allunmute',
    description: '',
    permLevel: 2
};