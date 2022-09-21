const config = require("../config.json");
const TaskModel = require("../models/Task.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`);
const functions = require("../helpers/functions.js");

module.exports = {
    usages: ["görevbaşlat"],
    async execute({ client, message, args }) {
        if (!ayar.sahip.some(id => message.author.id === id)) return;
        
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);

        await TaskModel.deleteMany({});
        
    for (const member of message.guild.members.cache.filter(member => functions.checkStaff(member)).array()) {
        await TaskModel.create({ 
            id: member.id,
            voices: {
                count: 0,
                done: false
            },
            invites: {
                count: 0,
                done: false
            },
            messages: {
                count: 0,
                done: false
            },
            registers: {
                count: 0,
                done: false
            },
            taskInvites: Math.floor(Math.random() * 10) + 5,
            taskRegisters: Math.floor(Math.random() * 35) + 12,
            taskMessages: Math.floor(Math.random() * 500) + 330,
            taskVoices: Math.floor(Math.random() * 1000*60*60*4) + 1000*60*60*2,
            startTime: Date.now()
        });
    }
        message.lineReply('Görevler başlatıldı.').then(x => x.delete({timeout: 5000}))
        message.react(client.emojis.cache.find(c => c.name === 'klowratik'))
    }
}