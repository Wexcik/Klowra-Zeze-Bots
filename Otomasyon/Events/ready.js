const ayar = global.sunucuAyar;
const client = global.client;
module.exports = () => {
  setInterval(() => {
    const index = Math.floor(Math.random() * (ayar.durum.length));
  client.user.setPresence({activity: {name:`${ayar.durum[index]}`}, status: "idle"});
} , 15000);     

let guild = client.guilds.cache.get(ayar.sunucuID);
guild.members.cache.filter(uye => uye.roles.cache.size === 1).array().forEach((uye, index) => setTimeout(() => {
  uye.roles.add(ayar.teyitsizRolleri).catch();
  }))
}
module.exports.configuration = {
  name: "ready"
}