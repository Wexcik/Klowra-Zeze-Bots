const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, ) => {
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(client.randomColor());
  if(!ayar.ownerRolleri.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

  if(args[0] && args[0].includes('list')) {
    message.guild.fetchBans().then(bans => {
      message.lineReply(`# Sunucudan yasaklanmış kişiler; ⛔\n\n${bans.map(c => `${c.user.id} | ${c.user.tag}`).join("\n")}\n\n# Toplam "${bans.size}" adet yasaklanmış kullanıcı bulunuyor.`, {code: 'xl', split: true});
    });
    return;
  };

  let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let reason = args.splice(1).join(" ");
  if (banLimitleri.get(message.author.id) >= ayar.banLimit && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role))) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``).then(x => x.delete({timeout: 5000}));
  if (!reason) return message.lineReply(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  let cezaNumara = await client.cezaNumara();
  if (!victim) {
    let kisi = await client.users.fetch(args[0]);
    if(kisi) {
      message.guild.members.ban(kisi.id, {reason: reason}).catch();
      if (!message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
      }
      let newPenalty = new Penalty({
        sunucuID: message.guild.id,
        uyeID: kisi.id,
        yetkiliID: message.author.id,
        cezaTuru: "YARGI",
        cezaSebebi: reason,
        atilmaTarihi: Date.now(),
        bitisTarihi: null,
      });
      newPenalty.save();
      message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`).catch();
      if(client.channels.cache.find(c => c.name === ayar.banLogKanali)) client.channels.cache.find(c => c.name === ayar.banLogKanali).send(new MessageEmbed().setColor("e74c3c").setDescription(`${kisi} üyesi sunucudan yasaklandı!\n\n• Ceza ID: \`#${cezaNumara}\`\n• Yasaklanan Üye: ${kisi} (\`${kisi.tag}\` - \`${kisi.id}\`)\n• Yasaklayan Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Yasaklanma Tarihi: \`${new Date().toTurkishFormatDate()}\`\n• Yasaklanma Sebebi: \`${reason}\``)).then(x => x.delete({timeout: 5000}));
    } else {
      message.lineReply(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
    };
    setTimeout(() => {
      banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))-1);
    }, 1000*60*3);
  };

  if(message.member.roles.highest.position <= victim.roles.highest.position) return message.lineReply(embed.setDescription("Banlamaya çalıştığın üye senle aynı yetkide veya senden üstün!")).then(x => x.delete({timeout: 5000}));
  if(!victim.bannable) return message.lineReply(embed.setDescription("Botun yetkisi belirtilen üyeyi banlamaya yetmiyor!")).then(x => x.delete({timeout: 5000}));
  victim.send(embed.setDescription(`${message.author} tarafından **${reason}** sebebiyle sunucudan banlandın.`)).catch();
  victim.ban({reason: reason}).then(x => message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`)).catch();
  banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
  setTimeout(() => {
    banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))-1);
  }, 1000*60*60*1);
  let newPenalty = new Penalty({
    sunucuID: message.guild.id,
    uyeID: victim.id,
    yetkiliID: message.author.id,
    cezaTuru: "YARGI",
    cezaSebebi: reason,
    atilmaTarihi: Date.now(),
    bitisTarihi: null,
  });
  message.lineReply(embed.setImage("https://cdn.discordapp.com/attachments/703393917189750864/730033798632439848/ezgif-2-410cf96579a0.gif").setDescription(`\`${victim.user.tag}\` üyesi ${message.author} tarafından **${reason}** nedeniyle sunucudan **yasaklandı!**`)).then(x => x.delete({timeout: 5000}));
  if(client.channels.cache.find(c => c.name === ayar.banLogKanali)) client.channels.cache.find(c => c.name === ayar.banLogKanali).send(new MessageEmbed().setColor("e74c3c").setDescription(`${victim} üyesi sunucudan **yasaklandı!**\n\n• Ceza ID: \`#${cezaNumara}\`\n• Yasaklanan Üye: ${victim} (\`${victim.user.tag}\` - \`${victim.id}\`)\n• Yasaklayan Yetkili: ${message.author} (\`${message.author.tag}\` - \`${message.author.id}\`)\n• Yasaklanma Tarihi: \`${new Date().toTurkishFormatDate()}\`\n• Yasaklanma Sebebi: \`${reason}\``));
  newPenalty.save();

};
module.exports.configuration = {
  name: "yargı",
  aliases: ["yasakla", "klowrayargı", "klowra"],
  usage: "yargı [üye] [sebep] / liste / bilgi [id]",
  description: "Belirtilen üyeyi sunucudan yasaklar.",
  permLevel: 0
};