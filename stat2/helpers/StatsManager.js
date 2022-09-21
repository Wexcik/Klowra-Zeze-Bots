const config = require("../config.json");
const functions = require("../helpers/functions.js");
const StatsModel = require("../models/Stats.js");
const TaskModel = require("../models/Task.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`);

const cooldowns = {};

class StatsManager {
    static async addVoiceStat(member, channel, diff) {
        const category = config.SYSTEM.CHANNELS.find(category => category.TYPE === "voice" && category.ID === channel.parentID);
        if (!category) return;
        let point = category.POINT
        if (channel.id === ayar.afkChannelID) point = 5;

        await this.taskUpdate(member, "voices", diff);

        const document = await StatsModel.findOneAndUpdate(
            { id: member.id },
            {
                $inc: {
                    "voices.total": diff,
                    [`voices.channels.${channel.id}`]: diff,
                    [`voices.categories.${channel.parentID}`]: diff,
                    "points": Math.round(diff / (category.COUNT * 60000)) * point
                }
            },
            { upsert: true, new: true }
        );

        this.checkRole(member, document.points);
    }

    static async addMessageStat(message) {
        const category = config.SYSTEM.CHANNELS.find(channel => channel.TYPE === "message" && channel.ID === message.channel.parentID);
        if (!category || !functions.checkStaff(message.member)) return;

        const userCooldown = cooldowns[message.author.id] || 0;
        cooldowns[message.author.id] = userCooldown + 1;
        if (cooldowns[message.author.id] !== category.COUNT) return;
        delete cooldowns[message.author.id];

        await this.taskUpdate(message.member, "messages", 1);

        const document = await StatsModel.findOneAndUpdate(
            { id: message.member.id },
            {
                $inc: {
                    "messages.total": 1,
                    [`messages.channels.${message.channel.id}`]: 1,
                    [`messages.categories.${message.channel.parentID}`]: 1,
                    "points": category.POINT
                }
            },
            { upsert: true, new: true }
        );

        this.checkRole(message.member, document.points);
    }

    static async inviteStat(member, type = "add") {
        await this.taskUpdate(member, "invites", type === "add" ? 1 : -1);

        const document = await StatsModel.findOneAndUpdate({ id: member.id }, { $inc: { invites: type === "add" ? 1 : -1, points: type === "add" ? config.SYSTEM.INVITE_XP : -config.SYSTEM.INVITE_XP } }, { upsert: true, new: true });
        this.checkRole(member, document.points);
    }

    static async taskUpdate(member, key, value) {
        const document = await TaskModel.findOneAndUpdate({ id: member.id, [`${key}.done`]: false }, { $inc: { [`${key}.count`]: value } }, { new: true });
        if (!document) return;

        let point = 0;
        if (document.voices.count >= document.taskVoices && document.voices.done === false) {
            point += Math.round(document.voices.count / 60000 / 5);
            document.voices.done = true;
            await TaskModel.updateOne({ id: member.id }, { "voices.done": true });
        } else if (document.messages.count * 12 >= document.taskMessages && document.messages.done === false) {
            point += parseInt(document.messages.count / 12) ;
            await TaskModel.updateOne({ id: member.id }, { "messages.done": true });        
        } else if (document.registers.count >= document.taskRegisters && document.registers.done === false) {
            point += document.registers.count * 2;
            await TaskModel.updateOne({ id: member.id }, { "registers.done": true });        
        } else if (document.invites.count >= document.taskInvites && document.invites.done === false) {
            point += document.invites.count * 2;
            await TaskModel.updateOne({ id: member.id }, { "invites.done": true });
        }

        if (point !== 0) {
            const statsDocument = await StatsModel.findOneAndUpdate({ id: member.id }, { $inc: { points: point } }, { upsert: true, new: true });
            this.checkRole(member, statsDocument.points);
        }
    }

    static async checkRole(member, points) {
        const tasks = member.client.tasks.filter(task => points >= task.POINT);
        if (tasks) {
            const currentTask = tasks[tasks.length - 1];
            if (currentTask && !member.roles.cache.has(currentTask.ID[0]) && member.roles.highest.comparePositionTo(currentTask.ID[0]) <= 0) {
                const channel = member.client.channels.cache.find(c => c.name === ayar.YetkiAtlamaLog);
                if (channel) channel.send(`${member} yetki atladın! \`Eski Yetkin:\` ${member.roles.highest.name} \`Yeni Yetkin:\` ${member.guild.roles.cache.get(currentTask.ID[0]).name}`)
                const roles = member._roles.filter((role) => !(member.client.tasks[member.client.tasks.indexOf(currentTask) - 1] || { ID: [] }).ID.includes(role)).concat(currentTask.ID);
                await member.roles.set(roles);
                await StatsModel.updateOne({id: member.id}, { $set: { updateRoleDate: new Date() } }, { upsert: true })
            }
        }
    }
}

module.exports = StatsManager;
