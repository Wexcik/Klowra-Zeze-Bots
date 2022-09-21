const StatsManager = require("../helpers/StatsManager.js");
const StatsModel = require("../models/Stats.js");
const config = require("../config.json");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`);

module.exports = {
    name: "message",
    async execute(client, message, category) {
        if (!message.guild || message.author.bot) return;

        const [commandName, ...args] = message.content.slice(config.BOT.PREFIX.length).trim().split(" ");
        const command = client.commands.find(alias => alias.usages.includes(commandName));
        if (command) return command.execute({ client, message, args });

        if (message.channel.name === ayar.chatKanali && Math.floor(Math.random() * 130) === 98) {
            const randomPoint = Math.floor(Math.random() * 50) + 10;
			const question = await message.channel.send(`Havadan **${randomPoint}** puan düştü. 🪙 emojisine ilk basan kazanır!`);
			await question.react("🪙");

            const collector = await question.createReactionCollector((reaction, user) => reaction.emoji.name === "🪙" && functions.checkStaff(message.guild.members.cache.get(user.id)), { max: 1 });
            collector.on("collect", async(_, user) => {
                await StatsModel.updateOne({ id: user.id }, { $inc: { points: randomPoint } }, { upsert: true })
                question.edit(`**${user.tag}** adlı kullanıcı emojiye basan kişi oldu ve **${randomPoint}** puan kazandı.`)
            });
        }

        await StatsManager.addMessageStat(message);
    }
};
