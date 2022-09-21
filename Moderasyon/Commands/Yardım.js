const { MessageEmbed } = require("discord.js");


module.exports.execute = async (client, message, args, ayar, emoji) => {
  if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "zezeiptal")}`);
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);


  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
  let command = args[0]
  if (global.commands.has(command)) {
    command = global.commands.get(command)
    embed
      .addField('Komut Adı', command.configuration.name, false)
      .addField('Komut Açıklaması', command.configuration.description, false)
      .addField('Doğru Kullanım', command.configuration.usage)
      .addField('Alternatifler', command.configuration.aliases[0] ? command.configuration.aliases.join(', ') : 'Bulunmuyor')
      .setTimestamp()
      .setColor('ff0013')
      message.lineReply(embed)
    return;
  }

  let yazı = "";
  global.commands.forEach(command => {
    yazı += `\`${ayar.prefix[0]}${command.configuration.usage}\` \n`;
  });
  message.lineReply(embed.setDescription(yazı)).then(x => x.delete({ timeout: 30000 }));
};
module.exports.configuration = {
  name: "yardım",
  aliases: ['help'],
  usage: "yardım [komut adı]",
  description: "Botta bulunan tüm komutları listeler."
};