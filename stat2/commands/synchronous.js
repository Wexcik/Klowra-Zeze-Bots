const { MessageEmbed, Util } = require("discord.js");
const StatsModel = require("../models/Stats.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)

module.exports = {
    usages: ["senkronize"],
    async execute({ client, message, args }) {
        
        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        if (!message.member.hasPermission("ADMINISTRATOR") && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id) && !ayar.yetkilialım.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

        if (args[0] && args[0].toLowerCase() === "tüm") {
            if (!ayar.sahip.some(id => message.author.id === id) && message.author.id !== message.guild.ownerID) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
            message.guild.members.cache.filter((member) => functions.checkStaff(member)).forEach(async (member) => {
                const task = client.tasks.filter((task) => task.ID.every((role) => member.roles.cache.has(role)));
                if (task[task.length - 1]) await StatsModel.updateOne({ id: member.id }, { points: task[task.length - 1].POINT }, { upsert: true });
            });

            message.react(client.emojis.cache.find(emoji => emoji.name === "klowratik"));
            return;
        }

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.lineReply("Geçerli bir argüman belirtmelisin. `@Klowra` veya `tüm` yapabilirsin.");

        const task = client.tasks.filter((task) => task.ID.every((role) => member.roles.cache.has(role)));
        if (task[task.length - 1]) await StatsModel.updateOne({ id: member.id }, { points: task[task.length - 1].POINT }, { upsert: true });
        message.react(client.emojis.cache.find(emoji => emoji.name === "klowratik"));
    }
};
