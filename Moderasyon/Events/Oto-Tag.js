const discord = require("discord.js");
const StatsModel = require("../Models/Stats.js");
const TaskModel = require("../Models/Task.js");
const tagss = require("../Models/blackTag.js");
const BackRoles = require('../Models/geriroller.js');

module.exports = async (oldUser, newUser) => {
  if(oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
  let ayarlar = global.sunucuAyar;
  let yasaklitag = await tagss.findOne({ guildID: ayarlar.sunucuID });
  let client = oldUser.client;
  let guild = client.guilds.cache.get(global.sunucuAyar.sunucuID);
  if(!guild) return console.error(`${__filename} Sunucu bulunamadı!`);
  let user = guild.members.cache.get(oldUser.id);
  if(!user) return;
  const embed = new discord.MessageEmbed().setAuthor(user.displayName, user.user.avatarURL({dynamic: true})).setColor(client.randomColor());
  let log = client.channels.cache.find(c => c.name === ayarlar.ekipLogKanali)
  if ((yasaklitag.taglar.length && yasaklitag.taglar.some(tag => newUser.username.includes(tag))) && (ayarlar.yasakTagRolu && !ayarlar.yasakTagRolu.some(c => user.roles.cache.has(c)))) {
    await user.roles.set(user.roles.cache.get(ayarlar.boosterRolu) ? ayarlar.yasakTagRolu.concat(ayarlar.boosterRolu) : ayarlar.yasakTagRolu)
    await user.setNickname(`${ayarlar.ikinciTag} Yasak | Tag`);
    user.send(`Merhaba, **${guild.name}** sunucusunun g listesinde bulunan bir sunucunun tagını kullanmaktasınız. Bundan dolayı **${guild.name}** sunucusundaki kanallara erişiminiz yasaklandı ve g bölümü hariç hiçbir odayı göremeyeceksiniz. Eğer **${guild.name}** sunucusunda normal bir üye gibi her odaya giriş hakkını ve yazı yazma hakkını tekrardan geri kazanmak istiyorsanız tagınızı isminizden çıkartabilirsiniz.\n-**${guild.name}** sunucusunun tagını alarak sunucudaki çoğu özelliklerden yararlanabilirsiniz.\nSunucu Tagı: ${ayarlar.tag}`);
    return;
  };

  if (yasaklitag.taglar.length && (ayarlar.yasakTagRolu && ayarlar.yasakTagRolu.some(c => user.roles.cache.has(c)))) {
    if (yasaklitag.taglar.some(r => newUser.username.includes(r))) return
    await user.roles.set(user.roles.cache.get(ayarlar.boosterRolu) ? ayarlar.teyitsizRolleri.concat(ayarlar.boosterRolu) : ayarlar.teyitsizRolleri);
    await user.setNickname(`${ayarlar.ikinciTag} İsim | Yaş`);
    await user.send(`**${guild.name}** sunucumuzun glarından birine sahip olduğun için sunucuya erişimin yoktu ve şimdi bu gı çıkardığın için bu yasağın kalktı!`);
    if (ayarlar.teyitKanali && client.channels.cache.has(ayarlar.teyitKanali)) client.channels.cache.find(c => c.name === ayarlar.teyitKanali).send(`\|\| ${user} \|\|`, { embed: embed.setDescription("gı bıraktığın için teşekkür ederiz! Ses kanallarından birine gelerek kayıt olabilirsin.") }).catch();
    return;
  };

  if(newUser.username.includes(ayarlar.tag) && !user.roles.cache.has(ayarlar.ekipRolu)) {
    if (ayarlar.teyitsizRolleri.some(rol => user.roles.cache.has(rol)) || user.roles.cache.has(ayarlar.jailRolu) || user.roles.cache.has(ayarlar.yasakTagRolu) && user.roles.cache.has(ayarlar.offline)) return;
    if(ayarlar.ikinciTag.length) await user.setNickname(user.displayName.replace(ayarlar.ikinciTag, ayarlar.tag));
    await user.roles.add(ayarlar.ekipRolu);
    if(log) await log.send(`────────────────────────\n${user} kişisi ismine \`${ayarlar.tag}\` sembolünü alarak ekibimize katıldı! Ekip rolü verildi`);
    return;
  };

  if(!newUser.username.includes(ayarlar.tag) && user.roles.cache.has(ayarlar.ekipRolu)) {
    if(ayarlar.ikinciTag.length) await user.setNickname(user.displayName.replace(ayarlar.tag, ayarlar.ikinciTag));
    let ekipRol = guild.roles.cache.get(ayarlar.enAltYetkiliRolu);
    if (ekipRol) {
      let channel = guild.channels.cache.find(c => c.name === ayarlar.yetkisaldı)
      let yetkili = user.roles.cache.filter(rol => ekipRol.rawPosition <= rol.rawPosition)
      let staff = yetkili.map(rol => rol.id)
      const StaffRole = user.roles.cache.some(role => staff.includes(role.id))
      if(StaffRole){
            await TaskModel.deleteMany({ id: user.id });
            await StatsModel.deleteOne({ id: user.id });
        if(channel) await channel.send(`<@&859368931939975168>, <@&826802027262378004>    \n<@${user.id}> adlı üye **${new Date(Date.now()).toTurkishFormatDate()}** tarihinde yetkiyi bıraktı.   \n  Bırakmadan önceki yetkileri:\n${yetkili.map(x => x).join(',')}`)
         await user.roles.remove(yetkili);
      }
      let data = await BackRoles.findOne({ Id: user.id })
    if (data) {
      await BackRoles.deleteOne({ Id: user.id })
    }
    await user.roles.remove(ayarlar.ekipRolu)
    await user.setNickname(user.displayName.replace(ayarlar.tag, ayarlar.ikinciTag));
    };
    if(log) await log.send(`────────────────────────\n${user} kişisi isminden \`${ayarlar.tag}\` sembolünü çıkararak ekibimize ihanet etti! Ekip rolü ve eğer var ise yetkileri alındı. <@&${ayarlar.tagsorumlusu}>`);
    return;
  };
};

module.exports.configuration = {
  name: "userUpdate"
}