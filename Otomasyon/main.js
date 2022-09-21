const { Client, MessageEmbed, Intents, Collection } = require('discord.js');
const client = global.client = new Client();
const sunucuAyar = global.sunucuAyar = require("../sunucuAyar.js");
const Cezapuan = require('./Models/cezapuanı.js');
const mongoose = require('mongoose');
mongoose.connect(sunucuAyar.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
moment.locale('tr');
const fs = require("fs");


global.client = client;
fs.readdir(__dirname + "/Events", (err, files) => {
  if (err) return console.error(err);
  files.filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Events/${file}`);
    if (!prop.configuration) return;
    client.on(prop.configuration.name, prop);
  });
});
const logs = require('discord-logs');
const { log } = require('console');
logs(client);

var CronJob = require('cron').CronJob;
var resetStats = new CronJob('00 00 00 * * 1', async function () {
  let guild = client.guilds.cache.get(sunucuAyar.sunucuID);
  let ekipRol = guild.roles.cache.get(sunucuAyar.enAltYetkiliRolu);
  guild.members.cache.filter(x => x.roles.cache.filter(rol => ekipRol.rawPosition <= rol.rawPosition)).array().forEach(async (x, index) => {
    let data = await Cezapuan.findOne({ guildID: x.guild.id, userID: x.id })
    if(!data) { data = Cezapuan.create({ guildID: x.guild.id, userID: x.id })}
    data.puan = 100;
    data.save();
  });
}, null, true, 'Europe/Istanbul');
resetStats.start();

Date.prototype.toTurkishFormatDate = function () {
  return moment.tz(this, "Europe/Istanbul").format('LLL');
};

client.convertDuration = (date) => {
  return moment.duration(date).format('H [saat,] m [dakika]');
};

client.tarihHesapla = (date) => {
  return moment(date).fromNow();
};

client.wait = async function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
};

client.ayarlar = {
  "prefix": [".", "!", "f!", "d!", "-",">p","*p"],
  "sunucuId": sunucuAyar.sunucuID,
  "mesaj_silme_log": "mesaj_silme_log",
  "mesaj_edit_log": "mesaj_edit_log",
  "komut_log": "komut_log",
  "ses_mic_log": "ses_mic_log",
  "ses_log": "ses_log",
  "ses_log_basit": "ses_log_basit",
  "join_leave_log": "join_leave_log",
  "join_leave_log_basit": "join_leave_log_basit",
  "nickname_log": "nickname_log",
  "nickname_log_basit": "nickname_log_basit",
  "rol_log_basit": "rol_log_basit",
  "rol_log": "rol_log",
  "footer": sunucuAyar.durum
}
const conf = client.ayarlar
global.conf = conf;

client.on("guildMemberRoleAdd", async (member, role) => {
  const Log = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());
  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(conf.footer)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} üyesine **${role.name}** rolü eklendi\n\n\`\`\`Rol Veren: ${Log.executor.tag}\nRol: ${role.name} (${role.id})\nKullanıcı: ${member.user.tag} (${member.user.id})\nRol Eklenme: ${moment(Date.now()).locale("tr").format("LLL")}\`\`\``)
    client.channels.cache.find(c => c.name === conf.rol_log).send(embed)
client.channels.cache.find(c => c.name === conf.rol_log_basit).send(`:key: ${member.user.tag} (\`${member.user.id}\`) üyesine \`${role.name}\` rolü eklendi.`)

});

client.on("guildMemberRoleRemove", async (member, role) => {
  const Log = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());

  let embed = new MessageEmbed()
    .setColor("RED")
    .setTimestamp()
    .setFooter(conf.footer)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} üyesinin **${role.name}** rolü kaldırıldı\n\n\`\`\`Rol Kaldıran: ${Log.executor.tag}\nRol: ${role.name} (${role.id})\nKullanıcı: ${member.user.tag} (${member.user.id})\nRol Eklenme: ${moment(Date.now()).locale("tr").format("LLL")}\`\`\``)
    client.channels.cache.find(c => c.name === conf.rol_log).send(embed)
    client.channels.cache.find(c => c.name === conf.rol_log_basit).send(`:wastebasket: ${member.user.tag} (\`${member.user.id}\`) üyesinden \`${role.name}\` rolü kaldırıldı.`)

});

