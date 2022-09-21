const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, ayar) => {
  if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "zezeiptal")}`);
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  
  let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
  let user = client.users.cache.get(victim.id)
  let avatar = user.avatarURL({ dynamic: true, size: 2048 });
  let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(user.tag, avatar)
    .setDescription(`[Resim Adresi](${avatar})`)
    .setImage(avatar)
    message.lineReply(embed).then(x => x.delete({ timeout: 15000 })).catch(console.error);
  message.react(`${client.emojis.cache.find(c => c.name === "klowratik")}`)
};
module.exports.configuration = {
  name: "avatar",
  aliases: ["pp","av"],
  usage: "avatar etiket",
  description: "kullanıcının profil resmini gösterir.",
  permLevel: 0
};