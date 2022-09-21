const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");

module.exports.execute = async (client, message, args, conf) => {
  const filter = message.guild.roles.cache.filter(member => message.guild.roles.cache.get(conf.enAltStaffRolu).position <= member.position && message.guild.roles.cache.get(conf.enUstStaffRolu).position >= member.position)
  const roles = filter.map(c => c.id)
  const yetkililer = message.guild.members.cache.filter(member => member.roles.cache.some(role => roles.includes(role.id)));

  switch (args[0]) {
    case "sıfırla": {
      message.lineReply(`**${message.guild.members.cache.filter(x => x.roles.cache.has(conf.skatildiRolu) || x.roles.cache.has(conf.katilmadiRolu)).size}** kişiden rol alınacak.`);
      message.guild.members.cache.filter(x => x.roles.cache.has(conf.skatildiRolu) || x.roles.cache.has(conf.katilmadiRolu)).forEach(x => x.roles.remove([conf.skatildiRolu, conf.katilmadiRolu]).catch(err => message.lineReply(`${x} üyesinden rol alınamadı!`)));
      message.lineReply("Üyelerden katıldı/katılmadı rolü alındı, bazılarından alınmamış olabilir");
      break;
    }
    case "katıldı": {
      let log = message.guild.channels.cache.find(c => c.name === conf.toplantiLogKanali);
      let channel = message.guild.channels.cache.get(args[1]);
      if (!channel || channel.type != "voice") return message.lineReply("böyle bir kanal bulunamadı veya bu kanal ses kanalı değil!");

      channel.members.filter(x => x.id != message.author.id && !x.user.bot).forEach(x => x.roles.add(conf.skatildiRolu).catch(err => message.lineReply(`${x} üyesine rol verilemedi!`)));

      let katılmayanŞerefsizler = message.guild.members.cache.filter(x => !x.user.bot && !x.voice.channelID && !x.roles.cache.has(conf.skatildiRolu) && yetkililer.some(e => x.id == e.id));
      katılmayanŞerefsizler.forEach(x => x.roles.add(conf.katilmadiRolu).catch(err => client.reply(message, `${x} üyesine toplantı katılmadı rolü verilemedi`)));

      message.lineReply(`**${channel.name}** odasındaki **${channel.members.size}** adet üyeye toplantı rolü verildi ve loglandı!`);
      log.send(`**${moment(Date.now()).tz("Europe/Istanbul").format("YYYY.MM.DD | HH:mm:ss")}** tarihinde ${message.author.username} tarafından **${channel.name}** odasındaki **${channel.members.size}** adet üyeye toplantıya katıldı rolü verildi! Katılan üyeler;\n\`\`\`${channel.members.map(x => x.displayName + " / " + x.id).join("\n")}\`\`\`\n__**Katılmayanlar;**__\`\`\`\n${katılmayanŞerefsizler.map(x => x.displayName + " / " + x.id).join("\n")}\n\`\`\``, { split: true });
      break;
    } 
  }   
};   
module.exports.configuration = {
  name: 'yetkilitoplantı',
  aliases: ["yetkiliyoklama","stoplantı"],  
  usage: 'yetkilitoplantı',
  description: 'Katıldı rolü dağıtır.',
  permLevel: 2
};