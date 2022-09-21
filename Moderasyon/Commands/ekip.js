const { MessageEmbed } = require('discord.js');
let ekipKomut = require("../Models/ekip");

module.exports.execute = async (client, message, args, ayar) => {

    let sec = args[0];
        if (["oluştur"].includes(sec)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if (!rol) return message.lineReply('bir rol etiketle ya da bir rol idsi belirt.')
            let ekipKomutDATA = await ekipKomut.findOne({
                guildID: message.guild.id,
                ekipRol: rol.id
            });
            if (ekipKomutDATA) return message.lineReply("Bu isimde zaten bir ekip mevcut");
            let newData = ekipKomut({
                guildID: message.guild.id,
                ekipRol: rol.id,
            });
            newData.save();
            message.lineReply("Başarılı")
        }
        if (["sil"].includes(sec)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            let ekipKomutDATA = await ekipKomut.findOne({
                guildID: message.guild.id,
                ekipRol: rol.id,
            })
            if (!ekipKomutDATA) return message.lineReply("Lütfen bir ekip rolü giriniz");
            message.reply(`başarılı bir şekilde ${rol} ekibini sildim.`);
            await ekipKomut.deleteOne({
                guildID: message.guild.id,
                ekipRol: rol.id
            }).exec();
        };
        if (["say"].includes(sec)) {
            let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
            if(!rol) return message.lineReply("Lütfen bir ekip rolü etiketle veya idsini gir.").then(x=> x.delete({timeout:5000}))
                     if (!rol) return message.reply("Lütfen bir ekip rolü giriniz.")
            let data2 = await ekipKomut.findOne({
                guildID: message.guild.id,
                ekipRol: rol.id
            });
            if (!data2) return
            let members = rol.members;
            let sesteOlmayanlar = members.filter(member => !member.user.bot && !member.voice.channelID);
            let sesteOlanlar = members.filter(member => !member.user.bot && member.voice.channelID);
            let yetkili = members.filter(member => !member.user.bot)
            message.lineReply(`Ekipteki Toplam Üye Sayısı: ${yetkili.size} || Seste Bilgisi: Olmayan ${sesteOlmayanlar.size} Olan ${sesteOlanlar.size}`, { code: 'xl' });
            sesteOlmayanlar = sesteOlmayanlar.map(x => x.toString());
            sesteOlanlar = sesteOlanlar.map(x => x.toString());
            message.lineReply("Aktif olmayanları etiketlemek için:")
            message.lineReply(sesteOlmayanlar.join(', '), { code: 'xl', split: { char: ', ' } });
            message.lineReply("Seste Olanları etiketlemek için:")
            message.lineReply(sesteOlanlar.join(', '), { code: 'dif', split: { char: ', ' } });

        };

        if (!sec) {
            let loading = await message.lineReply("Veriler yükleniyor...")
            let data = await ekipKomut.find({
                guildID: message.guild.id
            });
            let totalAktif = 0;
            let totalSesteki = 0;
            let totalUnSesteki = 0;
            let tümYetkililer = 0;
            let göster = data.length > 0 ? data.map((veri, index) => {
                tümYetkililer += message.guild.roles.cache.get(veri.ekipRol).members.size
                totalAktif += message.guild.roles.cache.get(veri.ekipRol).members.filter(x => x.presence.status !== "offline").size
                totalSesteki += message.guild.roles.cache.get(veri.ekipRol).members.filter(x => x.presence.status !== "offline" && x.voice.channel).size
                totalUnSesteki += message.guild.roles.cache.get(veri.ekipRol).members.filter(x => x.presence.status !== "offline" && !x.voice.channel).size
                return {
                    Mesaj: `<@&${veri.ekipRol}> **Ekip Bilgileri**\n\nToplam Üye: \`${message.guild.roles.cache.get(veri.ekipRol).members.size} kişi\`\nÇevrimiçi Üye: \`${message.guild.roles.cache.get(veri.ekipRol).members.filter(x => x.presence.status !== "offline").size} kişi\`\nSesteki Üye: \`${message.guild.roles.cache.get(veri.ekipRol).members.filter(x => x.voice.channel).size} kişi\`\nSeste Olmayan Üye: \`${message.guild.roles.cache.get(veri.ekipRol).members.filter(x => !x.voice.channel && x.presence.status !== "offline").size} kişi\`\n─────────────────────`
                }
            }).map(x => `${x.Mesaj}`).join("\n") : "Veri yoktur.";

            loading.delete();
            message.lineReply(new MessageEmbed().setColor("BLACK").setAuthor(message.author.tag, message.author.avatarURL({
                dynamic: true
            })).setTimestamp().setFooter("Klowra Was Here").setDescription(`
Aşağıdaki ekip üyelerini'ı daha detaylı bir şekilde görmek için aşağıdaki komutu yazınız.
\`.ekip bak @ekiprol\`
\`.ekip say @ekiprol\`

─────────────────────
${göster}`));
    } else return;

};

module.exports.configuration = {
    name: 'ekip',
    aliases: [],
    usage: 'ekip',
    description: '',
    permLevel: 1
};