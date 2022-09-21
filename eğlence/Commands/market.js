const fs = require("fs");
const shop = require('../Models/market.js');
const Funny = require('../Models/Funny.js')
const { MessageEmbed } = require('discord.js');

module.exports.execute = async(client, message, args, ayar) => {
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
     let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("RANDOM");
    if(!args[0]) return message.lineReply("\`envanter\`,\`al\`,\`liste\`,\`ekle\` veya \`sil\` argümanlarını kullanmalısın.");
    if(args[0] === "ekle") {
        if (!ayar.sahipRolu.some(r => message.member.roles.cache.has(r)) && !ayar.sahip.some(id => message.author.id === id)) return;
        const fiyat = Number(args[1]);
        if(!fiyat) return message.lineReply("Bir fiyat girmelisin.").then(x => x.delete({timeout: 5000}));
        const isim = args.slice(2).join(" ");
        if(!isim) message.lineReply("Bir urun ismi girmelisin").then(x => x.delete({timeout: 5000}));
        const sayı = await shop.findById(message.guild.id) || { envanter: [] } ;
        const hesapla = sayı.envanter.length
        let ürünno = hesapla ? hesapla + 1 : 1
        shop.findById(message.guild.id, async(err, variables) => {
            if(err) return console.log(err);
            if(!variables) {
                await new shop({
                    _id: message.guild.id,
                    envanter: [{ ürünno, isim, fiyat, durum: true }]
                }).save();
            } else {
                if(variables.envanter.some(x => x.isim === isim)) {
                    variables.envanter = variables.envanter.filter(x => x.isim !== isim);
                }
                variables.envanter.push({ürünno, isim, fiyat, durum: true });
                await variables.save();
            }
        });
        return message.lineReply(`\`${isim}\` ürünü **${fiyat}** fiyatıyla markete eklendi!`).then(x => x.delete({timeout: 5000}));
    } else if(args[0] === "sil") { 
        if (!ayar.sahipRolu.some(r => message.member.roles.cache.has(r)) && !ayar.sahip.some(id => message.author.id === id)) return;
        const marketVeri = await shop.findById(message.guild.id) || { envanter: []};
        let sayı = marketVeri.envanter.find(x => x.ürünno == Number(args[1]));
        const isim = args.slice(1).join(" ");
        if(!isim) return message.lineReply("Bir ürün ismi girmelisin");
        if(!sayı) return message.lineReply('Belirttiğiniz numaraya ait ürün bulunamadı.')
        const eşya = marketVeri.envanter.find(x => x.ürünno == sayı.ürünno || x.isim == isim)
        const ürün = marketVeri.envanter.some(urun => urun.isim === isim || urun.ürünno === sayı.ürünno)
        if(!marketVeri && !ürün) return message.lineReply("Markette böyle bir ürün bulunamadı.");
        marketVeri.envanter = marketVeri.envanter.filter(urun => urun.isim !== isim && urun.ürünno !== sayı.ürünno);
        await marketVeri.save();
        return message.lineReply(`\`${eşya.isim}\` ürünü marketten kaldırıldı!`);
    } else if(args[0] === "liste") {  
        const marketVeri = await shop.findById(message.guild.id) || { envanter: [] };
        let dataBase = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id})
        if(!dataBase){ dataBase = Funny.create({ guildID: message.guild.id, userID: message.author.id})}
        let klowracoin = dataBase.coin
        message.lineReply(
            new MessageEmbed()
            .setAuthor("MARKET ÜRÜN LİSTESİ").setFooter(`Unutma Bu Bir Sır! Mevcut Coinin: ${klowracoin}`).setThumbnail("https://cdn.discordapp.com/attachments/768538059607113748/796120799198445648/coininfo.png").setColor("GOLD")
            .setDescription(marketVeri.envanter.length < 1 ? "Herhangi bir ürün bulunamadı." : `${marketVeri.envanter.map(urun => `**${urun.ürünno}**=> Ürün: **${urun.isim}** | Fiyat: **${urun.fiyat}**`).join("\n")}`)
        );
    } else if(args[0] === "envanter") {
        const user = message.mentions.users.first() || client.users.cache.get(args[1]) || message.author;
        const envanterVeri = await shop.findById(user.id) || { envanter: [] };
        message.lineReply(
            new MessageEmbed()
            .setTitle('ENVANTER').setAuthor(user.tag.replace('`',""), `${user.avatarURL({ dynamic: true })}`).setFooter(ayar.durum[0]).setThumbnail("https://cdn.discordapp.com/attachments/768538059607113748/796120799198445648/coininfo.png").setColor("GOLD")
            .setDescription(envanterVeri.envanter.length < 1 ? "Herhangi bir satın aldığın ürün bulunamadı." : `${envanterVeri.envanter.filter(urun => urun.durum === true).map(urun => `**-** \`${urun.ürünno}\` => **${urun.isim}**`).join("\n")}`)
        ).then(x => x.delete({timeout: 5000}));
    } else if(args[0] === "al") {
        let stok = await shop.findById(message.guild.id) || { envanter: [] };
        let dataBase = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id})
        if(!dataBase) { dataBase = Funny.create({ guildID: message.guild.id, userID: message.author.id}) }
        let esya = stok.envanter.find(x => x.isim.toLowerCase() == args.slice(1).join(" ").toLowerCase() || x.ürünno == Number(args[1]));
        let klowracoin = dataBase.coin
        if(klowracoin <= 0) return message.lineReply('Hiç coinin yok. Klowraparanı dönüştürmeyi dene. Örn: .dönüştür')
        if (!esya) return  message.lineReply(new MessageEmbed().setDescription("Markette belirtilen isimde eşya bulunamadı!")).then(x => x.delete({ timeout: 5000 }));
        if (klowracoin < esya.fiyat) return  message.lineReply(`Bakiyen bu eşyayı almaya yetmiyor! (Bakiyen: ${klowracoin})`);
        await shop.findByIdAndUpdate(message.author.id, { $push: { envanter: esya}}, { upsert: true, setDefaultsOnInsert: true });
        let dataBaseb = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id})
        let öncekipara = dataBaseb.coin || 0;
        dataBaseb.coin = (Number(öncekipara) - esya.fiyat)
        dataBaseb.save()
        return message.lineReply(new MessageEmbed().setDescription("Alınan eşya başarıyla envanterinize eklendi!")).then(x => x.delete({ timeout: 5000 }));
    }
    if (args[0] === "bilgi" || args[0] === "info") {
        let embed = new MessageEmbed().setThumbnail("https://cdn.discordapp.com/attachments/768538059607113748/796120799198445648/coininfo.png").setColor("GOLD")
  
        message.lineReply(embed.setDescription(`\`\`\`Nasıl Coin Kasarım ?\`\`\`\n` + "**Günlük .daily komutu ile para kazanabilir, arkadaşlarınız ile bahisli bir şekilde düello yapabilir ve daha bir çok eğlenceli oyunlar ile paranıza para katlayıp coine dönüştürebilirsiniz.**"
        +`\`\`\`Coin Ne İşime Yarayacak?\`\`\`\n` + "**Coinleriniz ile sunucu sahibinin markete koyduğu ürünlerden alışveriş yapabilirsiniz.**"
        +`\`\`\`Marketler Hakkında Bilgi\`\`\`\n` + "**Coin marketi görmek için .dükkan liste yapmanız yeterlidir. Coin marketten aldığınız ürünleri teslimini yapacak kişi Sunucu Sahibi/Owner/Coin Sorumlusu permine sahip yetkililerdir, onlara ulaşmayı unutmayınız.**")).then(x => x.delete({ timeout: 60000 }))
        return;
      };
};

module.exports.configuration = {
    name: "dükkan",
    aliases: ["shop"],
    usage: "dükkan",
    description: "Market sistemi",
};
