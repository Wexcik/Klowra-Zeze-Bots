const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js')

module.exports.execute = async (client, message, args, ayar) => {

    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        const datas = await Funny.find({}).sort({ klowrapara: -1 }).exec();
        const topsayı = Number(args[0])
        let list = datas.filter((data) => message.guild.members.cache.get(data.userID) && !ayar.sahip.some(id => data.userID === id)).map((data, i) => `**\`${i + 1}.\`** <@${data.userID}> • **${data.klowrapara} ${client.emojis.cache.find(c => c.name === 'klowracoin')}**`);
        if (list.length < 1) return message.lineReply('Üzgünüm veri bulamadım.');
        message.lineReply(new MessageEmbed().setAuthor(`${message.author.tag}`, message.author.avatarURL({dynamic: true, size: 2048})).setDescription([
            `**${message.guild.name}** Money Top#${topsayı ? topsayı : '1-10'}.\n${topsayı > 9 ? list.slice(Number(topsayı), Number(topsayı+10)).join("\n") : list.slice(0,10).join("\n")}`,
        ]).setTimestamp().setFooter('Klowra was here...').setColor('BLACK'));
}
module.exports.configuration = {
    name: 'topmoney',
    aliases: [],
    usage: 'topmoney 10',
    description: 'Sunucunun para sıralamasını görürsünüz.',
    permLevel: 0,
    cooldown: 5
}