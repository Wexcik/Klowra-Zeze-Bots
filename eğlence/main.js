const { Client, MessageEmbed, Collection } = require('discord.js');
require('discord-inline-reply');
const client = global.client = new Client({
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
const ayarlar = require('../sunucuAyar.js');
const Funny = require('./Models/Funny.js')
const cooldowns = global.cooldowns = new Collection();
const disbut = require('discord-buttons')
require('discord-buttons')(client)

client.dataBase = require("./Models/Funny.js");

const sayiEmojiler = {
  0: sunucuAyar.Number0,
  1: sunucuAyar.Number1,
  2: sunucuAyar.Number2,
  3: sunucuAyar.Number3,
  4: sunucuAyar.Number4,
  5: sunucuAyar.Number5,
  6: sunucuAyar.Number6,
  7: sunucuAyar.Number7,
  8: sunucuAyar.Number8,
  9: sunucuAyar.Number9
};

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
client.kullanabilir = function (id) {
  if (client.guilds.cache.get(sunucuAyar.sunucuID).members.cache.get(id).hasPermission("ADMINISTRATOR") || client.guilds.cache.get(sunucuAyar.sunucuID).members.cache.get(id).hasPermission("MANAGE_CHANNELS")) return true;
  return false;
};
fs.readdir(__dirname + "/Events", (err, files) => {
  if (err) return console.error(err);
  files.filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Events/${file}`);
    if (!prop.configuration) return;
    client.on(prop.configuration.name, prop);
  });
});
client.emoji = function (x) {
  return client.emojis.cache.get(client.emojiler[x]);
};

client.emojiSayi = function (sayi) {
  var yeniMetin = "";
  var arr = Array.from(sayi);
  for (var x = 0; x < arr.length; x++) {
    yeniMetin += (sayiEmojiler[arr[x]] === "" ? arr[x] : sayiEmojiler[arr[x]]);
  }
  return yeniMetin;
};

global.emoji = client.emoji = function (x) {
  return client.emojis.cache.get(client.emojiler[x]);
};

client.sayilariCevir = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

client.on("message", async (message, client) => {
  if (message.channel.name === ayarlar.chatKanali && Math.floor(Math.random() * 130) === 98) {
    const randomPoint = Math.floor(Math.random() * 500) + 250;
    const question = await message.channel.send(`Yere **${randomPoint}** ${message.guild.emojis.cache.find(c => c.name === 'klowracoin')} düştü. ${message.guild.emojis.cache.find(c => c.name === 'klowracoin')} emojisine ilk basan **${randomPoint}** ${message.guild.emojis.cache.find(c => c.name === 'klowracoin')} kazanır.`);
    await question.react(message.guild.emojis.cache.find(c => c.name === 'klowracoin'));
    
    const collector = await question.createReactionCollector((reaction, user) => reaction.emoji.name === "klowracoin" && message.guild.members.cache.get(user.id), { max: 1 });
    collector.on("collect", async(_, user) => {
      let kdataBase = await Funny.findOne({ guildID: message.guild.id, userID: user.id });
      if(!kdataBase) { dataBase = Funny.create({ guildID: message.guild.id, userID: user.id, klowrapara: randomPoint})};
      if(kdataBase) {
        let öncekipara = kdataBase.klowrapara || 0;
      kdataBase.klowrapara = (Number(öncekipara) + randomPoint)
      kdataBase.save();
    }
      question.edit(`**${user.tag}** yere düşen **${randomPoint}** ${message.guild.emojis.cache.find(c => c.name === 'klowracoin')} kazananı oldu`)
    });     
  }
});
client.on("message", async (message) => {
  let prefix = sunucuAyar.prefix.find(a => message.content.toLowerCase().startsWith(a));
  if (!prefix) return;
  if (message.author.bot || message.channel.type == "dm") return;
  let args = message.content.split(" ").slice(1);
  let command = message.content.split(" ")[0].slice(prefix.length);
  let bot = message.client;
  let ayar = sunucuAyar;
  let cmd = commands.get(command) || commands.get(aliases.get(command));
  if (cmd) {
    if (message.member.roles.cache.has(sunucuAyar.jailRolu) || sunucuAyar.teyitsizRolleri.some(rol => message.member.roles.cache.has(rol))) return;
    let permLevel = cmd.configuration.permLevel;
    if (permLevel == 1 && !sunucuAyar.sahipRolu.some(x => message.member.roles.cache.has(x)) && message.author.id !== message.guild.ownerID && !sunucuAyar.sahip.some(x => message.author.id === x)) return message.react("❌");
    if (permLevel == 2 && !message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MANAGE_CHANNELS")) return message.react(client.emojis.cache.find(c => c.name === 'klowraiptal'));

    if (!cmd) return;

    if (!cooldowns.has(cmd.name)) {
      cooldowns.set(cmd.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.name);
    const cooldownAmount = (cmd.configuration.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.channel.send(`** ${client.emojis.cache.find(c => c.name === 'klowrareg2')} | ${cmd.configuration.name} komutunu tekrardan kullanmak için ${timeLeft.toFixed(1)} saniye beklemelisin. **`).then(d => d.delete({timeout:5000}));
      }
    }
    
    cmd.execute(bot, message, args, ayar, client.emojiler)
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  } 
  
});

client.renk = {
  renksiz: "2F3136",
  acikturkuaz: "#1abc9c",
  koyuturkuaz: "#16a085",
  acikyesil: "#2ecc71",
  koyuyesil: "#27ae60",
  acikmavi: "#3498db",
  koyumavi: "#2980b9",
  acikmor: "#9b59b6",
  koyumor: "#8e44ad",
  sari: "#f1c40f",
  turuncu: "#f39c12",
  acikturuncu: "#e67e22",
  acikkirmizi: "#e74c3c",
  koyukirmizi: "#c0392b",
  beyaz: "#ecf0f1"
};

client.randomColor = function () {
  return client.renk[Object.keys(client.renk).random()];
};

client.cezaNumara = async function () {
  var cezaNo = await Penalty.countDocuments({ sunucuID: sunucuAyar.sunucuID });
  return cezaNo;
};

client.splitEmbedWithDesc = async function (description, author = false, footer = false, features = false) {
  let embedSize = parseInt(`${description.length / 2048}`.split('.')[0]) + 1
  let embeds = new Array()
  for (var i = 0; i < embedSize; i++) {
    let desc = description.split("").splice(i * 2048, (i + 1) * 2048)
    let x = new MessageEmbed().setDescription(desc.join(""))
    if (i == 0 && author) x.setAuthor(author.name, author.icon ? author.icon : null)
    if (i == embedSize - 1 && footer) x.setFooter(footer.name, footer.icon ? footer.icon : null)
    if (i == embedSize - 1 && features && features["setTimestamp"]) x.setTimestamp(features["setTimestamp"])
    if (features) {
      let keys = Object.keys(features)
      keys.forEach(key => {
        if (key == "setTimestamp") return
        let value = features[key]
        if (i !== 0 && key == 'setColor') x[key](value[0])
        else if (i == 0) {
          if (value.length == 2) x[key](value[0], value[1])
          else x[key](value[0])
        }
      })
    }
    embeds.push(x)
  }
  return embeds
};

Date.prototype.toTurkishFormatDate = function () {
  return moment.tz(this, "Europe/Istanbul").format('LLL');
};

client.convertDuration = (date) => {
  return moment.duration(date).format('H [saat,] m [dakika]');
};

client.tarihHesapla = (date) => {
  return moment(date).fromNow();
};

client.wait = async function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
};

const webhooks = {};
global.getWebhook = (id) => webhooks[id];
global.send = async (channel, content, options) => {
  if (webhooks[channel.id]) return (await webhooks[channel.id].send(content, options));

  let webhookss = await channel.fetchWebhooks();
  let wh = webhookss.find(e => e.name == client.user.username),
    result;
  if (!wh) {
    wh = await channel.createWebhook(client.user.username, {
      avatar: client.user.avatarURL()
    });
    webhooks[channel.id] = wh;
    result = await wh.send(content, options);
  } else {
    webhooks[channel.id] = wh;
    result = await wh.send(content, options);
  }
  return result;
};

global.reply = async (message, content, options) => {
  let channel = message.channel;
  if (webhooks[channel.id]) return (await webhooks[channel.id].send(`${message.author}, ${content}`, options));

  let webhookss = await channel.fetchWebhooks();
  let wh = webhookss.find(e => e.name == client.user.username),
    result;
  if (!wh) {
    wh = await channel.createWebhook(client.user.username, {
      avatar: client.user.avatarURL()
    });
    webhooks[channel.id] = wh;
    result = await wh.send(`${message.author} ${content}`, options);
  } else {
    webhooks[channel.id] = wh;
    result = await wh.send(`${message.author} ${content}`, options);
  }
  return result;
};

client.login(sunucuAyar.funnytoken).then(x => console.log(`Bot ${client.user.tag} olarak giriş yaptı!`)).catch(err => console.error(`Bot giriş yapamadı | Hata: ${err}`));