const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
      if (!message.author.username.includes(ayar.tag)) return message.lineReply("Yetkili başvurusu yapabilmek için öncelikle sunucu tagını ismine almalısın!\n"+ayar.tag).then(x => x.delete({timeout: 15000}));
    if (message.member.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let sorular = [
        "Neden yetkili olmak istiyorsun?",
        "Yetkililik tecrüben var mı?",
        "Haftada kaç saat aktif olabilrisin."
    ];
    let cevaplar = args.join(" ").split(" - ");
    if (!args[0] || cevaplar.length != sorular.length) return message.lineReply(`Soruları doğru doldurmalısın! (Aralarına - koymalısın! Örn: \`Ahmet 18 - Xle ilgileniyorum.\`)\nSorular: ${sorular.join("\n")}`).then(x => x.delete({timeout: 15000}));
    let basvuruEmbed = new MessageEmbed().setColor("GREEN").setFooter("Başvuruya bakıldıktan sonra lütfen mesajın altına tik bırakınız.").setTimestamp().setAuthor(`${message.author.tag} (\`${message.author.id}\`)`, message.author.avatarURL({dynamic: true})).setDescription(`${message.author} üyesinin yetkili başvurusu;`);
    for (let i = 0; i < sorular.length; i++) {
        basvuruEmbed.addField(sorular[i], cevaplar[i]);
    };
    message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`).catch()
    global.send(message.guild.channels.cache.find(x => x.name === ayar.basvuruLogKanali),`<@&${ayar.yetkilialım}>`,basvuruEmbed);

};
module.exports.configuration = {
    name: 'başvuru',
    aliases: ["basvuru"],
    usage: 'başvuru',
    description: '',
    permLevel: 0
};