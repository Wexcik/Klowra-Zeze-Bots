const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("2ecc71");
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  let uye = await client.users.fetch(args[0]);
  if (!args[0]) return message.lineReply(embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
  if (banLimitleri.get(message.author.id) >= ayar.unjail) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
  Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).exec((err, data) => {
    data.filter(d => (d.cezaTuru === "FORCEBAN") && (!d.bitisTarihi || d.bitisTarihi > Date.now())).forEach(d => {
      d.bitisTarihi = Date.now();
      d.save();
    });
  });
  await message.guild.members.unban(uye.id).catch();
  message.lineReply("`Forceban Kaldırıldı`").catch();
  if (client.channels.cache.find(c => c.name === ayar.banLogKanali)) client.channels.cache.find(c => c.name === ayar.banLogKanali).send(new MessageEmbed().setColor('ecf0f1').setTitle('Ban Kaldırıldı!').setDescription(`**Kaldıran Yetkili:** ${message.author} (${message.author.id})\n**Banı Kaldırılan Üye:** ${uye.tag} (${uye.id})`));
};
module.exports.configuration = {
  name: "unforce",
  aliases: [],
  usage: "unforce [üye]",
  description: "Belirtilen üyeyi jailden çıkarır.",
  permLevel: 1
};