client.on("guildMemberUpdate", async function (oldMember, newMember) {
  const logg = await newMember.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_UPDATE" }).then(audit => audit.entries.first());
  if (oldMember.displayName === newMember.displayName) return;
  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(conf.footer)
    .setThumbnail(newMember.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(newMember.user.tag, newMember.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${newMember} üyesinin sunucu içi ismi değiştirildi.

Nick Değişimi:
Önce: ${oldMember.displayName}
Sonra: ${newMember.displayName}
Değiştiren Kişi: <@${logg.executor.id}>

\`\`\`Kullanıcı: ${newMember.user.tag} (${newMember.user.id})\nDeğişim Tarihi: ${moment(Date.now()).locale("tr").format("LLL")}\`\`\``)


  client.channels.cache.find(c => c.name === conf.nickname_log).send(embed)
  client.channels.cache.find(c => c.name === conf.nickname_log_basit).send(`:file_folder: ${newMember.user.tag} (\`${newMember.user.id}\`) üyesinin sunucu içi ismi değişti. Değiştiren Kişi: ${logg.executor.tag} \`${oldMember.displayName}\` **>** \`${newMember.displayName}\``).catch(() => {});
});


client.on("guildMemberAdd", async (member) => {
  let embed = new MessageEmbed()
    .setColor("GREEN")
    .setTimestamp()
    .setFooter(conf.footer)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} sunucuya katıldı.\n\nHesap Kurulma: ${moment(member.user.createdTimestamp).locale("tr").format("LLL")}\n\n\`\`\`Kullanıcı: ${member.user.tag} (${member.user.id})\nSunucuya Katılma: ${moment(member.joinedAt).locale("tr").format("LLL")}\`\`\``)
  client.channels.cache.find(c => c.name === conf.join_leave_log).send(embed)
  client.channels.cache.find(c => c.name === conf.join_leave_log_basit).send(`:inbox_tray: ${member.user.tag} (\`${member.id}\`) katıldı. \`${member.guild.memberCount}\` kişi olduk.`);
})
client.on("guildMemberRemove", async (member) => {
  let embed = new MessageEmbed()
    .setColor("RED")
    .setTimestamp()
    .setFooter(conf.footer)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true
    }))
    .setAuthor(member.user.tag, member.user.avatarURL({
      dynamic: true
    }))
    .setDescription(`${member} sunucudan ayrıldı.\n\nHesap Kurulma: ${moment(member.user.createdTimestamp).locale("tr").format("LLL")}\n\n\`\`\`Kullanıcı: ${member.user.tag} (${member.user.id})\nSunucuya Katılma: ${moment(member.joinedAt).locale("tr").format("LLL")}\`\`\`\nSunucudan ayrıldığında ki rolleri:\n${member.roles.cache.filter(rol => rol.name != "@everyone").map(x => x).join(",")}`)
    client.channels.cache.find(c => c.name === conf.join_leave_log).send(embed)
    client.channels.cache.find(c => c.name === conf.join_leave_log_basit).send(`:outbox_tray: ${member.user.tag} (\`${member.id}\`) ayrıldı. \`${member.guild.memberCount}\` kişi olduk.`);
})
client.on("guildMemberUpdate", async (oldMember, newMember) => {

  // ROL EKLEME BASİT

})

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (conf.ses_log_basit && client.channels.cache.find(c => c.name === conf.ses_log_basit)) {
    let oldChannel = oldState.channel;
    let newChannel = newState.channel;



    let logKanali = client.channels.cache.find(c => c.name === conf.ses_log_basit);
    let logKanali2 = client.channels.cache.find(c => c.name === conf.ses_log);
    let logKanali3 = client.channels.cache.find(c => c.name === conf.ses_mic_log); 
    if (!oldState.channelID && newState.channelID) {
      let kanalGiris = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalına giriş yaptı.

Kanala Girdiği Anda:
Mikrofonu: **${newState.mute == true ? "Kapalı" : "Açık"}**
Kulaklığı: **${newState.deaf == true ? "Kapalı" : "Açık"}**

\`\`\`Girdiği Kanal: #${newChannel.name} (${newChannel.id}) \nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Girdiği Kanalda Bulunan Üyeler:
${newChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`) == 0 ? "Üye Yoktur" : newChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}
`)
      logKanali2.send(kanalGiris)
      return logKanali.send(`:telephone: ${newState.member.user.tag} (\`${newState.id}\`) üyesi **${newChannel.name}** kanalına giriş yaptı.`).catch(() => {});
    }



    if (oldState.channelID && !newState.channelID) {

      let kanalCikis = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${oldChannel}** kanalından ayrıldı.

Kanaldan Çıktığı Anda:
Mikrofonu: **${newState.mute == true ? "Kapalı" : "Açık"}**
Kulaklığı: **${newState.deaf == true ? "Kapalı" : "Açık"}**

\`\`\`Çıktığı Kanal: #${oldChannel.name} (${oldChannel.id}) \nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(oldChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Çıktığı Kanalda Bulunan Üyeler:
${oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`) == 0 ? "Üye Yoktur" : oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}
`)

      logKanali2.send(kanalCikis)
      return logKanali.send(`:telephone: ${newState.member.user.tag} (\`${newState.member.user.id}\`) üyesi **${oldChannel.name}** kanalından ayrıldı.`).catch(() => {});
    }

    if (oldState.channelID && newState.channelID && oldState.channelID != newState.channelID) {
      let kanalDegisme = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${oldChannel}** kanalından **${newChannel}** kanalına geçiş yaptı.

Kanal Değiştirdiği Anda:
Mikrofonu: **${newState.mute == true ? "Kapalı" : "Açık"}**
Kulaklığı: **${newState.deaf == true ? "Kapalı" : "Açık"}**

\`\`\`Eski Kanal: #${oldChannel.name} (${oldChannel.id})\nYeni Kanal: #${newChannel.name} (${newChannel.id}) \nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Eski Kanalında Bulunan Üyeler:
${oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`) == 0 ? "Üye Yoktur" : oldChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}

