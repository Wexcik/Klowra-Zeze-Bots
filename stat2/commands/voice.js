const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");
const StatsModel = require("../models/Stats.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)

module.exports = {
    usages: ["voice", "voices", "voice-info", "voiceinfo"],
    async execute({ client, message, args }) {

        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        if (!functions.checkStaff(message.member)) return;

        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        const document = await StatsModel.findOne({ id: user.id }).exec();
        if (!document) return message.lineReply("Belirtilen kullanıcının verisi bulunmamaktadır.");

        const embed = new MessageEmbed().setAuthor(user.tag, user.displayAvatarURL({ dynamic: true })).setColor("RANDOM");

        const categories = [];
        Object.keys(document.voices.categories || {}).forEach((key) => {
            const value = functions.numberToString(document.voices.categories[key]);
            categories.push({
                name: config.SYSTEM.CHANNELS.find((category) => category.ID === key).NAME,
                value: value ? value : "Bulunamadı."
            });
        });
        embed.addField("Kategoriler", categories.sort((a, b) => a.value - b.value).map((category) => `${client.emojis.cache.find(emoji => emoji.name === "klowrareg")} ${category.name}: \`${category.value}\``).join("\n") || "Bulunamadı.");

        const channels = [];
        Object.keys(document.voices.channels || {}).forEach((key) => {
            const value = functions.numberToString(document.voices.channels[key]);
            channels.push({
                name: `<#${key}>`,
                value: value ? value : "Bulunamadı."
            });
        });
        embed.addField("Kanallar", channels.sort((a, b) => a.value - b.value).map((channel) => `${client.emojis.cache.find(emoji => emoji.name === "klowrareg")} ${channel.name}: \`${channel.value}\``).join("\n") || "Bulunamadı.");

        const nextTasks = client.tasks.reverse().filter(task => document.points < task.POINT)
        embed.addField("Puan Bilgisi", nextTasks[nextTasks.length-1] ? `${functions.createBar(client, document.points, nextTasks[nextTasks.length-1].POINT, 8)} ${document.points}/${nextTasks[nextTasks.length-1].POINT}` : "Bütün görevler yapıldı!");
        message.lineReply(embed);
    }
};
