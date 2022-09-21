const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, ayar,emoji) => {
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(ayar.durum).setColor(client.randomColor()).setTimestamp();

    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!role || !args[1]) return message.lineReply("`Rol belirttikten sonra seste olmayanlara gönderilecek mesajı belirtin!`");
    let members = role.members.array();
    let sesteOlmayanlar = members.filter(member => !member.voice.channelID);
    sesteOlmayanlar.forEach(a => a.send(args.slice(1).join(' ')+("\n"+"discord.gg/"+message.guild.vanityURLCode || ayar.davet)).catch(() => undefined))
  
    let sesteOlanlar = members.filter(member => member.voice.channel);
    message.lineReply("Rol: " + role.name + " | " + role.id + " | " + role.members.size , { code: "xl", split: true });
    message.lineReply(sesteOlmayanlar.map((x) => x.toString()).join(', '), { code: 'xl', split: { char: ', ' } });
    client.splitEmbedWithDesc(`**🟢 Seste Olan Yetkililer**\n\n${sesteOlanlar.map(member => `${member}`).join(", ")}`,
                           {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
                           {setColor: ["2f3136"]}).then(list => {
    list.forEach(item => {
      message.lineReply(item)
    });
  });
   // message.lineReply((role.members.size < 1 ? "Bu rolde hiç üye yok!" : members.map((x) => x.toString()).slice(0, members.length / 2).join(',')))
    //message.lineReply((role.members.size < 1 ? "" : members.map((x) => x.toString()).slice(members.length / 2).join(',')))

};
module.exports.configuration = {
    name: 'role-info',
    aliases: [],
    usage: 'role-info',
    description: 'Yetkili yoklaması.',
    permLevel: 2
};