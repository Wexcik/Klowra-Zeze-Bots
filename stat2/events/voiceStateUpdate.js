const StatsManager = require("../helpers/StatsManager.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");

module.exports = {
    name: "voiceStateUpdate",
    async execute(client, oldState, newState) {
        if (!oldState.member || oldState.member.user.bot || !functions.checkStaff(newState.member)) return;

        const now = Date.now();
        if (!oldState.channelID && newState.channelID) {
            client.voices.set(oldState.id, { 
                channel: newState.channel.parentID || newState.channelID, 
                date: now
            });
            return;
        } 
        
        if (!client.voices.has(oldState.id)) {
            client.voices.set(oldState.id, { 
                channel: oldState.channel.parentID || newState.channel.parentID || newState.channelID,
                date: now 
            });
        }

        const diff = now - client.voices.get(oldState.id).date;
        if (oldState.channelID && !newState.channelID) {
            client.voices.delete(oldState.id);
            
            await StatsManager.addVoiceStat(oldState.member, oldState.channel, diff);
        } else if (oldState.channelID && newState.channelID) {
            client.voices.set(oldState.id, {
                channel: newState.channel.parentID || newState.channelID, 
                date: now 
            });

            await StatsManager.addVoiceStat(newState.member, oldState.channel, diff);
        }
    }
};
