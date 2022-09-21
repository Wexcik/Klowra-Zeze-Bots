const config = require("../config.json");
const StatsModel = require("../models/Stats.js");
const TaskModel = require("../models/Task.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)
const TaggedModel = require("../models/Taggeds.js");
const StaffModel = require("../models/Staff.js");

module.exports = {
    usages: ["reset-stats"],
    async execute({ client, message, args }) {
        
        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        if (!ayar.yetkilialım.some(role => message.member.roles.cache.has(role)) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

        if (args[0] && args[0].toLowerCase() === "tüm") {
            if (!ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
            await StatsModel.deleteMany();
            await TaskModel.deleteMany({});
            await TaggedModel.deleteMany({})
            await StaffModel.deleteMany({})
            message.lineReply("Başarıyla bütün veriler silindi.");
            return;
        }

        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (user) {
            await StatsModel.deleteOne({ id: user.id });
            await TaskModel.deleteMany({ id: user.id });
            await TaggedModel.deleteMany({ admin: user.id })
            await StaffModel.deleteMany({ admin: user.id })
            message.lineReply("Başarıyla belirtilen kullanıcnın verileri silindi.");
            return;
        }

        message.lineReply("Geçerli bir argüman belirtiniz.");
    }
};
