module.exports.execute = (client, message, args, ayar, emoji) => {
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  let voiceChannel = message.member.voice.channelID;
  if (!voiceChannel) return message.lineReply("Herhangi bir ses kanalında değilsin!");
  let publicRooms = message.guild.channels.cache.filter(c => c.parentID === ayar.publicSesKategorisi && c.type === "voice");
  message.member.voice.channel.members.array().forEach((m, index) => {
    setTimeout(() => {
       if (m.voice.channelID !== voiceChannel) return;
       m.voice.setChannel(publicRooms.random().id);
    }, index*1000);
  });
  message.lineReply(`\`${message.member.voice.channel.name}\` adlı ses kanalındaki üyeler rastgele public odalara dağıtılmaya başlandı!`);
};
  
module.exports.configuration = {
  name: "dağıt",
  aliases: ["dagit", "dağit"],
  usage: "dağıt",
  description: "Komutun kullanan kişinin ses kanalındaki üyeleri rastgele ses kanallarına dağıtır.",
  permLevel: 1
};