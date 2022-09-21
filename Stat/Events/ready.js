const ayar = global.sunucuAyar;
const client = global.client;
const MemberStats = require('../Models/MemberStats.js');
module.exports = () => {
  setInterval(() => {
    const index = Math.floor(Math.random() * (ayar.durum.length));
  client.user.setPresence({activity: {name:`${ayar.durum[index]}`}, status: "idle"});
} , 15000);     
    if (client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
  setInterval(() => {
  if (client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
}, 1000* 60 * 60 * 1);
}
module.exports.configuration = {
  name: "ready"
}