const { MessageEmbed, Util } = require("discord.js");
const StatsModel = require("../models/Stats.js");
const StaffModel = require("../models/Taggeds.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)

const sendMessage = (message, content) => message.lineReply(content).then(msg => msg.delete({ timeout: 5000 }).catch(() => undefined));

module.exports = {
    usages: ["taglı", "tagli", "tag-aldı", "tag-aldi"],
    async execute({ client, message, args }) {        
        let ekipRol = message.guild.roles.cache.get(ayar.enAltYetkiliRolu);
        const yetkiliRol = message.member.roles.cache.filter(rol => ekipRol.rawPosition <= rol.rawPosition).map(rol => rol.id)
        const StaffRole = message.member.roles.cache.some(role => yetkiliRol.includes(role.id))
        if (message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(client.emojis.cache.find(x => x.name === "klowraiptal"));
        if (!ayar.sahip.some(id => message.author.id === id) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !StaffRole) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return sendMessage(message, 'Bir kişi etiketlemelisin!');
        if (member.id === message.author.id) return sendMessage(message, 'Kendini kendi taglın yapamazsın!')
        if (member.user.bot) return sendMessage(message, 'Etiketlediğin kişi bir bot olmamalı!');
        if (!member.user.tag.includes(ayar.tag)) return sendMessage(message, 'Etiketlediğin kişi taglı olmalı!');

        const hasStaff = await StaffModel.findOne({ id: member.id });
        if (hasStaff) return sendMessage(message, `Kullanıcı zaten yetkili! \`Tag aldıran kişi:\` <@${hasStaff.admin}> (\`${hasStaff.admin}\`)`);

        const question = await member.send(`${member}, **${message.author.tag}** yetkilisi sana tag aldırdığını iddia ediyor. Kabul ediyor musun?`).catch(err => { return message.lineReply(`${member}, **${message.author.tag}** yetkilisi sana tag aldırdığını iddia ediyor. Kabul ediyor musun?`)});
        question.react(client.emojis.cache.find(c => c.name === 'klowratik'));

        const collected = await question.awaitReactions((react, user) => react.emoji.name == 'klowratik' && member.id == user.id, { time: 60000, max: 1 });

        if (collected.size > 0) {
            question.reactions.removeAll().catch(() => false);
            question.delete()
            if(!member.roles.cache.has(config.SYSTEM.MAN_ROL_ID) && !member.roles.cache.has(config.SYSTEM.GIRL_ROL_ID)) {
                await StatsModel.updateOne({ id: message.author.id }, { $inc: { points: config.SYSTEM.TAGGED_XP.BİLİNMEYEN_XP } }, { upsert: true });
                await StaffModel.create({ id: member.id, admin: message.author.id, date: Date.now(), cinsiyet: 'Bilinmeyen' });
            }
            if(member.roles.cache.has(config.SYSTEM.MAN_ROL_ID)) {
                await StatsModel.updateOne({ id: message.author.id }, { $inc: { points: config.SYSTEM.TAGGED_XP.MAN_XP } }, { upsert: true });
                await StaffModel.create({ id: member.id, admin: message.author.id, date: Date.now(), cinsiyet: 'Erkek' });
            }
            if(member.roles.cache.has(config.SYSTEM.GIRL_ROL_ID)) {
                await StatsModel.updateOne({ id: message.author.id }, { $inc: { points: config.SYSTEM.TAGGED_XP.GIRL_XP } }, { upsert: true });
                await StaffModel.create({ id: member.id, admin: message.author.id, date: Date.now(), cinsiyet: 'Kız' });
            }
            sendMessage(message, 'Kullanıcı taglı olmayı kabul etti.');

            const channel = message.guild.channels.cache.find(channel => channel.name === ayar.ekipLogKanali)
            if (channel) await channel.send(`${message.author} Bir üyeye tagımızı aldırdı! Tagımızı aldırdığı üye ${member}. Ailemizi büyüttüğün için teşekkür ederim.\n\`────────────────────────\``);
        }
    }
}