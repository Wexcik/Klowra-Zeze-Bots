const { MessageEmbed } = require("discord.js");
const TaskModel = require("../models/Task.js");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)

module.exports = {
    usages: ["görev", "görevlerim"],
    async execute({ client, message, args }) {
        
        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        if (!functions.checkStaff(message.member)) return;

        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        const document = await TaskModel.findOne({ id: user.id });
        if (!document) return message.lineReply("Belirtilen kullanıcının verisi bulunmamaktadır.");

        const embed = new MessageEmbed().setAuthor(user.tag, user.displayAvatarURL({ dynamic: true })).setColor("RANDOM").setThumbnail("https://img.itch.zone/aW1nLzIzNzE5MzEuZ2lm/original/GcEpW9.gif");

        let now = new Date();

        embed.setDescription(`**Bu günün görevleri \`${functions.numberToString((new Date((now.getMonth()+1) + " " + (now.getDate() + 1) + " " + now.getFullYear()).getTime() - Date.now()))}\` sonra yenilenecektir.**\nBu görevler sana ekstra puan verecektir.`);
        embed.addField(
            "Arkadaşlarını Sunucuya Davet Et!", 
            `${functions.createBar(client, document.invites.count || 0, document.taskInvites, 8)} \`${document.taskInvites <= document.invites.count ? "Tamamlandı." : `${document.invites.count || 0} / ${document.taskInvites}`}\`\n**Ödül:** \`${document.taskInvites * 2} puan\``
        );
        embed.addField(
            "Arkadaşlarınla Chatte Vakit Geçir!", 
            `${functions.createBar(client, document.messages.count || 0, document.taskMessages, 8)} \`${document.taskMessages <= document.messages.count ? "Tamamlandı." : `${document.messages.count * 12 || 0} / ${document.taskMessages}`} \`\n**Ödül:** \`${parseInt(document.taskMessages / 12 || 0)} puan\``
        ); 
        embed.addField(
            "Arkadaşlarını Kayıt Et!", 
            `${functions.createBar(client, document.registers.count || 0, document.taskRegisters, 8)} \`${document.taskRegisters <= document.registers.count ? "Tamamlandı." : `${document.registers.count || 0} / ${document.taskRegisters}`}\`\n**Ödül:** \`${document.taskRegisters * 2} puan\``
        );
        embed.addField(
            "Arkadaşlarınla Seste Vakit Geçir!", 
            `${functions.createBar(client, document.voices.count || 0, document.taskVoices, 8)} \`${document.taskVoices <= document.voices.count ? "Tamamlandı." : `${functions.numberToString(document.voices.count || 0) || "0 saniye"} / ${functions.numberToString(document.taskVoices)}`}\`\n**Ödül:** \`${parseInt(Math.round(document.taskVoices / 60000) / 5)} puan\``
        );

        message.lineReply(embed);
    }
};
