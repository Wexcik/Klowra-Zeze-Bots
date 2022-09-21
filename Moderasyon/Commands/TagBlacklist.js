const { MessageEmbed } = require("discord.js");
const BlackTagModel = require('../Models/blackTag.js');

module.exports.execute = async (_, message, [option], ayar) => {
    if (!ayar.sahip.some(role => message.guild.members.cache.get(role)) && !ayar.owner.some(role => message.guild.members.cache.get(role))) return;
    
    const guildData = await BlackTagModel.findOne({ guildID: message.guild.id }) || new BlackTagModel({ guildID: message.guild.id });
    const embed = new MessageEmbed();

    if(!option) {
        embed.setFooter("Yasaklı tag eklemek/kaldırmak için: .yasaklı-tag <tag>");
        if (!guildData.taglar.length) message.lineReply(embed.setDescription(`Sunucumuz üzerinde yasaklıatılan bir tag bulunamadı.`));
        else {
            guildData.taglar.forEach((tag) => {
                message.lineReply(embed.setThumbnail(message.guild.iconURL({dynamic: true}))
                .setDescription(`
${message.guild.name} sunucumuzda yasaklı olan taglar aşağıda belirtilmiştir sunucumuzda suanda \`${guildData.taglar.length}\` tag yasaklıya atılmıştır.

                ${guildData.taglar.map(x => {
                    return {
                        Id: x,
                        Total: message.guild.members.cache.filter(u => u.user.username.includes(x)).size};
                }).sort((a, b) => b.Total - a.Total).splice(0, 15).map((wexTag, klowraTags) => `\`${klowraTags + 1}.\` **${wexTag.Id}** tagında (\`${wexTag.Total}\` kişi yasaklıya atılmış.)`).join("\n") || "\`\`\`Databasede yasaklı tag bulunamadı.\`\`\`"}`));
            });
        }
        return;
    } 

    if (!guildData.taglar.includes(option)) {
        guildData.taglar.push(option);
        guildData.save();
        message.lineReply(
            new MessageEmbed()
            .setDescription(`**${option}** başarıyla yasaklı tag listesine eklendi.`)
        );
    } else {
        guildData.taglar = guildData.taglar.filter((tag) => tag !== option);
        guildData.save();
        message.lineReply(
            new MessageEmbed()
            .setDescription(`**${option}** başarıyla yasaklı tag listesinden çıkarıldı.`)
        );
    }
};
module.exports.configuration = {
    name: 'yasaklı-tag',
    aliases: ["yasaklıtag"],
    usage: 'yasaklı-tag',
    description: 'Yasaklı tag komutu.',
    permLevel: 1
};