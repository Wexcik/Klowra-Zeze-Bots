const { MessageEmbed } = require('discord.js');
const StatsModel = require('../Models/MemberStats.js');

module.exports.execute = async (client, message, args, ayar, emoji) => {
    if (!client.kullanabilir(message.author.id) && !ayar.sponsorID.some(role => message.member.roles.cache.has(role)) && !message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.enAltYetkiliRolu).rawPosition <= rol.rawPosition)) return message.react(`${client.emojis.cache.find(x => x.name === "zezeiptal")}`);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let embed = new MessageEmbed().setColor(client.randomColor()).setImage().setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }));
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!user) return message.lineReply("Ses bilgisine bakmak istediğin kullanıcıyı düzgünce belirt ve tekrar dene!")
    if (!user.voice.channel) return message.lineReply("<@" + user.id + "> bir ses kanalına bağlı değil.")
    let data = await StatsModel.findOne({ userID: user.id })
    let mic = user.voice.selfMute == true ? "Kapalı" : "Açık"
    let hop = user.voice.selfDeaf == true ? "Kapalı" : "Açık"
    await message.lineReply(embed.setDescription(`${user} kişisi <#${user.voice.channel.id}> kanalında. **Mikrofonu: ${mic}, Kulaklığı: ${hop}**
**Kişinin en son girdiği kanal: ${data.lastChannel ? message.guild.channels.cache.get(data.lastChannel) : 'YOK!'}, Kişinin kanala son giriş tarihi: ${data.lastTime ? new Date(data.lastTime).toTurkishFormatDate() : 'YOK!'}, Ne kadar süredir seste? => ${data.lastTime ? client.convertDuration(Date.now() - data.lastTime) : 'YOK!'}**
Kanala gitmek için [tıklaman](${await user.voice.channel.createInvite({maxAge: 10 * 60 * 1000, maxUses: 1 },)}) yeterli!`));
};

module.exports.configuration = {
    name: 'ses-bilgi',
    aliases: ['ses-kanalı', 'sesbilgi', 'n', 'nerdesin'],
    usage: 'ses-bilgi @üye',
    description: 'Belirtilen üyenin ses kanalında olup olmadığını söyler.',
    permLevel: 0
};