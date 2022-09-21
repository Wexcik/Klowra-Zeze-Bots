const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const StatsModel = require("../models/Stats.js");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)

module.exports = {
    usages: ["top"],
    async execute({ message, client }) {
        
        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        if (!functions.checkStaff(message.member)) return;

        const datas = await StatsModel.find();
        if (!datas.length) return message.lineReply("Veri bulunmamaktadır.");

        const voiceList = datas.filter((data) => data.voices.total).sort((x, y) => y.voices.total - x.voices.total).slice(0, 5).map((data, i) => `\`${i + 1}.\` <@${data.id}> ${functions.numberToString(data.voices.total)}`).join("\n");
        const messageList = datas.filter((data) => data.messages.total).sort((x, y) => y.messages.total - x.messages.total).slice(0, 5).map((data, i) => `\`${i + 1}.\` <@${data.id}> ${data.messages.total}`).join("\n");
        const pointList = datas.sort((x, y) => y.points - x.points).slice(0, 5).map((data, i) => `\`${i + 1}.\` <@${data.id}> ${data.points}`).join("\n");

        message.lineReply(
            new MessageEmbed()
                .addFields([
                    { name: "Mesaj Top 5", value: messageList || "Bulunamadı.", inline: false },
                    { name: "Ses Top 5", value: voiceList || "Bulanamadı.", inline: false },
                    { name: "Puan Top 5", value: pointList || "Bulanamadı.", inline: false }
                ])
                .setColor("RANDOM")
                .setTitle(message.guild.name)
        );
    }
};
