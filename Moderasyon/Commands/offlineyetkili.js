const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');

module.exports.execute = async (client, message, args, ayar, emoji) => {
     if(!client.kullanabilir(message.author.id) && !ayar.yetkilialım.some(role => message.member.roles.cache.has(role)) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
     if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
     if(!args[0] && !args[0].includes('offline') && !args[0].includes('ses') && !args[0].includes('online')) return message.lineReply("`online/ofline/ses şeklinde belirtmelisin!`").then(x => x.delete({timeout: 5000}));;
     message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`);

     let enAltYetkiliRolu = message.guild.roles.cache.filter(member => message.guild.roles.cache.get(ayar.enAltStaffRolu).position <= member.position && message.guild.roles.cache.get(ayar.enUstStaffRolu).position >= member.position);
     let sıralama = enAltYetkiliRolu.map(c => c.id)
     let loading = await message.lineReply(`***${message.author}, Veriler hesaplanıyor...***`);
     var members = message.guild.members.cache.filter(member => member.roles.cache.some(role => sıralama.includes(role.id)));
     if(args[0] && args[0].includes('offline')) {
    var offlineOlanlar = members.filter(member =>!member.user.bot && member.presence.status == "offline" && !member.voice.channelID);
    var manipuleciOclar = members.filter(member => !member.user.bot && member.presence.status == "offline" && member.voice.channelID);
    client.splitEmbedWithDesc(`**🟢 Çevrimdışı olan yetkililerr**\n\n${offlineOlanlar.map(member => `${member}`).join(", ")}`,
    {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
    {setColor: ["2f3136"]}).then(list => { 
    list.forEach(item => {
    message.lineReply(item).catch()
    });
    client.splitEmbedWithDesc(`**🟢 Seste olup çevrimdışı takılanlar**\n\n${manipuleciOclar.map(member => `${member}`).join(", ")}`,
    {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
    {setColor: ["2f3136"]}).then(list => { 
    list.forEach(item => {
    message.lineReply(item).catch()
    });
});
loading.delete()
});
    return;
  };
  if(args[0] && args[0].includes('ses')) {
    let sesteOlmayanlar = members.filter(member => !member.user.bot && member.presence.status != "offline" && !member.voice.channelID);
    message.lineReply("Seste olmayan yetkililer" , { code: "xl", split: true });
    message.lineReply(`${sesteOlmayanlar.map(member => `${member}`).join(", ")}`, {split: true});
    loading.delete()

    return;
  };
  
  if (args[0] && (args[0].includes('online'))) {
    var sesteOlmayanlar = members.filter(member => !member.user.bot && member.presence.status != "offline" && !member.voice.channelID);
    var sestekiler = members.filter(member => !member.user.bot && member.presence.status != "offline" && member.voice.channelID);
    return  client.splitEmbedWithDesc(`**🟢 Seste olan yetkililer**\n\n${sestekiler.map(member => `${member}`).join(", ")}`,
    {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
    {setColor: ["2f3136"]}).then(list => { 
    list.forEach(item => {
    message.lineReply(item)
    });
    client.splitEmbedWithDesc(`**🟢 Aktif olup seste olmayan yetkililer**\n\n${sesteOlmayanlar.map(member => `${member}`).join(", ")}`,
    {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
    {setColor: ["2f3136"]}).then(list => { 
    list.forEach(item => {
    message.lineReply(item).catch()
    });
});
loading.delete()
});
  };

};
module.exports.configuration = {
  name: "yetkili",
  aliases: ["staff","bildirim"],
  usage: "staff offline/online/ses",
  description: "Açık veya kapalı olan yetkilileri gösterir.",
  permLevel: 0
};