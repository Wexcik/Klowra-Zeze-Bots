const { MessageEmbed, Util } = require("discord.js");
const StatsModel = require("../models/Stats.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)

const sendMessage = (message, content) => message.lineReply(content).then(msg => msg.delete({ timeout: 5000 }).catch(() => undefined));

module.exports = {
    usages: ["ytdüşür"],
    async execute({ client, message, args }) {       
        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(client.emojis.cache.find(x => x.name === "klowraiptal"));
        if(!ayar.sahip.some(id => message.author.id === id) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return sendMessage(message, 'Bir kişi etiketlemelisin!');
        if (member.user.bot) return sendMessage(message, 'Etiketlediğin kişi bir bot olmamalı!');

        const roles = [].concat(...client.tasks.map(task => task.ID));
        if (!member.roles.cache.some(role => roles.includes(role.id))) return sendMessage(message, 'Kullanıcının yetkisi yok?');

        const currentTask = client.tasks.findIndex(task => member.roles.cache.has(task.ID[0]));
        const newTask = client.tasks[currentTask-1];
        if(!newTask) return sendMessage(message, 'Yetkili ilk görevde!');
        
        const channel = message.guild.channels.cache.find(channel => channel.name === ayar.YetkiAtlamaLog)
        if(channel) {
            await channel.send(
                `${member} yetki düştün! \`Eski Yetkin:\` ${member.roles.highest.name} \`Yeni Yetkin:\` ${(member.guild.roles.cache.get(newTask.ID[0]) || { name: '@deleted-role' }).name}`
            );
        }

        const newRoles = member._roles.filter((role) => !client.tasks[currentTask].ID.includes(role)).concat(newTask.ID);
        await member.roles.set(newRoles);
        await StatsModel.updateOne({ id: member.id }, { $set: { points: newTask.POINT } }, { upsert: true });
    
        sendMessage(message, `${member} adlı yetkilinin yetkisini düşürdün.`);
    }
}