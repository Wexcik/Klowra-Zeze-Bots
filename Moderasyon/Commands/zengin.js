const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, conf, emoji) => {
    if(message.channel.name === conf.chatKanali && !conf.sahipRolu.some(role => message.member.roles.cache.has(role)) && !conf.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(conf.boosterRolu)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let name = args.slice(0).join(' ');
    let isim;

    if (!name) return message.lineReply('Geçerli bir isim belirtmelisin.').then(x => x.delete({ timeout: 5000 }));
    if (client.chatKoruma(name) === true) return message.lineReply('`Bu İsmi Seçemezsin!`').then(x => x.delete({timeout: 5000}));
    isim = `${message.author.username.includes(conf.tag) ? conf.tag : conf.ikinciTag} ${name}`
    if(isim.length > 32) return message.lineReply('Maksimum 32 karakter sınırı var.');
    message.member.setNickname(isim);
    message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`);
};

module.exports.configuration = {
    name: 'zengin',
    aliases: ['Zengin','boosterisim',"booster","b"],
    usage: 'zengin [isim]',
    description: 'İsminizi değiştirir.',
    permLevel: 0
};