Yeni Kanalında Bulunan Üyeler:
${newChannel.members.map(x => `\`${x.displayName}\` [${client.users.cache.get(x.id).tag}]`).join("\n")}
`)
      logKanali2.send(kanalDegisme)
      return logKanali.send(`:telephone: ${newState.member.user.tag} üyesi **${oldChannel.name}** kanalından **${newChannel.name}** kanalına geçiş yaptı`).catch(() => {});
    }


    if (oldState.channelID && !oldState.selfDeaf && newState.selfDeaf) {
      let embed = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında kendini sağırlaştırdı.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)
      return logKanali3.send(embed).catch(() => {});
    }

    if (oldState.channelID && oldState.selfDeaf && !newState.selfDeaf) {
      let embed = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında kendi sağırlaştırmasını kaldırdı.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)
      return logKanali3.send(embed).catch(() => {});
    }

    if (oldState.channelID && oldState.selfMute && !newState.selfMute) {

      let embed = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında susturmasını kaldırdı.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)

      return logKanali3.send(embed).catch(() => {});
    }
    if (oldState.channelID && !oldState.selfMute && newState.selfMute) {
      let embed = new MessageEmbed()
        .setAuthor(newState.member.user.tag, newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(newState.member.user.displayAvatarURL({
          dynamic: true
        }))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(conf.footer)
        .setDescription(`
${newState.member} üyesi **${newChannel}** kanalında kendini susturdu.

