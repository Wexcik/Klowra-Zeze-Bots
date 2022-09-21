const { MessageEmbed, Util } = require("discord.js");
const StatsModel = require("../models/Stats.js");
const StaffModel = require("../models/Staff.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)

const sendMessage = (message, content) => message.lineReply(content).then(msg => msg.delete({ timeout: 5000 }).catch(() => undefined));

module.exports = {
    usages: ["puanekle", "addpoint"],
    async execute({ client, message, args }) {
        let ekipRol = message.guild.roles.cache.get(ayar.enAltYetkiliRolu);
        const yetkiliRol = message.member.roles.cache.filter(rol => ekipRol.rawPosition <= rol.rawPosition).map(rol => rol.id)
        const StaffRole = message.member.roles.cache.some(role => yetkiliRol.includes(role.id))
        if (message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(client.emojis.cache.find(x => x.name === "klowraiptal"));
        if (!ayar.sahip.some(id => message.author.id === id) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return sendMessage(message, 'Bir kullanıcıyı etiketlemelisin yada bir id belirtmelisin!')

        let sayı = Number(parseInt(args[1]))
        if(!sayı) return sendMessage(message, 'Etkleyeceğin puan miktarını belirtmelisin!')

        await StatsModel.updateOne({ id: member.id }, { $inc: { points: sayı, addedPoint: sayı } }, { upsert: true });
        const channel = message.guild.channels.cache.find(c => c.name === ayar.YetkiAtlamaLog)
        if(channel) await channel.send(`${message.author}, ${member} kişisine ${sayı} puan ekledi.`)
        sendMessage(message, `Belirtilen kişiye belirtilen puan verildi.`)
    }
}