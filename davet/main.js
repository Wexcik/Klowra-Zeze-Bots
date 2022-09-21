const { Client, MessageEmbed, Intents, Collection, APIMessage } = require('discord.js');
require('discord-inline-reply');
const client = global.client = new Client({ fetchAllMembers: true });
const ayarlar = require('../sunucuAyar.js');
const guildInvites = new Map();
const moment = require('moment');
const haftalikDavet = require("./models/haftalikDavet.js");
const logs = require('discord-logs');
logs(client);
const ms = require("ms");
const mongoose = require('mongoose');
mongoose.connect(ayarlar.mongodb, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const Penalty = require('./models/Penalty.js');
require('moment-duration-format');
require('moment-timezone');
moment.locale('tr');
const RLSchema = mongoose.Schema({
  Id: { type: String, default: null },
  Logs: { type: Array, default: [] }
});
const RLModel = mongoose.model('RolLogs', RLSchema);
const alarmModel = require('./models/alarm.js');

client.on("guildMemberRoleRemove", async (member, role) => {
  const Log = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());
  if (!Log || !Log.executor || Log.executor.bot || Log.createdTimestamp < (Date.now() - 5000) || member.guild.roles.cache.get(role.id).position < member.guild.roles.cache.get(ayarlar.enAltYetkiliRolu).position) return;
  const Data = await RLModel.findOne({ Id: member.id }) || new RLModel({ Id: member.id });
  Data.Logs.push({
    Date: Date.now(),
    Type: "[KALDIRMA]",
    Executor: Log.executor.id,
    Role: role.id
  });
  Data.save();
});
client.on("guildMemberRoleAdd", async (member, role) => {
  const Log = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_ROLE_UPDATE" }).then(audit => audit.entries.first());
  if (!Log || !Log.executor || Log.executor.bot || Log.createdTimestamp < (Date.now() - 5000) || member.guild.roles.cache.get(role.id).position < member.guild.roles.cache.get(ayarlar.enAltYetkiliRolu).position) return;
  const Data = await RLModel.findOne({ Id: member.id }) || new RLModel({ Id: member.id });
  Data.Logs.push({
    Date: Date.now(),
    Type: "[EKLEME]",
    Executor: Log.executor.id,
    Role: role.id
  });
  Data.save()
});
client.on("ready", async () => {
  client.user.setStatus("idle");
  let botVoiceChannel = client.channels.cache.get(ayarlar.botSesKanali);
  if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));
  client.guilds.cache.forEach(guild => {
    guild.fetchInvites().then(invites => guildInvites.set(guild.id, invites)).catch(err => console.log(err));
  });
  setInterval(async () => {
    let alarmlar = await alarmModel.find({ bitis: { $lte: Date.now() } });
    for (let alarm of alarmlar) {
      let uye = client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(alarm.uye);
      if (!uye) continue;
      let embed = new MessageEmbed().setColor("RANDOM").setDescription(alarm.aciklama).setTimestamp();
      uye.send(`**${uye} sana hatırlatmamı istediğin şeyin vakti geldi!**`, { embed: embed }).catch(err => { return undefined });
      let kanal = client.channels.cache.get(alarm.kanal);
      if (kanal) kanal.send(`**${uye} sana hatırlatmamı istediğin şeyin vakti geldi!**`, { embed: embed });
      await alarm.remove();
    };
  }, 10000);
});
client.on("inviteCreate", async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on("inviteDelete", async invite => setTimeout(async () => { guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()); }, 5000));
const Database = require('./models/inviter.js');
client.on("guildMemberAdd", async member => {
  let cachedInvites = guildInvites.get(member.guild.id);
  let newInvites = await member.guild.fetchInvites();
  let usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || cachedInvites.find(inv => !newInvites.has(inv.code)) || { code: member.guild.vanityURLCode, uses: null, inviter: { id: null } };
  let inviter = usedInvite && usedInvite.inviter && usedInvite.inviter.id ? client.users.cache.get(usedInvite.inviter.id) : member.guild.id;
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7 * 24 * 60 * 60 * 1000;
  let inviteChannel = member.guild.channels.cache.find(c => c.name === ayarlar.inviteChannelID);
  await haftalikDavet.findByIdAndUpdate(inviter.id, { $push: { regular: [member.id] }, $pull: { leaves: member.id } }, { upsert: true });
  Database.findOne({ guildID: member.guild.id, userID: member.id }, (err, joinedMember) => {
    if (!joinedMember) {
      let newJoinedMember = new Database({
        _id: new mongoose.Types.ObjectId(),
        guildID: member.guild.id,
        userID: member.id,
        inviterID: inviter.id,
        regular: 0,
        bonus: 0,
        fake: 0
      });
      newJoinedMember.save();
    } else {
      joinedMember.inviterID = inviter.id;
      joinedMember.save();
    };
  });
  if (isMemberFake) {
    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: inviter.id,
          inviterID: null,
          regular: 0,
          bonus: 0,
          fake: 1
        });
        newInviter.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${client.emojis.cache.find(x => x.name === "klowrasupheli")} ${member} (\`${member.id}\`) __Kullanıcısıyla beraber__ \`${member.guild.memberCount}\` __Kişi Olduk.__\n\n${client.emojis.cache.find(x => x.name === "klowrasupheli")} __Davet Eden:__ ${inviter === member.guild.id ? member.guild.name : inviter}\n\n${client.emojis.cache.find(x => x.name === "klowrareg")} Ulaştığı Davet Sayısı:\`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\`\n${client.emojis.cache.find(x => x.name === "klowrasupheli")} __Durum:__ \`Şüpheli⛔\`\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`).catch(err => { });
          member.roles.set([ayarlar.fakeHesapRolu]);
          member.setNickname(`${ayarlar.ikinciTag} Yeni | Hesap`)
          member.guild.channels.cache.find(c => c.name === ayarlar.fakeHesapLogKanali).send(new MessageEmbed().setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true })).setDescription(`${member} üyesi sunucuya katıldı fakat hesabı ${member.client.tarihHesapla(member.user.createdAt)} açıldığı için ${client.guilds.cache.get(ayarlar.sunucuID).roles.cache.get(ayarlar.fakeHesapRolu).toString()} rolü verildi!`));


        });

      } else {
        inviterData.fake++
        inviterData.save().then(x => {
          if (inviteChannel) inviteChannel.send(`${client.emojis.cache.find(x => x.name === "klowrasupheli")} ${member} (\`${member.id}\`) __Kullanıcısıyla beraber__ \`${member.guild.memberCount}\` __Kişi Olduk.__\n\n${client.emojis.cache.find(x => x.name === "klowrasupheli")} __Davet Eden:__ ${inviter === member.guild.id ? member.guild.name : inviter}\n\n${client.emojis.cache.find(x => x.name === "klowrareg")} Ulaştığı Davet Sayısı:\`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\`\n${client.emojis.cache.find(x => x.name === "klowrasupheli")} __Durum:__ \`Şüpheli⛔\`\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`).catch(err => { });
          member.roles.set([ayarlar.fakeHesapRolu]);
          member.setNickname(`${ayarlar.ikinciTag} Yeni | Hesap`)
          member.guild.channels.cache.find(c => c.name === ayarlar.fakeHesapLogKanali).send(new MessageEmbed().setAuthor(member.guild.name, member.guild.iconURL({ dynamic: true })).setDescription(`${member} üyesi sunucuya katıldı fakat hesabı ${member.client.tarihHesapla(member.user.createdAt)} açıldığı için ${client.guilds.cache.get(ayarlar.sunucuID).roles.cache.get(ayarlar.fakeHesapRolu).toString()} rolü verildi!`));


        });
      };
    });
  } else {
    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: inviter.id,
          inviterID: null,
          regular: 1,
          bonus: 0,
          fake: 0
        });
        newInviter.save().then(async x => {

          if (inviteChannel) inviteChannel.send(inviteChannel, `${client.emojis.cache.find(x => x.name === "klowrareg")} ${member} (\`${member.id}\`) __Kullanıcısıyla beraber__ \`${member.guild.memberCount}\` __Kişi Olduk.__\n\n${client.emojis.cache.find(x => x.name === "klowrareg")} __Davet Eden:__ ${inviter === member.guild.id ? member.guild.name : inviter}\n\n${client.emojis.cache.find(x => x.name === "fearlesreg")} __Ulaştığı Davet Sayısı:__\`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\`\n\n${client.emojis.cache.find(x => x.name === "klowrareg")} __Durum:__ \`Başarılı☑️\`\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`).catch(err => { });
          let cezalar = await Penalty.find({ sunucuID: member.guild.id, uyeID: member.id });
          if (cezalar.filter(d => (!d.bitisTarihi || d.bitisTarihi > Date.now()) && (d.cezaTuru === "JAIL" || d.cezaTuru === "REKLAM" || d.cezaTuru === "TEMP-JAIL")).length) {
            member.roles.set([ayarlar.jailRolu]);
          } else if (ayarlar.yasakTaglar.length && ayarlar.yasakTaglar.some(tag => member.user.username.includes(tag))) {
            member.roles.set([ayarlar.yasakTagRolu]);
          } else {
           
            if (ayarlar.teyitsizRolleri.length) member.roles.add(ayarlar.teyitsizRolleri);
            member.setNickname(`${ayarlar.ikinciTag} İsim | Yaş`)
            member.guild.channels.cache.get("813855232098041936").send(`${client.emojis.cache.find(x => x.name === "incident_tag3")}**${member} Aramıza Hoş Geldin! Seninle beraber sunucumuz ${member.guild.memberCount} üye sayısına ulaştı.**\n
${client.emojis.cache.find(x => x.name === "incident_tag3")} Hesabın ${member.user.createdAt.toTurkishFormatDate()} tarihinde (${member.client.tarihHesapla(member.user.createdAt)}) oluşturulmuştur.${client.emojis.cache.find(x => x.name === "incident_ay6")}\n
${ayarlar.tag} Sunucu kurallarımız ${client.channels.cache.find(x => x.name === "rules-incident")} kanalında belirtilmiştir. Kurallara uyulmadığı takdirde gerekli yaptırımlar ${client.channels.cache.find(x => x.name === "ceza-işlem")} kanalında belirtilmiştir. Kayıt olduktan sonra kuralları okuduğunuzu kabul edeceğiz ve içeride yapılacak cezalandırma işlemlerini bunu göz önünde bulundurarak yapacağız. <@&813855226884128829>,<@&813855226444513280>,<@&813855225818775604>,<@&885231620603396126>

${inviter === member.guild.id ? member.guild.name : inviter} Toplam ${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)} davet sayısına ulaştın!`).catch(console.error);
          }
        });
      } else {
        inviterData.regular++;
        inviterData.save().then(async x => {
          if (inviteChannel) inviteChannel.send(`${client.emojis.cache.find(x => x.name === "klowrareg")} ${member} (\`${member.id}\`) __Kullanıcısıyla beraber__ \`${member.guild.memberCount}\` __Kişi Olduk.__\n\n${client.emojis.cache.find(x => x.name === "klowrareg")} __Davet Eden:__ ${inviter === member.guild.id ? member.guild.name : inviter}\n\n${client.emojis.cache.find(x => x.name === "klowrareg")} __Ulaştığı Davet Sayısı:__\`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\`\n\n${client.emojis.cache.find(x => x.name === "klowrareg")} __Durum:__ \`Başarılı☑️\`\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`).catch(err => { });
          let guvenilirlik = Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7;
          let cezalar = await Penalty.find({ sunucuID: member.guild.id, uyeID: member.id });
          if (cezalar.filter(d => (!d.bitisTarihi || d.bitisTarihi > Date.now()) && (d.cezaTuru === "JAIL" || d.cezaTuru === "REKLAM" || d.cezaTuru === "TEMP-JAIL")).length) {
            member.roles.set([ayarlar.jailRolu]);
          } else if (ayarlar.yasakTaglar.length && ayarlar.yasakTaglar.some(tag => member.user.username.includes(tag))) {
            member.roles.set([ayarlar.yasakTagRolu]);
          } else {
            if (ayarlar.teyitsizRolleri.length) member.roles.add(ayarlar.teyitsizRolleri);
            member.setNickname(`${ayarlar.ikinciTag} İsim | Yaş`)
            member.guild.channels.cache.get("813855232098041936").send(`${client.emojis.cache.find(x => x.name === "incident_tag3")}**${member} Aramıza Hoş Geldin! Seninle beraber sunucumuz ${member.guild.memberCount} üye sayısına ulaştı.**\n
${client.emojis.cache.find(x => x.name === "incident_tag3")} Hesabın ${member.user.createdAt.toTurkishFormatDate()} tarihinde (${member.client.tarihHesapla(member.user.createdAt)}) oluşturulmuştur.${client.emojis.cache.find(x => x.name === "incident_ay6")}\n
${ayarlar.tag} Sunucu kurallarımız ${client.channels.cache.find(x => x.name === "rules-incident")} kanalında belirtilmiştir. Kurallara uyulmadığı takdirde gerekli yaptırımlar ${client.channels.cache.find(x => x.name === "ceza-işlem")} kanalında belirtilmiştir. Kayıt olduktan sonra kuralları okuduğunuzu kabul edeceğiz ve içeride yapılacak cezalandırma işlemlerini bunu göz önünde bulundurarak yapacağız. <@&813855226884128829>,<@&813855226444513280>,<@&813855225818775604>,<@&885231620603396126>
${inviter === member.guild.id ? member.guild.name : inviter} Toplam ${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)} davet sayısına ulaştın!`).catch(console.error);
          }
        });
      };
    });
  };
  guildInvites.set(member.guild.id, newInvites);
});