\`\`\`Bulunduğu Kanal: #${newChannel.name} (${newChannel.id})\nKullanıcı: ${client.users.cache.get(newState.id).tag} (${newState.id})\nEylem Gerçekleşme: ${moment(newChannel.join.createdTimestamp).locale("tr").format("LLL")}\`\`\`

Kanalında Bulunan Üyeler:

${newChannel.members.map(x => `<@${x.id}> [${client.users.cache.get(x.id).tag}]`).join("\n")}

`)
      return logKanali3.send(embed).catch(() => {});
    }







  };
});


client.on("messageDelete", async (message) => {
  if (message.author.bot) return;
  let embed = new MessageEmbed()
    .setThumbnail(message.author.avatarURL({
      dynamic: true
    }))
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(conf.footer)
    .setAuthor(message.author.tag, message.author.avatarURL({
      dynamic: true
    }))
    .setDescription(`
${message.author} üyesi ${message.channel} kanalında mesajını sildi.

**__Silinen Mesaj:__**
${message.content.length > 0 ? message.content : "Silinen mesaj yoktur"}

**__Silinen Mesajdaki Resimler:__**
${ message.attachments.size > 0 ? message.attachments.filter(({ proxyURL }) => /\.(gif|jpe?g|png|webp)$/i.test(proxyURL)).map(({ proxyURL }) => proxyURL) : "Silinen resim yoktur"}

\`\`\`Kanal: #${message.channel.name} (${message.channel.id})\nKullanıcı: ${message.author.tag} (${message.author.id})\nMesaj ID: ${message.id}\nMesaj Atılma: ${moment(message.createdTimestamp).locale("tr").format("LLL")}\`\`\`
`)
  client.channels.cache.find(c => c.name === conf.mesaj_silme_log).send(embed)
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot) return;
  let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter(conf.footer)
    .setAuthor(newMessage.author.tag, newMessage.author.avatarURL({
      dynamic: true
    }))
    .setDescription(`
${newMessage.author} üyesi ${newMessage.channel} kanalında bir mesajı düzenledi.

**__Düzenlenmeden Önce:__**
${oldMessage.content}
**__Düzenlendikten Sonra:__**
${newMessage.content}

\`\`\`Kanal: #${newMessage.channel.name} (${newMessage.channel.id})\nKullanıcı: ${newMessage.author.tag} (${newMessage.author.id})\nMesaj ID: ${newMessage.id}\nMesaj Atılma: ${moment(newMessage.createdTimestamp).locale("tr").format("LLL")}\`\`\`
`)
  client.channels.cache.find(c => c.name === conf.mesaj_edit_log).send(embed)
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  const prefixes = conf.prefix;
  let prefix = prefixes.filter(p => message.content.startsWith(p))[0];
  if (!prefix) return;
  let yazilanKomut = message.content.split(" ")[0];
  yazilanKomut = yazilanKomut.slice(prefix.length);
  if (!yazilanKomut) return;
  client.channels.cache.find(c => c.name === conf.komut_log).send(`:wrench: **${message.author.tag}** (\`${message.author.id}\`) üyesi ${message.channel} kanalında bir komut kullandı: \`${prefix+yazilanKomut}\``)
})
const webhooks = {};
global.getWebhook = (id) => webhooks[id];
global.send = async (channel, content, options) => {
  if (webhooks[channel.id]) return (await webhooks[channel.id].send(content, options));

  let webhookss = await channel.fetchWebhooks();
  let wh = webhookss.find(e => e.name == client.user.username),
    result;
  if (!wh) {
    wh = await channel.createWebhook(client.user.username, {
      avatar: client.user.avatarURL()
    });
    webhooks[channel.id] = wh;
    result = await wh.send(content, options);
  } else {
    webhooks[channel.id] = wh;
    result = await wh.send(content, options);
  }
  return result;
};
client.login(sunucuAyar.inviteToken).then(x => console.log(`Bot ${client.user.tag} olarak giriş yaptı!`)).catch(err => console.error(`Bot giriş yapamadı | Hata: ${err}`));