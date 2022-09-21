const StatsModel = require("../models/Stats.js");
const { MessageEmbed } = require("discord.js")
const StatsManager = require("../helpers/StatsManager.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");
const LevelModel = require(__dirname + './../models/Level.js');
const Funny = require(__dirname + './../models/Funny.js');
const conf = require(__dirname + "./../../sunucuAyar.js")

module.exports = {
    name: "guildMemberAdd",
    async execute(client, member) {
        if (member.user.bot) return;

        const isFake = (Date.now() - member.user.createdTimestamp) < 7 * 24 * 60 * 60 * 1000;
        const beforeInvites = (client.invites.get(member.guild.id) || new Collection()).clone();
        const afterInvites = await member.guild.fetchInvites();
        client.invites.set(member.guild.id, afterInvites);

        const invite = afterInvites.find((inv) => beforeInvites.has(inv.code) && beforeInvites.get(inv.code).uses < inv.uses) || beforeInvites.find((inv) => afterInvites.has(inv.code));

        if (invite && invite.inviter && invite.inviter.id !== member.id && !isFake) {
            await StatsModel.updateOne({ id: member.id }, { inviter: invite.inviter.id }, { upsert: true });
        
            const inviter = member.guild.members.cache.get(invite.inviter.id);
            if (inviter && functions.checkStaff(inviter)) await StatsManager.inviteStat(inviter, "add");
        }
    }
};
