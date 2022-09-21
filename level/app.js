const { Client, Collection } = require('discord.js');
const { readdirSync } = require("fs");
const { connect } = require('mongoose');
require('discord-inline-reply');
const conf = require('../sunucuAyar.js');

const client = new Client();
client.commands = new Collection();
client.invites = new Collection();
client.voices = new Collection();

connect(conf.mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

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

client.login(conf.LevelBotToken);
