const { MessageEmbed } = require("discord.js");
const Note = require("../Models/Note.js");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  if (!message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has(ayar.boosterRolu)) return message.lineReply(`Bu özelliği kullanabilmek için sunucumuzu boostluyor olman gerekiyor.`).then(x => x.delete({timeout: 5000}));;
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!uye) return message.lineReply("Üzerine not alınacak üyeyi belirtmelisin!");
  if (!args[1] || !["al", "ekle", "add", "sil", "delete", "remove", "düzenle", "edit", "update", "liste", "list", "görüntüle", "view"].includes(args[1])) return message.reply(`Doğru Kullanım: \`${this.configuration.usage}\``).then(x => x.delete({timeout: 10000}));
  if (args[1] === "al" || args[1] === "ekle" || args[1] === "add") {
    let params = args.slice(2).join(' ').split(" - ");
    let title = params[0];
    let content = params[1];
    let link = params[2] || "Yok!";
    let usage = `\`${this.configuration.name} al [baslik] - [icerik] - [link (isteğe bağlı)]\``;
    if (!title || client.chatKoruma(title)) return message.lineReply("Geçerli bir not **başlığı** belirtmelisin!\n"+usage).then(x => x.delete({timeout: 15000}));
    if (!content || client.chatKoruma(content)) return message.lineReply("Geçerli bir not **içeriği** belirtmelisin!\n"+usage).then(x => x.delete({timeout: 15000}));
    if (client.chatKoruma(link)) return message.lineReply("Geçerli bir not **bağlantısı** belirtmelisin!\n"+usage).then(x => x.delete({timeout: 15000}));
    let newNote = new Note({
      guildID: message.guild.id,
      userID: message.author.id,
      updateAt: Date.now(),
      title: title,
      content: content,
      link: link
    });
    newNote.save();
    return message.reply("Notun başarıyla kaydedildi!");
  };
  let authorNotes = await Note.find({ userID: message.author.id }) || [];
  if (args[1] === "liste" || args[1] === "list") {
    if (!authorNotes.length) return message.lineReply("Kayıtlı notun bulunamadı!");
    return client.splitEmbedWithDesc(`**Kayıtlı Notların;**\n\n${authorNotes.map((note, index) => `\`${index}.\` ${note.title}`).join('\n')}`,
        {name: message.author.tag, icon: message.author.avatarURL({dynamic: true})},
        {name: `${authorNotes.length} adet notun bulunuyor!`, icon: false},
        {setColor: [client.randomColor()]}).then(list => {
      list.forEach(item => {
        message.lineReply(item);
      });
    });
  };
  if (args[1] === "sil" || args[1] === "delete" || args[1] === "remove") {
    if (!authorNotes.length) return message.lineReply("Kayıtlı notun bulunamadı!");
    if (args[2] === "hepsi" || args[2] === "tüm" || args[2] === "all") {
      authorNotes.forEach(async x => await Note.findByIdAndDelete(x._id));
      message.reply("Tüm notların silindi!");
    } else {
      if (!args[2] || isNaN(args[2])) return message.reply("Geçerli bir not numarası belirtmelisin! Notlarını görüntülemek için; `not liste` yazabilirsin.\nTüm notlarını silmek için `not sil hepsi` yazabilirsin.").then(x => x.delete({timeout: 10000}));
      if (!authorNotes[Number(args[2])]) return message.reply("Belirtilen numaralı not bulunamadı!").then(x => x.delete({timeout: 10000}));
      Note.findByIdAndDelete(authorNotes[Number(args[2])]._id).then(x => message.reply(`**${args[2]}** numaralı notun silindi!`)).catch(err => message.reply(`**${args[2]}** numaralı notun silinemedi!`));
    };
    return;
  };
  if (!args[2] || isNaN(args[2])) return message.reply("Geçerli bir not numarası belirtmelisin! Notlarını görüntülemek için; `not liste` yazabilirsin.").then(x => x.delete({timeout: 10000}));
  if (!authorNotes[Number(args[2])]) return message.lineReply("Belirtilen numaralı not bulunamadı!").then(x => x.delete({timeout: 10000}));
  if (args[1] === "görüntüle" || args[1] === "view") return client.splitEmbedWithDesc(`*\`${args[2]}\` numaralı notun;*\n\n\`Başlık:\` **${authorNotes[Number(args[2])].title}**\n\`İçerik:\` ${authorNotes[Number(args[2])].content}\n\`Bağlantı:\` ${authorNotes[Number(args[2])].link}`,
      {name: message.author.tag, icon: message.author.avatarURL({dynamic: true})},
      {name: `Güncellenme Tarihi: ${new Date(authorNotes[Number(args[2])].updateAt).toTurkishFormatDate()}`, icon: false},
      {setColor: [client.randomColor()]}).then(list => {
    list.forEach(item => {
      message.lineReply(item);
    });
  });
  if (args[1] === "düzenle" || args[1] === "edit" || args[1] === "update") {
    if (!["baslik", "başlık", "title", "icerik", "içerik", "content", "link", "baglanti", "bağlantı"].includes(args[3])) return message.lineReply("Düzenlenecek not öğesini belirtmelisin! (başlık/içerik/link)").then(x => x.delete({timeout: 10000}));
    let newData = args.slice(4).join(' ');
    if (!newData || !newData.length || newData.length < 3 || client.chatKoruma(newData)) return message.lineReply("Belirtilen öğenin düzenlenecek halini belirtmelisin!").then(x => x.delete({timeout: 5000}));
    if (["baslik", "başlık", "title"].includes(args[3])) {
      authorNotes[Number(args[2])].title = newData;
    };
    if (["icerik", "içerik", "content"].includes(args[3])) {
      authorNotes[Number(args[2])].content = newData;
    };
    if (["link", "baglanti", "bağlantı"].includes(args[3])) {
      authorNotes[Number(args[2])].link = newData;
    };
    authorNotes[Number(args[2])].updateAt = Date.now();
    authorNotes[Number(args[2])].save();
    return message.lineReply(`**${args[2]}** numaralı notunun belirtilen öğesi güncellendi!`);
  };
};
module.exports.configuration = {
    name: "not",
    aliases: ["note"],
    usage: "not @üye al/sil/düzenle/liste/görüntüle",
    description: "Not sistemi.",
    permLevel: 0
};
