const StatsModel = require("../Models/Stats.js");
const TaskModel = require("../Models/Task.js");
const tagss = require("../Models/blackTag.js");
const BackRoles = require('../Models/geriroller.js');
const client = global.client;
module.exports = () => {
  setInterval(async () => {
    await checkRoles();
  }, 45000);
  setInterval(async () => {
    await checkBlackTag()
  }, 10000)
};
module.exports.configuration = {
  name: "ready"
};
async function checkRoles() {
  let ayar = global.sunucuAyar;
  let guild = client.guilds.cache.get(ayar.sunucuID);
  let ekipRol = guild.roles.cache.get(ayar.enAltYetkiliRolu);
  
  guild.members.cache.filter(uye => uye.user.username.includes(ayar.tag) && !ayar.teyitsizRolleri.some(r => uye.roles.cache.has(r)) && !uye.roles.cache.has(ayar.offline) && !uye.roles.cache.has(ayar.underworld) && !uye.roles.cache.has(ayar.fakeHesapRolu) && !uye.roles.cache.has(ayar.underworld) && !uye.roles.cache.has(ayar.jailRolu) && !ayar.yasakTagRolu.some(role => uye.roles.cache.has(role)) && !uye.roles.cache.has(ayar.reklamRolu) && !uye.roles.cache.has(ayar.ekipRolu)).array().forEach(async (uye, index) => {
    if (ayar.sahipRolu.some(role => uye.roles.cache.has(role))) return
    if (uye.user.bot) return
    await uye.roles.add(ayar.ekipRolu);
    await uye.setNickname(uye.displayName.replace(ayar.ikinciTag, ayar.tag)); /// taglı rol verme sistemi
  });

  guild.members.cache.filter(x => !x.user.username.includes(ayar.tag) && !ayar.teyitsizRolleri.some(r => x.roles.cache.has(r)) && !x.roles.cache.has(ayar.vipRole) && !x.roles.cache.has(ayar.underworld) && !x.roles.cache.has(ayar.fakeHesapRolu) && !x.roles.cache.has(ayar.jailRolu) && !x.roles.cache.has(ayar.underworld) && !x.roles.cache.has(ayar.reklamRolu) && !ayar.yasakTagRolu.some(role => x.roles.cache.has(role)) && x.roles.cache.has(ayar.ekipRolu)).array().forEach(async (x, index) => {
    if (ayar.sahipRolu.some(role => x.roles.cache.has(role))) return
    if (x.user.bot) return
    let channel = guild.channels.cache.find(c => c.name === ayar.yetkisaldı)
    let yetkili = x.roles.cache.filter(rol => ekipRol.rawPosition <= rol.rawPosition)
    let staff = yetkili.map(rol => rol.id)
    const StaffRole = x.roles.cache.some(role => staff.includes(role.id))
    if(StaffRole){
            await TaskModel.deleteMany({ id: x.id });
            await StatsModel.deleteOne({ id: x.id });
      if(channel) await channel.send(`<@&936350970378604555>\n<@${x.id}> adlı üye **${new Date(Date.now()).toTurkishFormatDate()}** tarihinde yetkiyi bıraktı.\n  Bırakmadan önceki yetkileri:\n${yetkili.map(x => x).join(', ')}`)
       await x.roles.remove(yetkili);
    }
    let data = await BackRoles.findOne({ Id: x.id })
    if (data) {
      await BackRoles.deleteOne({ Id: x.id })
    }
       await x.roles.remove(ayar.ekipRolu);
       await x.setNickname(x.displayName.replace(ayar.tag, ayar.ikinciTag)); /// taglı rol alma sistemi
  });

//   guild.members.cache.filter(u => !u.user.bot && !u.roles.cache.has(ayar.jailRolu) && !u.roles.cache.has(ayar.boosterRolu)  && !u.hasPermission("ADMINISTRATOR")  && !ayar.vipRole.some(x => u.roles.cache.has(x))  && !u.roles.cache.has(ayar.yasakTagRolu) && !u.roles.cache.has(ayar.reklamRolu) && !ayar.teyitsizRolleri.some(r => u.roles.cache.has(r)) && !u.user.username.includes(ayar.tag)).array().forEach((u, index) => {
//     setTimeout(async () => { 
//    if (u.user.username.includes(ayar.tag)) return;
//   await u.roles.set(ayar.teyitsizRolleri).catch(); 
//   await u.setNickname(`${ayar.ikinciTag} İsim | Yaş`);  
// }, index*15000);
//  }); /// taglı alım
}

async function checkBlackTag() {
  let ayar = global.sunucuAyar;
  let yasaklitag = await tagss.findOne({ guildID: ayar.sunucuID }) || new tagss({ guildID: ayar.sunucuID })
  let yasakTaglar = yasaklitag.taglar
  let guild = client.guilds.cache.get(ayar.sunucuID);
  let ekipRol = guild.roles.cache.get(ayar.enAltYetkiliRolu);

  guild.members.cache.filter(uye => yasakTaglar.some(tag => uye.user.username.includes(tag)) && !uye.hasPermission("MANAGE_CHANNELS") && !uye.hasPermission("ADMINISTRATOR") && !uye.roles.cache.has(ayar.jailRolu) && !uye.roles.cache.has(ayar.reklamRolu) && !ayar.yasakTagRolu.some(c => uye.roles.cache.has(c)) && !ayar.vipRole.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(ayar.boosterRolu)).array().forEach(async (uye, index) => {
    await uye.setNickname(`${ayar.ikinciTag} Yasaklı Tag`)
    await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? ayar.yasakTagRolu.concat(ayar.boosterRolu) : ayar.yasakTagRolu).catch(console.error); 
  });
  // Yasak tagı olmayıp yasak tag rolü olan üyelerden rolü alma
  guild.members.cache.filter(uye => ayar.yasakTagRolu.some(c => uye.roles.cache.has(c)) && !yasakTaglar.some(r => uye.user.username.includes(r))).array().forEach(async (uye, index) => {
    await uye.setNickname(`${ayar.ikinciTag} İsim | Yaş`);
    await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? ayar.teyitsizRolleri.concat(ayar.boosterRolu) : ayar.teyitsizRolleri).catch(console.error)
  });
}