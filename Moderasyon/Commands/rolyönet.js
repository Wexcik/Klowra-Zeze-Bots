const { MessageEmbed } = require('discord.js');
const { VirtualType } = require('mongoose');
var STAFPERMS = ["ADMINISTRATOR","KICK_MEMBERS","BAN_MEMBERS","MANAGE_CHANNELS","MANAGE_GUILD","MANAGE_MESSAGES","MENTION_EVERYONE","VIEW_GUILD_INSIGHTS","MANAGE_ROLES","MANAGE_WEBHOOKS"];
module.exports.execute = async (client, message, args, ayar, emoji) => {
  
  if (!client.kullanabilir(message.author.id) && !ayar.rolyönet.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!uye) return message.lineReply("Geçerli bir üye belirtmelisin!");
  let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name === args.slice(1).join(' '));
  let authorHighestRolePosition = message.member.roles.highest.position;
  if (!role) {
    let filter = m => m.author.id === message.author.id;
    let roleCommandRoles = client.roleCommandRoles.filter(r => r.position < authorHighestRolePosition).sort((a, b) => b.position - a.position);
    let rolesInfo = await message.lineReply(`${roleCommandRoles.map((r, index) => `${index}. ${r.name} ${uye.roles.cache.has(r.id) ? "(✅)" : ""}`).join('\n')}\n\n30 saniye içinde rol numarası yazmalısın! (Tik işareti bulunanlar üyede zaten bulunan rollerdir.)`, { code: "css" })
    let collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] }).catch(err => {
      rolesInfo.delete({ timeout: 15000 });
      message.lineReply("30 saniye içinde işlem yapmadın!");
    });
    let msj = collected.first();
    if (!msj || isNaN(msj.content) || Number(msj.content) >= roleCommandRoles.length) return message.lineReply("Geçerli bir rol numarası belirtmelisin!");
    role = roleCommandRoles[Number(msj.content)];
    rolesInfo.delete({ timeout: 15000 });
  };
  if (role.managed || authorHighestRolePosition < role.position) return message.lineReply("Geçerli bir rol belirtmelisin!").then(x => x.delete({ timeout: 5000 }))

  if (STAFPERMS.some(p => client.guilds.cache.get(ayar.sunucuID).roles.cache.get(role.id).permissions.has(p))) return message.lineReply("`Bu rolü sadece belli kişiler verebilir.`").then(x => x.delete({ timeout: 5000 }))
  uye.roles.cache.has(role.id) ? uye.roles.remove(role.id).then(x => message.lineReply(`\`${uye.displayName}\` üyesinden \`${role.name}\` adlı rol *alındı!`)).then(x => x.delete({ timeout: 15000 })) : uye.roles.add(role.id).then(x => message.reply(`\`${uye.displayName}\` üyesine \`${role.name}\` adlı rol **verildi!*`)).then(x => x.delete({ timeout: 5000 }));
  let logKanali = client.channels.cache.find(c => c.name === ayar.rollog);
  logKanali.send(new MessageEmbed().setTimestamp().setTitle("Rol Verildi").setColor("#FFA500").setDescription(`${message.author} \`(${message.author.id})\` adlı yetkili bir üyeye komut ile rol verdi!\n\nRol Verilen Üye ${uye} \` ${uye.id}\` \nVerilen Rol ${role}`))

};

module.exports.configuration = {
  name: "rol",
  aliases: ["role", "rol-ver"],
  usage: "rol @üye",
  description: "Belirtilen üyeye belirtilen rolü verir.",
  permLevel: 0
};