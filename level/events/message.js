const LevelModel = require('../database/Level.js');
const FunnyModel = require('../database/Funny.js');
const config = require("../../sunucuAyar.js");
const { MessageEmbed, Collection } = require('discord.js');
const cooldowns = new Collection();

module.exports = {
    name: "message",
    async execute(client, message) {
        if (!message.guild || message.author.bot) return;

        const [commandName, ...args] = message.content.slice(config.levelprefix.length).trim().split(" ");
        const command = client.commands.find(alias => alias.usages.includes(commandName));
        if (command) return command.execute({ client, message, args });

        const cooldown = cooldowns.get(message.author.id);
        if (cooldown && cooldown.start < cooldown.finish) return;

        const data = await LevelModel.findOne({ id: message.author.id }) || await LevelModel.create({ id: message.author.id });

        data.messageCurrentXP += Number(Math.floor(Math.random() * (25 - 15 + 1)) + 15);
        if (data.messageCurrentXP >= data.messageRequiredXP) {
            data.messageLevel += 1;
            data.messageRequiredXP = 5 * (Math.pow(data.messageLevel, 2)) + 50 * data.messageLevel + 100;
            data.messageCurrentXP = +Number(data.messageRequiredXP - data.messageCurrentXP);

            const newRole = config.chatroles[data.messageLevel];
            if (newRole) {
                const roles = Object.values(config.chatroles).reduce((a, b) => a.concat(b), []).filter(role => message.member.roles.cache.has(role));
                if (roles.length) await message.member.roles.remove(roles);
                await message.member.roles.add(newRole);
            }
            const klowraMoney = data.messageLevel < 10 ? 1000 : 10000;
            if (klowraMoney > 0) {
                await FunnyModel.updateOne(
                    { userID: message.author.id, guildID: config.sunucuID },
                    { $inc: { klowrapara: klowraMoney } },
                    { upsert: true }
                );
    
                const channel = client.channels.cache.find((channel) => channel.name === config.levellog);
                if (channel) {
                    const klowrareg2 = client.emojis.cache.find(c => c.name === 'klowrareg2');
                    const klowracoin = client.emojis.cache.find(c => c.name === 'klowracoin');
                    channel.send(new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true, size: 2048 }))
                            .setTitle(`${klowrareg2} Mesajda Level Atladın! ${klowrareg2}`)
                            .setDescription(`${klowrareg2} **${data.messageLevel}** leveline ulaştı! ${klowraMoney} ${klowracoin} kazandın. Tebrikler!!!`)
                            .setTimestamp()
                            .setFooter('Klowra was here...')
                            .setColor('BLACK')
                    );
                }
            }
        }


        await data.save();

        const now = Date.now();
        cooldowns.set(message.author.id, {
            start: now,
            finish: 1000 * 60
        });
    }
};
