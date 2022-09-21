const ayar = global.sunucuAyar;
const client = global.client;
const { teyitsizRolleri } = require('../../sunucuAyar.js');
const Cezapuan = require('../Models/cezapuanı.js');
const FunnyModel = require('../Models/Funny.js')
module.exports = () => {
  setInterval(() => {
    const index = Math.floor(Math.random() * (ayar.durum.length));
    client.user.setPresence({ activity: { name: `${ayar.durum[index]}` }, status: "idle" });
  }, 15000);
  if (client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
  let guild = client.guilds.cache.get(ayar.sunucuID);
  let enAltYetkiliRolu = guild.roles.cache.get(ayar.enAltYetkiliRolu);
  client.roleCommandRoles = guild.roles.cache.filter(r => r.position >= enAltYetkiliRolu.position && !r.managed).array();
  setInterval(() => {
    if (client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
  }, 1000 * 60 * 60 * 1);
}

setInterval(async () => {
  await checkEnergy()
  await checkRoles();
}, 60000);

module.exports.configuration = {
  name: "ready"
}

async function checkRoles() {

  let guild = client.guilds.cache.get(ayar.sunucuID);
  let ekipRol = guild.roles.cache.get(ayar.enAltYetkiliRolu);

  guild.members.cache.filter(x => x.roles.cache.some(role => x.roles.cache.filter(rol => ekipRol.rawPosition <= rol.rawPosition).map(rol => rol.id).includes(role.id))).array().forEach(async (x, index) => {
    if (ayar.sahipRolu.some(role => x.roles.cache.has(role))) return
    if (x.user.bot) return
    let data = await Cezapuan.findOne({ guildID: x.guild.id, userID: x.id });
    if (!data) { data = Cezapuan.create({ guildID: x.guild.id, userID: x.id }), puan = 100 }
    if (data.puan >= 50 && x.roles.cache.has(ayar.warningmode)) await x.roles.remove(ayar.warningmode);
    if (data.puan < 50 && !x.roles.cache.has(ayar.warningmode)) await x.roles.add(ayar.warningmode) /// cp sistemi
  });

}
async function checkEnergy() {
  const datas = await FunnyModel.find()
  for (const data of datas){
  if (data.energy >= 100) continue
  await FunnyModel.updateOne({ userID: data.userID }, { $inc: { energy: 1 } }, { upsert: true })
  }
}