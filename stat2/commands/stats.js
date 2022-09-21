const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const StatsModel = require("../models/Stats.js");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)
const TaggedModel = require("../models/Taggeds.js");
const StaffModel = require("../models/Staff.js");
const CezaPuans = require('../models/cezapuanı.js');

module.exports = {
    usages: ["stats", "me", "info"],
    async execute({ client, message, args }) {
        
        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        if (!functions.checkStaff(message.member)) return;

        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        const document = await StatsModel.findOne({ id: user.id });
        if (!document) return message.lineReply("Belirtilen kullanıcının verisi bulunmamaktadır.");

        let voicePoint = 0, messagePoint = 0;

        const embed = new MessageEmbed().setAuthor(user.tag, user.displayAvatarURL({ dynamic: true })).setColor("BLACK").setFooter(ayar.durum[0]);
        
        const voiceCategories = [];
        Object.keys(document.voices.categories || {}).forEach((key) => {
            const category = config.SYSTEM.CHANNELS.find((category) => category.ID === key && category.TYPE === "voice");
            if (!category) return;

            const point = Math.round(document.voices.categories[key] / (category.COUNT * 60000)) * category.POINT;
            voicePoint += point;

            const value = functions.numberToString(document.voices.categories[key]);

            voiceCategories.push({
                name: category.NAME,
                value: value ? value : "Bulunamadı", 
                points: point
            });
        });
        
        // MESSAGE
        const messageCategories = [];
        Object.keys(document.messages.categories || {}).forEach((key) => {
            const category = config.SYSTEM.CHANNELS.find((category) => category.ID === key && category.TYPE === "message");
            if (!category) return;

            const point = document.messages.categories[key] * category.POINT;
            messagePoint += point

            messageCategories.push({
                name: category.NAME,
                value: document.messages.categories[key],
                points: point
            });
        });

        const nextTasks = client.tasks.reverse().filter(task => document.points < task.POINT)
        const currentTasks = client.tasks.reverse().filter(task => document.points >= task.POINT)        
        const totalVoice = functions.numberToString(document.voices.total || 0);
        const erkektaglı = await TaggedModel.find({ admin: user.id, cinsiyet: "Erkek"})
        const mantagged = erkektaglı.length
        const kıztaglı = await TaggedModel.find({ admin: user.id, cinsiyet: "Kız"})
        const girltagged = kıztaglı.length
        const bilinmeyentaglı = await TaggedModel.find({ admin: user.id, cinsiyet: "Bilinmeyen"})
        const unktagged = bilinmeyentaglı.length
        const taggeds = await TaggedModel.find({ admin: user.id });
        const taglı = taggeds.length
        const yetkilisi = await StaffModel.findOne({ id: user.id });
        const tagaldıran = await TaggedModel.findOne({ id: user.id});
        const erkekyetkili = await StaffModel.find({ admin: user.id, cinsiyet: "Erkek"})
        const manstaff = erkekyetkili.length
        const kızyetkili = await StaffModel.find({ admin: user.id, cinsiyet: "Kız"})
        const girlstaff = kızyetkili.length
        const bilinmeyenyetkili = await StaffModel.find({ admin: user.id, cinsiyet: "Bilinmeyen"})
        const unkstaff = bilinmeyenyetkili.length
        const staffs = await StaffModel.find({ admin: user.id });
        const yetkili = staffs.length
        const cyetkili = await CezaPuans.findOne({ guildID: message.guild.id, userID: message.author.id})
        if (!cyetkili) { cyetkili = await CezaPuans.create({ guildID: message.guild.id, userID: message.author.id})}
        const cpuan = cyetkili.puan
        embed.addField(`${client.emojis.cache.find(c => c.name === 'klowrareg2')} ..Genel Bilgiler`, [
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Toplam Sesli\`__ : ${totalVoice ? `\`${totalVoice}\` (**${voicePoint}** puan)` : "`Bulunamadı.`"}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Toplam Mesaj\`__ : ${document.messages.total ? `\`${document.messages.total} mesaj\` (**${messagePoint}** puan)` : "\`Bulunamadı.\`"}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Davet Bilgisi\`__ : ${document.invites ? `\`${document.invites} davet\` (**${document.invites*config.SYSTEM.INVITE_XP} puan**)` : "\`Bulunamadı.\`"}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Eklenen Puanlar\`__ : **${document.addedPoint ? document.addedPoint : 0}** puan`,
        ]);
        embed.addField(`${client.emojis.cache.find(c => c.name === 'klowrareg2')} ..Taglı Bilgileri`, [
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Tag Aldıran\`__ : ${tagaldıran ? `${message.guild.members.cache.get(tagaldıran.admin)}` : '\`Kimse tag aldırmamış!\`'}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Tag Alma Tarihi\`__ : ${tagaldıran ? `${new Date(tagaldıran.date).toTurkishFormatDate()}` : '\`Belli değil!\`'}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Toplam Taglısı\`__ : ${taglı ? `\`${taglı}\` (**${(unktagged * config.SYSTEM.TAGGED_XP.BİLİNMEYEN_XP) + (mantagged * config.SYSTEM.TAGGED_XP.MAN_XP) + (girltagged * config.SYSTEM.TAGGED_XP.GIRL_XP)}** puan)` : "`Bulunamadı.`"}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Erkek Taglıları\`__ : ${mantagged ? `\`${mantagged}\` (**${mantagged * config.SYSTEM.TAGGED_XP.MAN_XP}** puan)` : "\`Bulunamadı.\`"}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Kız Taglıları\`__ : ${girltagged ? `\`${girltagged}\` (**${girltagged * config.SYSTEM.TAGGED_XP.GIRL_XP}** puan)` : "\`Bulunamadı.\`"}${unktagged != 0 ? `\n${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Bilinmeyen Cinsiyetteki Taglıları\`__ : ${unktagged ? `\`${unktagged}\` (**${unktagged * config.SYSTEM.TAGGED_XP.BİLİNMEYEN_XP}** puan)` : "\`Bulunamadı.\`"}` : ''}`,
        ])
        embed.addField(`${client.emojis.cache.find(c => c.name === 'klowrareg2')} ..Yetkili Bilgileri`, [
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Yetki Başlatan\`__ : ${yetkilisi ? `${message.guild.members.cache.get(yetkilisi.admin)}` : '\`Yetkilisi yok!\`'}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Yetkiye Başlama Tarihi\`__ : ${yetkilisi ? `${new Date(yetkilisi.date).toTurkishFormatDate()}` : '\`Belli değil!\`'}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Son Yetki Atlama Tarihi\`__ : ${document.updateRoleDate ? `${new Date(document.updateRoleDate).toTurkishFormatDate()}` : '\`Belli değil!\`'}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Toplam Yetkilisi\`__ : ${yetkili ? `\`${yetkili}\` (**${(unkstaff * config.SYSTEM.STAFF_XP.BİLİNMEYEN_XP) + (manstaff * config.SYSTEM.STAFF_XP.MAN_XP) + (girlstaff * config.SYSTEM.STAFF_XP.GIRL_XP)}** puan)` : "`Bulunamadı.`"}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Erkek Yetkilileri\`__ : ${manstaff ? `\`${manstaff}\` (**${manstaff * config.SYSTEM.STAFF_XP.MAN_XP}** puan)` : "\`Bulunamadı.\`"}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Kız Yetkilileri\`__ : ${girlstaff ? `\`${girlstaff}\` (**${girlstaff * config.SYSTEM.STAFF_XP.GIRL_XP}** puan)` : "\`Bulunamadı.\`"}${unkstaff != 0 ? `\n${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Bilinmeyen Cinsiyetteki Yetkilileri\`__ : ${unkstaff ? `\`${unkstaff}\` (**${unkstaff * config.SYSTEM.STAFF_XP.BİLİNMEYEN_XP}** puan)` : "\`Bulunamadı.\`"}` : ''}`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Ceza Puan Bilgisi\`__ : **${cpuan}** puan`,
            `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Yetki Atlama Durumu\`__ : \`${this.calculateStaff(document.points, (nextTasks[nextTasks.length-1] || { POINT: document.points }).POINT)}\``
        ]);
        embed.addField(`${client.emojis.cache.find(c => c.name === 'klowrareg2')} ..Ses Bilgileri`, voiceCategories.sort((a, b) => a.value - b.value).map((category) => `${client.emojis.cache.find(emoji => emoji.name === "klowrareg3")} __\`${category.name}\`__: **${category.points} puan**`).join("\n") || `${client.emojis.cache.find(c => c.name === 'klowrareg3')} \`Bulunamadı.\``);
        embed.addField(`${client.emojis.cache.find(c => c.name === 'klowrareg2')} ..Mesaj Bilgileri`, messageCategories.sort((a, b) => a.value - b.value).map((category) => `${client.emojis.cache.find(emoji => emoji.name === "klowrareg3")} __\`${category.name}\`__: **${category.points} puan**`).join("\n") || `${client.emojis.cache.find(c => c.name === 'klowrareg3')} \`Bulunamadı.\``);
        
        embed.addField(`${client.emojis.cache.find(c => c.name === 'klowrareg2')} ..Puan Bilgisi`, nextTasks[nextTasks.length-1] ? `${client.emojis.cache.find(c => c.name === 'klowrareg3')} __\`Puanınız\`__: **${document.points}** __\`Gereken Puan\`__: **${nextTasks[nextTasks.length-1].POINT}**\n${functions.createBar(client, document.points, nextTasks[nextTasks.length-1].POINT, 8)} ${document.points}/${nextTasks[nextTasks.length-1].POINT}` : `${client.emojis.cache.find(c => c.name === 'klowrareg3')} **Bütün görevler yapıldı!**`);
        if (nextTasks[nextTasks.length-1]) embed.addField(`${client.emojis.cache.find(c => c.name === 'klowrareg2')} Yetkili Durumu`, `${currentTasks[currentTasks.length-1] ? `Sen şuanda <@&${currentTasks[currentTasks.length-1].ID[0]}> rolündesin.` : "Hiç bir görev yapmamışsın."} <@&${nextTasks[nextTasks.length-1].ID[0]}> sonraki görevin rolü almak için **${nextTasks[nextTasks.length-1].POINT - document.points}** puana ihtiyacın var.`);

        message.lineReply(embed);
    },
    calculateStaff(currentPoint, requiredPoint) {
        let content = "Yetki Atlamaya Uygun Değil.";
        let percentage = (100 * currentPoint) / requiredPoint;
        percentage = percentage > 100 ? 100 : percentage;

        if (percentage >= 25) content = "Yetki Atlamana Daha Var.";
        if (percentage >= 50) content = "Yetkiyi Yarılamışsın."
        if (percentage >= 75) content = "Az kaldı biraz daha!"
        if (percentage === 100) content = "Hepsini Tamamlamışsın."

        return content;
    }
};