client.on("guildMemberRemove", async member => {
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7 * 24 * 60 * 60 * 1000;
  let inviteChannel = member.guild.channels.cache.find(c => c.name === ayarlar.inviteChannelID);
  Database.findOne({ guildID: member.guild.id, userID: member.id }, async (err, memberData) => {
    if (memberData && memberData.inviterID) {
      let inviter = client.users.cache.get(memberData.inviterID) || { id: member.guild.id };
      await haftalikDavet.findByIdAndUpdate(inviter.id, { $push: { leaves: [member.id] }, $pull: { regular: member.id } }, { upsert: true });
      Database.findOne({ guildID: member.guild.id, userID: memberData.inviterID }, async (err, inviterData) => {
        if (!inviterData) {
          let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 0,
            bonus: 0,
            fake: 0
          });
          newInviter.save();
        } else {
          if (isMemberFake) {
            if (inviterData.fake - 1 >= 0) inviterData.fake--;
          } else {
            if (inviterData.regular - 1 >= 0) inviterData.regular--;
          };
          inviterData.save().then(x => {
            if (inviteChannel) inviteChannel.send(`${client.emojis.cache.find(x => x.name === "klowracikis")} ${member} (\`${member.id}\`) __Belirtilen Üye Sunucudan Ayrıldı__ \`${member.guild.memberCount}\` __Kişi Kaldık__ ${client.emojis.cache.find(x => x.name === "klowracikis")}\n\n${client.emojis.cache.find(x => x.name === "klowraquit")}__Davet Bilgisi:__ ${inviter === member.guild.id ? member.guild.name : inviter}\n\n${client.emojis.cache.find(x => x.name === "klowraquit")}__Kalan Davet Sayısı:__ \`${(x.regular ? x.regular : 0) + (x.bonus ? x.bonus : 0)}\`\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`).catch(err => { });
          });
        };
      });
    } else {
      if (inviteChannel) inviteChannel.send(`${client.emojis.cache.find(x => x.name === "klowracikis")} ${member.user.tag} (\`${member.id}\`) __Belirtilen Üye Sunucudan Ayrıldı__ \`${member.guild.memberCount}\` __Kişi Kaldık__ ${client.emojis.cache.find(x => x.name === "klowracikis")}\n\n${client.emojis.cache.find(x => x.name === "klowraquit")}__Davet Bilgisi:__ \`Davetçi bulunamadı!\`\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`).catch(err => { });

    };
  });
});
client.kullanabilir = function (id) {
  if (client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(id).hasPermission("ADMINISTRATOR") || client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(id).hasPermission("MANAGE_CHANNELS")) return true;
  return false;
};
client.on("message", async message => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayarlar.inviteprefix)) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(ayarlar.inviteprefix.length);

  if (command === "eval" && message.author.id === ayarlar.botOwner) {
    if (!args[0]) return message.lineReply(`Kod belirtilmedi`);
    let code = args.join(' ');

    function clean(text) {
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      return text;
    };
    try {
      var evaled = clean(await eval(code));
      if (evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace("token", "Yasaklı komut").replace(client.token, "Yasaklı komut");
      message.lineReply(`${evaled.replace(client.token, "Yasaklı komut")}`, { code: "js", split: true });
    } catch (err) { message.lineReply(err, { code: "js", split: true }) };
  };

  if (command === "haftalıkdavet" || command === "hedefdavet") {
    if (!client.kullanabilir(message.author.id) && !ayarlar.commandkanali.includes(message.channel.name)) return message.lineReply(ayarlar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let embed = new MessageEmbed().setAuthor(uye.displayName, uye.user.displayAvatarURL({ dynamic: true })).setColor(uye.displayHexColor).setTimestamp();
    let haftalikDavetVerisi = await haftalikDavet.findById(uye.id) || { regular: [], leaves: [] };
    message.lineReply(embed.setDescription(`Toplam **${haftalikDavetVerisi.regular ? haftalikDavetVerisi.regular.length : 0}** davete sahip! (**${haftalikDavetVerisi.leaves ? haftalikDavetVerisi.leaves.length : 0}** ayrılan)`));
  };

  if (command === "davet" || command === "info" || command === "invites") {
    if (!client.kullanabilir(message.author.id) && !ayarlar.commandkanali.includes(message.channel.name)) return message.lineReply(ayarlar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let embed = new MessageEmbed().setAuthor(uye.displayName, uye.user.displayAvatarURL({ dynamic: true })).setColor(uye.displayHexColor).setTimestamp();
    Database.findOne({ guildID: message.guild.id, userID: uye.id }, (err, inviterData) => {
      if (!inviterData) {
        embed.setDescription(`Davet bilgileri bulunmamaktadır!`);
        message.lineReply(embed);
      } else {
        Database.find({ guildID: message.guild.id, inviterID: uye.id }).sort().exec((err, inviterMembers) => {
          inviterMembers = inviterMembers.filter(x => message.guild.members.cache.has(x.userID));
          let dailyInvites = 0;
          if (inviterMembers.length) {
            dailyInvites = inviterMembers.filter(x => (Date.now() - message.guild.members.cache.get(x.userID).joinedTimestamp) < 1000 * 60 * 60 * 24).length;
          };
          embed.setDescription(`Toplam **${inviterData.regular + inviterData.bonus}** davete sahip! (**${inviterData.regular}** gerçek, **${inviterData.bonus}** bonus, **${inviterData.fake}** fake, **${dailyInvites}** günlük)`);
          message.lineReply(embed);
        });
      };
    });
  };
  if (command === 'rollog' || command === 'rol-log') {
    if (!client.kullanabilir(message.author.id) && !ayarlar.commandkanali.includes(message.channel.name)) return message.lineReply(ayarlar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }))
    if (message.member.roles.highest.position < message.guild.roles.cache.get(ayarlar.enAltYetkiliRolu).position) return;
    const user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.fetch(args[0]);
    if (!user) return message.lineReply(`${message.author}, lütfen bir üye belirt.`);
    const data = await RLModel.findOne({ Id: user.id });
    let embed = new MessageEmbed().setAuthor(user.tag, user.displayAvatarURL({ dynamic: true })).setTimestamp();
    const liste = data ? data.Logs.map((res) => `\`[${moment(res.Date).format("DD/MM hh:mm")}, ${res.Type}]\` <@${res.Executor}>: ${message.guild.roles.cache.get(res.Role) ? message.guild.roles.cache.get(res.Role) : `**${res.Role.toUpperCase()}**`}`).reverse() : "Veri bulunamadı.";
    let page = 1;
    const msg = await message.lineReply(embed.setAuthor(user.tag, user.avatarURL({ dynamic: true })).setDescription(`${data ? liste.slice(page == 1 ? 0 : page * 9 - 9, page * 9).join("\n") : liste}`));

    if (liste.length > 9) {
      await msg.react("◀");
      await msg.react("▶");

      let collector = msg.createReactionCollector((react, user) => ["◀", "▶"].some(e => e == react.emoji.name) && user.id == message.member.id, { time: 200000 });

      collector.on("collect", async (react) => {
        await react.users.remove(message.author.id).catch(() => undefined);
        if (react.emoji.name == "▶") {
          if (liste.slice((page + 1) * 9 - 9, (page + 1) * 9).length <= 0) return;
          page += 1;
          let newList = liste.slice(page == 1 ? 0 : page * 9 - 9, page * 9).join("\n");
          msg.edit(embed.setAuthor(user.tag, user.avatarURL({ dynamic: true })).setDescription(`${newList}`));
        }
        if (react.emoji.name == "◀") {
          if (liste.slice((page - 1) * 9 - 9, (page - 1) * 9).length <= 0) return;
          page -= 1;
          let newList = liste.slice(page == 1 ? 0 : page * 9 - 9, page * 9).join("\n");
          msg.edit(embed.setAuthor(user.tag, user.avatarURL({ dynamic: true })).setDescription(`${newList}`));
        }
      });
    }
  }
  if (command === "alarım" || command === "alarm") {
    let sure = args[0] ? ms(args[0]) : undefined;
    if (!sure) return message.lineReply("Geçerli bir süre belirtmelisin! (1s/1m/1h/1d)").then(x => x.delete({ timeout: 5000 }));
    if (!args[1]) return message.lineReply("Hatırlatmamı istediğin şeyi belirtmelisin!").then(x => x.delete({ timeout: 5000 }));
    let baslangic = Date.now();
    let yeniAlarm = new alarmModel({
      uye: message.author.id,
      kanal: message.channel.id,
      baslangic: baslangic,
      bitis: baslangic + sure,
      aciklama: args.slice(1).join(" ")
    });
    yeniAlarm.save();
    message.lineReply("Alarım Kuruldu.").then(x => x.delete({ timeout: 10000 }));
  };

  if (command === "haftalık-sıfırla" || command === "haftalıksıfırla") {
    if (!ayarlar.sahipRolu.some(r => message.member.roles.cache.has(r))) return;
    await haftalikDavet.deleteMany();
    message.lineReply("Haftalık davetler başarıyla sıfırlandı!");
  };

  if (command === "bonus") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let sayi = args[1];
    if (!uye || !sayi) return message.lineReply(`Geçerli bir üye ve sayı belirtmelisin! (${ayarlar.inviteprefix}bonus @üye +10/-10)`);
    Database.findOne({ guildID: message.guild.id, userID: uye.id }, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: message.guild.id,
          userID: uye.id,
          inviterID: null,
          regular: 0,
          bonus: sayi,
          fake: 0
        });
        newInviter.save().then(x => message.lineReply(`Belirtilen üyenin bonus daveti **${sayi}** olarak ayarlandı!`));
      } else {
        eval(`inviterData.bonus = inviterData.bonus+${Number(sayi)}`);
        inviterData.save().then(x => message.lineReply(`Belirtilen üyenin bonus davetine **${sayi}** eklendi!`));
      };
    });
  };

  if (command === "üyeler" || command === "members") {
    if (!client.kullanabilir(message.author.id) && !ayarlar.commandkanali.includes(message.channel.name)) return message.lineReply(ayarlar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }))
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let embed = new MessageEmbed().setColor(uye.displayHexColor).setAuthor(uye.displayName + " Üyeleri", uye.user.displayAvatarURL({ dynamic: true })).setFooter(message.member.displayName + " tarafından istendi!", message.author.displayAvatarURL({ dynamic: true })).setThumbnail().setFooter(`${client.users.cache.get(ayarlar.botOwner).tag} was here!`);
    let currentPage = 1;
    Database.find({ guildID: message.guild.id, inviterID: uye.id }).sort([["descending"]]).exec(async (err, pageArray) => {
      pageArray = pageArray.filter(x => message.guild.members.cache.has(x.userID));
      if (err) console.log(err);
      if (!pageArray.length) {
        Database.findOne({ guildID: message.guild.id, userID: uye.id }, async (err, uyeData) => {
          if (!uyeData) uyeData = { inviterID: null };
          let inviterUye = client.users.cache.get(uyeData.inviterID) || { id: message.guild.id };
          message.lineReply(embed.setDescription(`${uye} üyesini davet eden: ${inviterUye.id == message.guild.id ? message.guild.name : inviterUye.toString()}\n\nDavet ettiği üye bulunamadı!`));
        });
      } else {
        let pages = pageArray.chunk(10);
        if (!pages.length || !pages[currentPage - 1].length) return message.lineReply("Davet ettiği üye bulunamadı!");
        let msg = await message.lineReply(embed);
        let reactions = ["◀", "❌", "▶"];
        for (let reaction of reactions) await msg.react(reaction);
        Database.findOne({ guildID: message.guild.id, userID: uye.id }, async (err, uyeData) => {
          let inviterUye = client.users.cache.get(uyeData.inviterID) || { id: message.guild.id };
          if (msg) await msg.edit(embed.setDescription(`${uye} üyesini davet eden: ${inviterUye.id == message.guild.id ? message.guild.name : inviterUye.toString()}\n\n${pages[currentPage - 1].map((kisi, index) => { let kisiUye = message.guild.members.cache.get(kisi.userID); return `\`${index + 1}.\` ${kisiUye.toString()} | ${client.tarihHesapla(kisiUye.joinedAt)}`; }).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`)).catch(err => { });
        });
        const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id,
          { time: 20000 }),
          x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id,
            { time: 20000 }),
          go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id,
            { time: 20000 });
        back.on("collect", async reaction => {
          await reaction.users.remove(message.author.id).catch(err => { });
          if (currentPage == 1) return;
          currentPage--;
          if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => { let kisiUye = message.guild.members.cache.get(kisi.userID); return `\`${index + 1}.\` ${kisiUye.toString()} | ${client.tarihHesapla(kisiUye.joinedAt)}`; }).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`)).catch(err => { });
        });

        go.on("collect", async reaction => {
          await reaction.users.remove(message.author.id).catch(err => { });
          if (currentPage == pages.length) return;
          currentPage++;
          if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => { let kisiUye = message.guild.members.cache.get(kisi.userID); return `\`${index + 1}.\` ${kisiUye.toString()} | ${client.tarihHesapla(kisiUye.joinedAt)}`; }).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`));
        });

        x.on("collect", async reaction => {
          await back.stop();
          await go.stop();
          await x.stop();
          if (message) message.delete().catch(err => { });
          if (msg) return msg.delete().catch(err => { });
        });
        back.on("end", async () => {
          await back.stop();
          await go.stop();
          await x.stop();
          if (message) message.delete().catch(err => { });
          if (msg) return msg.delete().catch(err => { });
        });
      };
    });
  };

  if (command === "topdavet" || command === "topsıralama") {
    if (!client.kullanabilir(message.author.id) && !ayarlar.commandkanali.includes(message.channel.name)) return message.lineReply(ayarlar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }))
    let mesaj = await message.lineReply('Veriler kontrol ediliyor...');
    let embed = new MessageEmbed().setColor(message.member.displayHexColor).setAuthor("Davet Sıralaması", message.guild.iconURL({ dynamic: true })).setFooter(message.member.displayName + " tarafından istendi!", message.author.displayAvatarURL({ dynamic: true })).setThumbnail().setFooter(`${client.users.cache.get(ayarlar.botOwner).tag} was here!`);
    let currentPage = 1;
    Database.find({ guildID: message.guild.id }).sort().exec(async (err, pageArray) => {
      pageArray = pageArray.filter(x => message.guild.members.cache.has(x.userID)).sort((uye1, uye2) => ((uye2.regular ? uye2.regular : 0) + (uye2.bonus ? uye2.bonus : 0)) - ((uye1.regular ? uye1.regular : 0) + (uye1.bonus ? uye1.bonus : 0)));
      if (err) console.log(err);
      if (!pageArray.length) {
        mesaj.delete()
        message.lineReply(embed.setDescription("Davet verisi bulunamadı!"));

      } else {
        let pages = pageArray.chunk(10);
        if (!pages.length || !pages[currentPage - 1].length) return message.lineReply("Daveti olan üye bulunamadı!");
        setTimeout(() => {
          mesaj.delete();
        }, 5000);
        let msg = await message.lineReply(embed);
        let reactions = ["◀", "❌", "▶"];
        for (let reaction of reactions) await msg.react(reaction);
        if (msg) await msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => `\`${index + 1}.\` ${message.guild.members.cache.get(kisi.userID).toString()} | **${kisi.regular + kisi.bonus}** davet`).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`));
        const back = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "◀" && user.id == message.author.id,
          { time: 20000 }),
          x = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "❌" && user.id == message.author.id,
            { time: 20000 }),
          go = msg.createReactionCollector((reaction, user) => reaction.emoji.name == "▶" && user.id == message.author.id,
            { time: 20000 });
        back.on("collect", async reaction => {
          await reaction.users.remove(message.author.id).catch(err => { });
          if (currentPage == 1) return;
          currentPage--;
          if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => `\`${index + 1}.\` ${message.guild.members.cache.get(kisi.userID).toString()} | **${kisi.regular + kisi.bonus}** davet`).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`));
        });
        go.on("collect", async reaction => {
          await reaction.users.remove(message.author.id).catch(err => { });
          if (currentPage == pages.length) return;
          currentPage++;
          if (msg) msg.edit(embed.setDescription(`${pages[currentPage - 1].map((kisi, index) => `\`${index + 1}.\` ${message.guild.members.cache.get(kisi.userID).toString()} | **${kisi.regular + kisi.bonus}** davet`).join('\n')}`).setFooter(`Şu anki sayfa: ${currentPage}`));
        });
        x.on("collect", async reaction => {
          await back.stop();
          await go.stop();
          await x.stop();
          if (message) message.delete().catch(err => { });
          if (msg) return msg.delete().catch(err => { });
        });
        back.on("end", async () => {
          await back.stop();
          await go.stop();
          await x.stop();
          if (message) message.delete().catch(err => { });
          if (msg) return msg.delete().catch(err => { });
        });
      };
    });
  };
});

client.tarihHesapla = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `\`${string} önce\``;
};

