const { Client, Collection } = require("discord.js");
require('discord-inline-reply');
const { readdirSync } = require("fs");
const mongoose = require("mongoose");
const config = require("./config.json");
const { CronJob } = require("cron");
const functions = require("./helpers/functions.js")
const TaskModel = require("./models/Task.js");
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
moment.locale('tr');

const client = new Client({
    presence: {
        status: "invisible"
    }
});
client.tasks = config.SYSTEM.TASKS.sort((a, b) => a.POINT - b.POINT);
client.commands = new Collection();
client.invites = new Collection();
client.voices = new Collection();
Date.prototype.toTurkishFormatDate = function () {
    return moment.tz(this, "Europe/Istanbul").format('LLL');
};

const job = new CronJob("00 00 00 * * *", async function() {
    const guild = client.guilds.cache.get(config.SYSTEM.GUILD_ID);

    await TaskModel.deleteMany({});
        
    for (const member of guild.members.cache.filter(member => functions.checkStaff(member)).array()) {
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
}, null, true, "Europe/Istanbul");
job.start();

const commandFiles = readdirSync(`${__dirname}/commands`);
for (const fileName of commandFiles) {
    const file = require(`./commands/${fileName}`);
    client.commands.set(file.usages[0], file);
}

const eventFiles = readdirSync(`${__dirname}/events`);
for (const fileName of eventFiles) {
    const file = require(`./events/${fileName}`);
    client.on(file.name, (...args) => file.execute(client, ...args));
}

mongoose.connect(config.BOT.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
});

client.login(config.BOT.TOKEN);
