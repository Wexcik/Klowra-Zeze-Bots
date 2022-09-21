const { MessageEmbed, Util } = require("discord.js");
const StatsModel = require("../models/Stats.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)

module.exports = {
    usages: ["role", "role-stats", "rolestats"],
    async execute({ message, args }) {
        
        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        if (!message.member.hasPermission("ADMINISTRATOR")) return;

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) return message.lineReply("Geçerli bir rol belirtmelisin.");

        const datas = await StatsModel.find().where("id").in(role.members.map((member) => member.id)).exec();
        if (!datas.length) return message.lineReply("Belirttiğin role ait bir veri bulunmamaktadır.");

        const voiceList = datas.filter((data) => data.voices.total).sort((x, y) => y.voices.total - x.voices.total).slice(0, 5).map((data, i) => `\`${i + 1}.\` <@${data.id}> ${functions.numberToString(data.voices.total)}`).join("\n");
        const messageList = datas.filter((data) => data.messages.total).sort((x, y) => y.messages.total - x.messages.total).slice(0, 5).map((data, i) => `\`${i + 1}.\` <@${data.id}> ${data.messages.total}`).join("\n");
        const pointList = datas.sort((x, y) => y.points - x.points).slice(0, 5).map((data, i) => `\`${i + 1}.\` <@${data.id}> ${data.points} puan`).join("\n");

        message.lineReply(
            new MessageEmbed()
                .addFields([
                    { name: "Mesaj Top 5", value: messageList || "Bulunamadı.", inline: false },
                    { name: "Ses Top 5", value: voiceList || "Bulanamadı.", inline: false },
                    { name: "Puan Top 5", value: pointList || "Bulunamadı.", inline: false },
                ])
                .setColor("RANDOM")
                .setTitle(message.guild.name)
        );
    }
};
