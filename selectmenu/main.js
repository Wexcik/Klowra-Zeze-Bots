const { Client, MessageEmbed, Intents, Collection, APIMessage } = require('discord.js');
const client = global.client = new Client({
  fetchAllMembers: true, ws: {
    intents: new Intents(Intents.ALL).remove([
      "GUILD_BANS",
      "GUILD_EMOJIS",
      "GUILD_INTEGRATIONS",
      "GUILD_INVITES",
      "GUILD_MESSAGE_TYPING",
      "DIRECT_MESSAGES",
      "DIRECT_MESSAGE_REACTIONS",
      "DIRECT_MESSAGE_TYPING"
    ])
  }
});
const sunucuAyar = global.sunucuAyar = require("../sunucuAyar.js");
const mongoose = require('mongoose');
mongoose.connect(sunucuAyar.mongodb, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const Penalty = require('./Models/Penalty.js');
const moment = require('moment');
require('moment-duration-format');
require('moment-timezone');
moment.locale('tr');
const fs = require("fs");
require('discord-inline-reply');

const commands = global.commands = new Collection();
const aliases = global.aliases = new Collection();
global.client = client;
fs.readdir(__dirname + "/Commands", (err, files) => {
  if (err) return console.error(err);
  files = files.filter(file => file.endsWith(".js"));
  console.log(`${files.length} komut yüklenecek.`);
  files.forEach(file => {
    let prop = require(`./Commands/${file}`);
    if (!prop.configuration) return;
    if (typeof prop.onLoad === "function") prop.onLoad(client);
    commands.set(prop.configuration.name, prop);
    if (prop.configuration.aliases) prop.configuration.aliases.forEach(aliase => aliases.set(aliase, prop.configuration.name));
  });
});
fs.readdir(__dirname + "/Events", (err, files) => {
  if (err) return console.error(err);
  files.filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Events/${file}`);
    if (!prop.configuration) return;
    client.on(prop.configuration.name, prop);
  });
});

client.on("message", async (message) => {
  let prefix = sunucuAyar.prefix.find(a => message.content.toLowerCase().startsWith(a));
  if (!prefix) return;
  if (message.author.bot || message.channel.type == "dm") return;
  let args = message.content.split(" ").slice(1);
  let command = message.content.split(" ")[0].slice(prefix.length);
  let bot = message.client;
  const data = require('../Models/sunucuAyar.js')
  let ayar = await data.find();
  let cmd = commands.get(command) || commands.get(aliases.get(command));
  if (cmd) {
    if (message.member.roles.cache.has(sunucuAyar.jailRolu) || sunucuAyar.teyitsizRolleri.some(rol => message.member.roles.cache.has(rol))) return;
    let permLevel = cmd.configuration.permLevel;
    if (permLevel == 1 && !sunucuAyar.sahipRolu.some(x => message.member.roles.cache.has(x)) && message.author.id !== message.guild.ownerID && !sunucuAyar.sahip.some(x => message.author.id === x)) return message.react("❌");
    if (permLevel == 2 && !message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MANAGE_CHANNELS")) return message.react("❌");
    cmd.execute(bot, message, args, ayar, client.emojiler);
  };
});
client.login(sunucuAyar.token).then(x => console.log(`Bot ${client.user.tag} olarak giriş yaptı!`)).catch(err => console.error(`Bot giriş yapamadı | Hata: ${err}`));