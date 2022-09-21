const StatsModel = require("../models/Stats.js");
const TaggedModel = require("../models/Taggeds.js");
const MemberStatsModel = require("../models/MemberStats.js");
const MemberModel = require("../models/Member.js");
const StaffModel = require("../models/Staff.js");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)
const { table } = require('table');

const sendMessage = (message, content) => message.lineReply(content).then(msg => msg.delete({ timeout: 5000 }).catch(() => undefined));
const tableConfig = {
    border: {
        topBody: '-',
        topJoin: '',
        topLeft: '',
        topRight: '',
        bottomBody: '',
        bottomJoin: '',
        bottomLeft: '',
        bottomRight: '',
        bodyLeft: '│',
        bodyRight: '│',
        bodyJoin: '│',
        joinBody: '',
        joinLeft: '',
        joinRight: '',
        joinJoin: '',
    },
};

module.exports = {
    usages: ["taglılarım", "taglılar"],
    async execute({ client, message, args }) {
        let ekipRol = message.guild.roles.cache.get(ayar.enAltYetkiliRolu);
        const yetkiliRoll = message.member.roles.cache.filter(rol => ekipRol.rawPosition <= rol.rawPosition).map(rol => rol.id)
        const StaffRolesss = message.member.roles.cache.some(role => yetkiliRoll.includes(role.id))
        if (message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(client.emojis.cache.find(x => x.name === "klowraiptal"));
        if (!ayar.sahip.some(id => message.author.id === id) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !StaffRolesss) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

        let yetkili = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
        const tagged = await TaggedModel.find({ admin: yetkili.id });
        if (!tagged.length) return sendMessage(message, 'Taglı bulunamadı.');

        const tableArray = [['Isim', 'Cinsiyet', 'Tarih', 'Kayıt', 'Ses', 'Mesaj', 'Davet', 'Taglıları', 'Yetkilileri', 'Durum']];
        for (const staff of tagged) {
            const stats2 = await StatsModel.findOne({ id: staff.id }) || {}
            const stats = await MemberStatsModel.findOne({ guildID: message.guild.id, userID: staff.id }) || {};
            const taggeds = await TaggedModel.find({ admin: staff.id });
			const memberData = await MemberModel.findOne({ guildID: message.guild.id, userID: staff.id });
            const staffStaffs = await StaffModel.find({ admin: staff.id });
            const member = message.guild.members.cache.get(staff.id);
            const StaffRole = member ? member.user.username.includes(ayar.tag) : false;
            const user = await client.users.fetch(staff.id);
            tableArray.push([
                `${user.tag} (${user.id})`,
                staff.cinsiyet,
                new Date(staff.date).toTurkishFormatDate(),
                (memberData.yetkili.get("erkekTeyit") || 0) + (memberData.yetkili.get("kizTeyit") || 0),
                functions.numberToString(stats.totalVoiceStats || 0),
                stats.totalChatStats || 0,
                stats2.invites || 0,
                taggeds.length,
                staffStaffs.length,
                member ? (StaffRole ? 'Taglı' : 'Taglı değil!') : 'Sunucuda yok!'
            ]);
        }

        message.channel.send(table(tableArray, tableConfig), { split: true, code: 'fix' });
    }
}