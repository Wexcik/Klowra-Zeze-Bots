const { MessageEmbed } = require('discord.js');
const Member = require('../Models/Member.js');
const  prefix  = [".","!","a!"]
const button = ("discord-buttons.js")

module.exports.onLoad = (client) => {
    client.on('message', async message => {
        if (!message.guild || message.author.bot || message.content.toLowerCase().includes(`${prefix}afk`)) return;
        let embed = new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }));
        if (message.mentions.users.size >= 1) {
            let victim = message.mentions.users.first();
            let victimData = await Member.findOne({ guildID: message.guild.id, userID: victim.id });
            if (victimData) {
                let afkData = victimData.afk || {};
                if (afkData.mod) message.lineReply(embed.setDescription(`${victim} adlı üye ${afkData.sebep ? `**${afkData.sebep}** sebebiyle ` : ''}${client.tarihHesapla(afkData.sure)} AFK oldu.`)).then(x => x.delete({ timeout: 10000 }));
            }
        }
        let authorData = await Member.findOne({ guildID: message.guild.id, userID: message.author.id });
        if (authorData) {
            let afkVeri = authorData.afk || {};
            if (afkVeri.mod) {
                if (message.member.manageable) message.member.setNickname(message.member.displayName.replace('💤', '')).catch(() => {
                    return undefined;
                });
                authorData.afk = {};
                authorData.save();
                message.lineReply('artık AFK değilsin!').then(x => x.delete({ timeout: 5000 }));
            }
        }
    });
};
module.exports.execute = (client, message, args, ayar) => {
    let sebep = args.filter(arg => arg !== '' && !arg.includes('\n\n')).join(' ');
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (client.chatKoruma(sebep) === true) return message.lineReply('`Geçerli bir AFK sebebi belirtmelisin`').then(x => x.delete({ timeout: 5000 }));
    Member.findOne({ guildID: message.guild.id, userID: message.author.id }, (err, data) => {
        if (!data) {
            let newMember = new Member({
                guildID: message.guild.id,
                userID: message.author.id,
                afk: {
                    mod: true,
                    sebep,
                    sure: new Date()
                },
                history: [],
                yetkili: new Map()
            });
            newMember.save();
        } else {
            data.afk = {
                mod: true,
                sebep,
                sure: new Date()
            };
            data.save();
        }
    });
    message.delete({ timeout: 5000 })
    if (message.member.manageable && !message.member.displayName.includes('💤')) message.member.setNickname(`${message.member.displayName} 💤`).catch(() => { return undefined; });
    message.lineReply('`Başarıyla AFK moduna girdin! Bir şey yazana kadar AFK sayılacaksın!`').then(x => x.delete({ timeout: 5000 }).catch(() => {
        return undefined;
    }));
};
module.exports.configuration = {
    name: 'afk',
    aliases: [],
    usage: 'afk [isterseniz sebep]',
    description: 'AFK moduna girmenizi sağlar.',
    permLevel: 0
};