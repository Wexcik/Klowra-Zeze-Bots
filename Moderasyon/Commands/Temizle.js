const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(embed.setDescription('Bu komutu kullanabilmek için **Mesajları Yönet** iznine sahip olmalısın!')).then(x => x.delete({ timeout: 5000 }));
    if (!args[0] || (args[0] && isNaN(args[0])) || Number(args[0]) < 1 || Number(args[0]) > 100) return message.lineReply(embed.setDescription('1-100 arasında silinecek mesaj miktarı belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    await message.delete().catch(() => {
        return undefined;
    });
    message.channel.bulkDelete(Number(args[0])).then(msjlar => message.lineReply(embed.setDescription(`Başarıyla **${msjlar.size}** adet mesaj silindi!`)).then(x => x.delete({ timeout: 5000 }))).catch(() => {
        return undefined;
    });
};
module.exports.configuration = {
    name: 'temizle',
    aliases: ['sil', 'clear'],
    usage: 'temizle 1-100',
    description: 'Belirtilen mesaj sayısı kadar mesaj temizler.',
    permLevel: 0
};