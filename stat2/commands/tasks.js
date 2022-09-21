const { MessageEmbed, Util } = require("discord.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)

module.exports = {
    usages: ["tasks"],
    execute({ message }) {
        
        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        if (!functions.checkStaff(message.member)) return;

        const texts = Util.splitMessage(config.SYSTEM.TASKS.map((task) => `\`${task.NAME} (${task.POINT} puan)\`: ${task.ID.map((id) => `<@&${id}>`).join(", ")}`), { maxLength: 2000, char: "\n" });
        const embed = new MessageEmbed().setColor("BLACK");
        for (const newText of texts) message.lineReply(embed.setDescription(newText));
    }
};
