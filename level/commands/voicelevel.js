const { MessageEmbed, MessageAttachment } = require("discord.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)
const { Rank } = require('canvacord');
const LevelModel = require('../database/Level.js');

module.exports = {
    usages: ["seslevel"],
    async execute({ client, message, args }) {
        
        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

        const memberlevel = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        const data = await LevelModel.findOne({ id: memberlevel.id }).exec();
        const rank = (await LevelModel.find({}).sort({ voiceLevel: -1, voiceCurrentXP: -1 }).exec()).findIndex(data => data.id === message.author.id)+1;
        const card = new Rank()
            .setUsername(memberlevel.username)
            .setDiscriminator(memberlevel.discriminator)
            .setRank(rank)
            .setLevel(data.voiceLevel)
            .setCurrentXP(data.voiceCurrentXP)
            .setRequiredXP(data.voiceRequiredXP)
            .setStatus(memberlevel.presence.status)
            .setAvatar(memberlevel.displayAvatarURL({ format: 'png', size: 1024 }));
        const img = new MessageAttachment(await card.build(), 'rank.png');
        message.lineReply(img);

    }
};
