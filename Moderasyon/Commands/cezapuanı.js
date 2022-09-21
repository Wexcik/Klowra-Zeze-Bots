const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();
const Puan = require('../Models/cezapuanı.js');
const Yetkili = require('../Models/cezapuanyetkili.js');

module.exports.execute = async (client, message, args, ayar, ) => {
    let ekipRol = message.guild.roles.cache.get(ayar.enAltYetkiliRolu);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(client.randomColor()).setTimestamp();
    if(!ayar.soruncozucu.some(r => message.member.roles.cache.has(r)) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    let zaman = Date.now()
    let sayı = Number(args[2])
    if(!args[0]) return message.lineReply('Bir argüman belirtmelisin. ÖRN: \`bilgi\`,\`ekle\`,\`sil\`')
    if(!uye) return message.lineReply('Bir üye belirtmedin!').then(x => x.delete({timeout: 5000}))
    if(!uye.roles.cache.filter(rol => ekipRol.rawPosition <= rol.rawPosition)) return message.lineReply('İstediğin kişi yetkili değil.').then(x => x.delete({timeout: 5000}))
    let data = await Puan.findOne({ guildID: message.guild.id , userID: uye.id })
    if(!data) { 
      data = await Puan.create({guildID: message.guild.id, userID: uye.id})
    }
    let puan = data.puan;

    if(args[0] === 'bilgi') message.lineReply(embed.setDescription(`${uye} kişisinin \`cezapuanı\`: **${data ? puan : '100'}**`))
    if(args[0] === 'ekle'){
      if(!sayı) return message.lineReply('Bir sayı belirtmelisin.').then(x => x.delete({timeout: 5000}))
      if(isNaN(sayı)) return message.lineReply('Geçerli bir sayı belirtmelisin').then(x => x.delete({timeout: 5000}))
      if(puan >= 100) return message.lineReply('Kişinin \`ceza puanı\` max konumda.').then(x => x.delete({timeout: 5000}))
      if(sayı > 100) return message.lineReply('Ekleyeceğiniz puan sayısı 100den fazla olamaz.').then(x => x.delete({timeout: 5000}))
      if(puan+sayı > 100) return message.lineReply('Eklemeye çalıştığınız miktar kişinin ceza puanını 100den yukarıya çıkartıyor!').then(x => x.delete({timeout: 5000}))
      if(puan+sayı < 50) await uye.roles.add(ayar.warningmode);
      if(puan+sayı >= 50) await uye.roles.remove(ayar.warningmode);
      data.puan = (Number(puan) + sayı);
      data.save();
      message.lineReply(embed.setDescription(`${uye} kişisine ${sayı} puan eklendi.\nYeni puanı **${puan+sayı}**`))
      await Yetkili.create({
        guildID: message.guild.id,
        userID: message.author.id,
        targetID: uye.id,
        time: zaman,
        eklenen: sayı
      })
    }
    if(args[0] === 'sil'){
        if(!sayı) return message.lineReply('Bir sayı belirtmelisin.').then(x => x.delete({timeout: 5000}))
        if(isNaN(sayı)) return message.lineReply('Geçerli bir sayı belirtmelisin').then(x => x.delete({timeout: 5000}))
        if(puan <= 0) return message.lineReply('Kişinin \`ceza puanı\` min konumda.').then(x => x.delete({timeout: 5000}))
        if(sayı < 0) return message.lineReply('Ekleyeceğiniz puan sayısı 0dan az ya da 0a eşit olamaz.').then(x => x.delete({timeout: 5000}))
        if(puan-sayı < 0) return message.lineReply('Silmeye çalıştığınız miktar kişinin ceza puanını 0dan aşşağıya indiriyor!').then(x => x.delete({timeout: 5000}))
        if(puan-sayı < 50) await uye.roles.add(ayar.warningmode);
        if(puan-sayı >= 50) await uye.roles.remove(ayar.warningmode);
        data.puan = (Number(puan) - sayı);
        data.save();
        message.lineReply(embed.setDescription(`${uye} kişisinden ${sayı} puan silindi.\nYeni puanı **${puan-sayı}**`))
        await Yetkili.create({
          guildID: message.guild.id,
          userID: message.author.id,
          targetID: uye.id,
          time: zaman,
          silinen: sayı
        })
      }
}

module.exports.configuration = {
    name: "ceza",
    aliases: ["cezapuan","cezapuanı","cp"],
    usage: "cezapuan [etiket/id] ekle/sil [sayı]",
    description: "Belirtilen üyenin Cezapuanı bilgilerini öğrenirsiniz.",
    permLevel: 2
  };