Array.prototype.chunk = function (chunk_size) {
  let myArray = Array.from(this);
  let tempArray = [];
  for (let index = 0; index < myArray.length; index += chunk_size) {
    let chunk = myArray.slice(index, index + chunk_size);
    tempArray.push(chunk);
  }
  return tempArray;
};
Date.prototype.toTurkishFormatDate = function () {
  return moment.tz(this, "Europe/Istanbul").format('LLL');
};

client.convertDuration = (date) => {
  return moment.duration(date).format('H [saat,] m [dakika]');
};

client.tarihHesapla = (date) => {
  const startedAt = Date.parse(date);
  var msecs = Math.abs(new Date() - startedAt);

  const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
  msecs -= years * 1000 * 60 * 60 * 24 * 365;
  const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
  msecs -= months * 1000 * 60 * 60 * 24 * 30;
  const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
  msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
  const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
  msecs -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(msecs / (1000 * 60 * 60));
  msecs -= hours * 1000 * 60 * 60;
  const mins = Math.floor((msecs / (1000 * 60)));
  msecs -= mins * 1000 * 60;
  const secs = Math.floor(msecs / 1000);
  msecs -= secs * 1000;

  var string = "";
  if (years > 0) string += `${years} yıl ${months} ay`
  else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks + " hafta" : ""}`
  else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days + " gün" : ""}`
  else if (days > 0) string += `${days} gün ${hours > 0 ? hours + " saat" : ""}`
  else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins + " dakika" : ""}`
  else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs + " saniye" : ""}`
  else if (secs > 0) string += `${secs} saniye`
  else string += `saniyeler`;

  string = string.trim();
  return `\`${string} önce\``;
};

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

client.on("message", (message) => {
  if (message.activity && message.activity.type === 3 && !message.deleted) {
    if (!client.kullanabilir(message.author.id) && !ayarlar.commandkanali.includes(message.channel.name)) return message.lineReply(`Bu sunucuda chate spotify linki atmak yasaktır.`).then(x => x.delete({ timeout: 7500 })), message.delete()
  }
  if (message.channel.name === ayarlar.spotify && message.author.bot && client.kullanabilir(message.author.id)) return;
  if (message.activity && message.content.toLowerCase().startsWith('https://open.spotify.com') && message.activity && message.activity.type !== 3 && !message.deleted) {
    message.delete()
    message.lineReply(`${message.author}, Bu kanalda spotify paylaşımı dışında birşey yapılması yasaktır!`).then(x => x.delete({ timeout: 7500 }))
  }
});
client.login(ayarlar.inviteToken).then(c => console.log(`${client.user.tag} olarak giriş yapıldı!`)).catch(err => console.error("Bota giriş yapılırken başarısız olundu!"));
