const ayar = global.sunucuAyar;
const client = global.client;

module.exports = async () => {
  setInterval(() => {
    const index = Math.floor(Math.random() * (ayar.durum.length));
  client.user.setPresence({activity: {name:`${ayar.durum[index]}`}, status: "idle"});
} , 15000);  
 if (client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
    let guild = client.guilds.cache.get(ayar.sunucuID);
  let enAltYetkiliRolu = guild.roles.cache.get(ayar.enAltYetkiliRolu);
  client.roleCommandRoles = guild.roles.cache.filter(r => r.position >= enAltYetkiliRolu.position && !r.managed).array();
  setInterval(() => {
  if (client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
}, 1000* 60 * 60 * 1);
}
module.exports.configuration = {
  name: "ready"
}
