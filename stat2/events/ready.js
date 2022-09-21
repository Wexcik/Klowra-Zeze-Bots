const StatsModel = require("../models/Stats.js");
const Cezapuan = require('../models/cezapuanı.js');
const config = require("../config.json");
const ayar = require(`${__dirname}/../../sunucuAyar.js`);

module.exports = {
    name: "ready",
    execute(client) {
        const guild = client.guilds.cache.get(config.SYSTEM.GUILD_ID);

        guild.fetchInvites().then((invites) => client.invites.set(guild.id, invites));
        
        const now = Date.now();
        guild.members.cache.filter((member) => !member.user.bot && member.voice.channelID).forEach((member) => {
            client.voices.set(member.id, {
                channel: member.voice.channel.parentID || member.voice.channelID,
                date: now
            });
        });

        setInterval(async () => {
            await checkRoles(client);
          }, 45000);

        console.log(`[${new Date().toLocaleString()}] ${client.user.tag} is online!`);
    }
};

async function checkRoles(client) {
   const guild = client.guilds.cache.get(ayar.sunucuID);
   const datas = await Cezapuan.find({ puan: 0 })
   for(const data of datas) {       
    const member = guild.members.cache.get(data.userID);
    if(!member) continue;
    
    const currentTask = client.tasks.findIndex(task => member.roles.cache.has(task.ID[0]));
        const newTask = client.tasks[currentTask-1];
        if(!newTask) continue;
        
        const channel = guild.channels.cache.find(channel => channel.name === ayar.YetkiAtlamaLog)
        if(channel) {
            await channel.send(
                `${member} yetki düştün! \`Eski Yetkin:\` ${member.roles.highest.name} \`Yeni Yetkin:\` ${(member.guild.roles.cache.get(newTask.ID[0]) || { name: '@deleted-role' }).name}`
            );
        }

        const newRoles = member._roles.filter((role) => !client.tasks[currentTask].ID.includes(role)).concat(newTask.ID);
        await member.roles.set(newRoles);
        await StatsModel.updateOne({ id: member.id }, { $set: { points: newTask.POINT } });

    data.puan = 100
    data.save();
   }
}