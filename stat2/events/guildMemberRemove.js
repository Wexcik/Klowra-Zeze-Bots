const StatsModel = require("../models/Stats.js");
const StatsManager = require("../helpers/StatsManager.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");

module.exports = {
    name: "guildMemberRemove",
    async execute(client, member) {
        if (member.user.bot) return;

        const memberData = await StatsModel.findOne({ id: member.id }).select("inviter").exec();
        if (memberData && memberData.inviter) {
            const inviter = member.guild.members.cache.get(memberData.inviter);
            if (inviter && functions.checkStaff(inviter)) await StatsManager.inviteStat(inviter, "remove");
        }
    }
};
