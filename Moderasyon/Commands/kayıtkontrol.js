const { MessageEmbed } = require('discord.js');
const Member = require('../Models/Member.js');

module.exports.execute = async (client, message, args, ayar, emoji) => {
    const embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  
    if (!member) return message.lineReply(embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    Member.findOne({ guildID: message.guild.id, userID: member.user.id }, async (err, variables) => {
        if (err) return console.log(err)
        if (!variables.staffID) message.lineReply(embed.setDescription('Bu kullanıcıyı kayıt eden yetkili bulunamadı.')).then(x => x.delete({ timeout: 5000 }));
        let staff = await client.users.fetch(variables.staffID)
        if (!staff) message.lineReply(embed.setDescription('Bu kullanıcıyı kayıt eden yetkili bulunamadı.')).then(x => x.delete({ timeout: 5000 }));
        return message.lineReply(`Bu kullanıcıyı kayıt eden yetkili: ${staff} \`${staff.id}\``);
    })
};

module.exports.configuration = {
    name: 'kayıt-kontrol',
    aliases: ["kayıtkontrol"],
    usage: 'kayıt-kontrol [üye]',
    description: 'Kayıt kontrol.',
    permLevel: 0
};