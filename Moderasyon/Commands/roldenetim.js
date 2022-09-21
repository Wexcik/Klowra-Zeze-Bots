const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, ayar,emoji) => {
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!role) return message.lineReply("`Bir rol belirtmelisin.`");
    let members = role.members.array();
    let sesteOlmayanlar = members.filter(member => !member.voice.channelID);  
    let sesteOlanlar = members.filter(member => member.voice.channel);
    message.lineReply("Rol: " + role.name + " | " + role.id + " | " + role.members.size , { code: "xl", split: true });
    message.lineReply(sesteOlmayanlar.map((x) => x.toString()).join(', '), { code: 'xl', split: { char: ', ' } });

    client.splitEmbedWithDesc(`**🟢 Seste Olan Yetkililer**\n\n${sesteOlanlar.map(member => `${member}`).join(", ") ? sesteOlanlar.map(member => `${member}`).join(", ") : 'Bu role sahip olan kimse seste değil.'}`,
                           {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
                           {setColor: ["2f3136"]}).then(list => {
    list.forEach(item => {
      message.lineReply(item)
    });
  });
  };
module.exports.configuration = {
    name: 'rol-denetim',
    aliases: ["roldenetim"],
    usage: 'roldenetim',
    description: 'Yetkili yoklaması.',
    permLevel: 2
};