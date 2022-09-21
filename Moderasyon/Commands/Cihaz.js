const { MessageEmbed } = require("discord.js");

module.exports.execute = (client, message, args, ayar, emoji) => {
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  if (message.member.roles.highest.position < message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) return message.lineReply("Bu komutu kullanabilmek için yetkili olmalısın!").then(x => x.delete({timeout: 5000}));
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(client.randomColor()).setTimestamp();
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
  if (member.presence.status === "offline") return message.lineReply(embed.setDescription(`${member} üyesi çevrim dışı!`));
  let clientStatus = member.presence.clientStatus;
  message.lineReply(embed.setDescription(`${member} üyesinin şu anki cihazları;\n\n${Object.keys(member.presence.clientStatus).map(c => `\`•\` ${c.replace("desktop", "Masaüstü Uygulaması").replace("mobile", "Mobil Cihaz").replace("web", "İnternet Tarayıcısı")} (${clientStatus[c].replace("online", "Çevrim içi").replace("dnd", "Rahatsız etmeyin").replace("idle", "Boşta")})`).join("\n")}`));
};
  
module.exports.configuration = {
  name: "cihaz",
  aliases: ["user-client"],
  usage: "cihaz @üye",
  description: "Belirtilen üyeynin cihazlarını gösterir.",
  permLevel: 0
};