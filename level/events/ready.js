const conf = require('../../sunucuAyar.js');

module.exports = {
  name: 'ready',
  async execute(client) {
    const voiceChannel = client.channels.cache.get(conf.botSesKanali);
    if (voiceChannel && voiceChannel.joinable) voiceChannel.join();
  
    setInterval(() => {
      const index = Math.floor(Math.random() * (conf.durum.length));
      client.user.setPresence({ activity: { name:`${conf.durum[index]}`}, status: "idle" });
    }, 15000);   
    
    const guild = client.guilds.cache.get(conf.sunucuID);
    const invites = await guild.fetchInvites();
    client.invites.set(guild.id, invites);
  
    console.log(`${client.user.tag} olarak giriş yapıldı.`);  
  }
};
