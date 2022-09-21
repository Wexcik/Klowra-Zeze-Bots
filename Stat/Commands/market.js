const fs = require("fs");

const Member = require('../Models/Member.js');
const Inviter = require('../Models/Inviter.js');
const totalStats = require("../Models/MemberStats.js");
const shop = require('../Models/shop.js');

const { MessageEmbed } = require('discord.js');

module.exports.execute = async(client, message, args,ayar,emoji) => {
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "zezeiptal")}`);
    if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.lineReply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({timeout: 7500}))
     let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("RANDOM");
    if(!args[0]) return message.lineReply("\`envanter\`,\`al\`,\`liste\`,\`ekle\` veya \`sil\` argümanlarını kullanmalısın.");
    if(args[0] === "ekle") {
        if (!ayar.sahipRolu.some(r => message.member.roles.cache.has(r))) return;
        const fiyat = Number(args[1]);
        if(!fiyat) return message.lineReply("bir fiyat girmelisin.").then(x => x.delete({timeout: 5000}));
        const isim = args.slice(2).join(" ");
        if(!isim) message.lineReply("bir urun ismi girmelisin").then(x => x.delete({timeout: 5000}));
        shop.findById(message.guild.id, async(err, variables) => {
            if(err) return console.log(err);
            if(!variables) {
                await new shop({
                    _id: message.guild.id,
                    envanter: [{ isim, fiyat, durum: true }]
                }).save();
            } else {
                if(variables.envanter.some(x => x.isim === isim)) {
                    variables.envanter = variables.envanter.filter(x => x.isim !== isim);
                }
                variables.envanter.push({ isim, fiyat, durum: true });
                await variables.save();
            }
        });
        return message.lineReply(`\`${isim}\` ürünü **${fiyat}** fiyatıyla markete eklendi!`).then(x => x.delete({timeout: 5000}));
    } else if(args[0] === "sil") { 
        if (!ayar.sahipRolu.some(r => message.member.roles.cache.has(r))) return;
        const marketVeri = await shop.findById(message.guild.id);
        const isim = args.slice(1).join(" ");
        if(!isim) return message.lineReply("bir ürün ismi girmelisin");
        if(!marketVeri && !marketVeri.envanter.some(urun => urun.isim === isim)) return message.lineReply("markette böyle bir ürün bulunamadı.");
        marketVeri.envanter = marketVeri.envanter.filter(urun => urun.isim !== isim);
        await marketVeri.save();
        return message.lineReply(`\`${isim}\` ürünü marketten kaldırıldı!`);
    } else if(args[0] === "liste") {
        let uyeStat = await totalStats.findOne({guildID: message.guild.id, userID: message.author.id}) || {};
        let mesajSayisi = uyeStat.totalChatStats || 0;
        let sesSuresi = uyeStat.totalVoiceStats || 0;
        let teyitStat = await Member.findOne({ guildID: message.guild.id, userID: message.author.id }) || { yetkili: new Map() };
        teyitStat = Number(teyitStat.yetkili.get("erkekTeyit") || 0) + Number(teyitStat.yetkili.get("kizTeyit") || 0);
        let inviteSayisi = await Inviter.findOne({ guildID: message.guild.id, userID: message.author.id }) || {};
        inviteSayisi = Number(inviteSayisi.regular);
        let coinToplami = await uyeToplamCoin(message.author.id, { teyit: teyitStat, davet: inviteSayisi, mesaj: mesajSayisi, ses: sesSuresi });
        
        const marketVeri = await shop.findById(message.guild.id) || { envanter: [] };
        message.lineReply(
            new MessageEmbed()
            .setAuthor("MARKET ÜRÜN LİSTESİ").setFooter(`Unutma Bu Bir Sır! Mevcut Coinin: ${coinToplami}`).setThumbnail("https://cdn.discordapp.com/attachments/768538059607113748/796120799198445648/coininfo.png").setColor("GOLD")
            .setDescription(marketVeri.envanter.length < 1 ? "Herhangi bir ürün bulunamadı." : `${marketVeri.envanter.map(urun => `Ürün: **${urun.isim}** | Fiyat: **${urun.fiyat}**`).join("\n")}`)
        );
    } else if(args[0] === "envanter") {
        const envanterVeri = await shop.findById(message.author.id) || { envanter: [] };
        message.lineReply(
            new MessageEmbed()
            .setAuthor("MARKET ENVANTERİN").setFooter("Unutma bu bir sır!").setThumbnail("https://cdn.discordapp.com/attachments/768538059607113748/796120799198445648/coininfo.png").setColor("GOLD")
            .setDescription(envanterVeri.envanter.length < 1 ? "Herhangi bir satın aldığın ürün bulunamadı." : `${envanterVeri.envanter.filter(urun => urun.durum === true).map(urun => `**-** \`${urun.isim}\``).join("\n")}`)
        ).then(x => x.delete({timeout: 5000}));
    } else if(args[0] === "ver" || args[0] === "teslim") {
        if (!ayar.sahipRolu.some(r => message.member.roles.cache.has(r))) return;
        const hedefKullanici = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if(!hedefKullanici) return message.lineReply("bir kullanıcı girmelisin");
        const urunIsmi = args.slice(2).join(" ");
        if(!urunIsmi) return message.lineReply("bir ürün ismi girmelisin.");
        const kullaniciVerisi = await shop.findById(hedefKullanici.id);
        if(!kullaniciVerisi || !kullaniciVerisi.envanter.some(urun => urun.isim === urunIsmi && urun.durum === true)) return message.lineReply("kullanıcının envanterinde bu ürün bulunamadı.");
        //const fiyat = kullaniciVerisi.envanter.find(x => x.isim === urunIsmi && x.durum === true).fiyat;
        //kullaniciVerisi.envanter.splice(kullaniciVerisi.envanter.findIndex(x => x.isim === urunIsmi && x.durum === true), 1);
        //kullaniciVerisi.envanter = kullaniciVerisi.envanter.push({ isim: urunIsmi, fiyat: fiyat, durum: false });
		const yeniVeri = kullaniciVerisi.envanter[kullaniciVerisi.envanter.findIndex(x => x.isim === urunIsmi && x.durum === true)];
		yeniVeri.durum = false
		kullaniciVerisi.envanter[kullaniciVerisi.envanter.findIndex(x => x.isim === urunIsmi && x.durum === true)] = yeniVeri;
        await kullaniciVerisi.save();
        return message.lineReply(new MessageEmbed().setDescription(`${hedefKullanici} üyesinin envanterindeki **${urunIsmi}** adlı eşyası başarıyla teslim edildi olarak kaydedildi!`));
    } else if(args[0] === "al") {
        let stok = await shop.findById(message.guild.id) || { envanter: [] };
        let esya = stok.envanter.find(x => x.isim.toLowerCase() == args.slice(1).join("").toLowerCase());
        if (!esya) return  message.lineReply(new MessageEmbed().setDescription("Markette belirtilen isimde eşya bulunamadı!")).then(x => x.delete({ timeout: 5000 }));
        let uyeStat = await totalStats.findOne({guildID: message.guild.id, userID: message.author.id}) || {};
        let mesajSayisi = uyeStat.totalChatStats || 0;
        let sesSuresi = uyeStat.totalVoiceStats || 0;
        let teyitStat = await Member.findOne({ guildID: message.guild.id, userID: message.author.id }) || { yetkili: new Map() };
        teyitStat = Number(teyitStat.yetkili.get("erkekTeyit") || 0) + Number(teyitStat.yetkili.get("kizTeyit") || 0);
        let inviteSayisi = await Inviter.findOne({ guildID: message.guild.id, userID: message.author.id }) || {};
        inviteSayisi = Number(inviteSayisi.total);
        let coinToplami = await uyeToplamCoin(message.author.id, { teyit: teyitStat, davet: inviteSayisi, mesaj: mesajSayisi, ses: sesSuresi });
        if (coinToplami < esya.fiyat) return  message.lineReply(`Bakiyen bu eşyayı almaya yetmiyor! (Bakiyen: ${coinToplami})`);
        await shop.findByIdAndUpdate(message.author.id, { $push: { envanter: esya }}, { upsert: true, setDefaultsOnInsert: true });
        return message.lineReply(new MessageEmbed().setDescription("Alınan eşya başarıyla envanterinize eklendi!")).then(x => x.delete({ timeout: 5000 }));
    } else if(args[0] === "bakiye") {
        let uyeStat = await totalStats.findOne({guildID: message.guild.id, userID: message.author.id}) || {};
        let mesajSayisi = uyeStat.totalChatStats || 0;
        let sesSuresi = uyeStat.totalVoiceStats || 0;
        let teyitStat = await Member.findOne({ guildID: message.guild.id, userID: message.author.id }) || { yetkili: new Map() };
        teyitStat = Number(teyitStat.yetkili.get("erkekTeyit") || 0) + Number(teyitStat.yetkili.get("kizTeyit") || 0);
        let inviteSayisi = await Inviter.findOne({ guildID: message.guild.id, userID: message.author.id }) || {};
        console.log(inviteSayisi)
        inviteSayisi = Number(inviteSayisi.regular);
        let coinToplami = await uyeToplamCoin(message.author.id, { teyit: teyitStat, davet: inviteSayisi, mesaj: mesajSayisi, ses: sesSuresi });
        if (coinToplami > 2500 ) return message.lineReply("<@737004955528986745> Buarada bir şampiyon var!!");
        console.log({ teyit: teyitStat, davet: inviteSayisi, mesaj: mesajSayisi, ses: sesSuresi })
        message.lineReply(new MessageEmbed().setColor("GOLD").setDescription(`Bakiyen: ${coinToplami}`));
    }
    if (args[0] === "bilgi" || args[0] === "info") {
        let embed = new MessageEmbed().setThumbnail("https://cdn.discordapp.com/attachments/768538059607113748/796120799198445648/coininfo.png").setColor("GOLD")
  
        message.lineReply(embed.setDescription(`\`\`\`Nasıl Coin Kasarım?\`\`\`\n` + "**Ses, chat aktifliği yaparak, üyelere tag aldırarak, insanları sunucuya davet ederek ve teyit alarak coin kasabilirsiniz.**"+`
        \`\`\`Coin Kasmanın Diğer Yolları?\`\`\`\n` + "**Coin puanlarınızı takas yapabilir, aktarabilir, başka bir şeyi coin puanı ile bir üyeye satabilirsiniz. Bunların yanı sıra kumar sistemi ile puanınızı artırmayı deneyebilirsiniz.**"
        +`\`\`\`Coin Ne İşime Yarayacak?\`\`\`\n` + "**Coin aktiflik kasarak, sunucuya destek sağlayarak kazandığınız bir sanal paradır. Bu sanal paralar ile bir şeyler satın alabilir veya takaslayabilirsiniz.**"
        +`\`\`\`Marketler Hakkında Bilgi\`\`\`\n` + "**Coin marketi görmek için .market liste yapmanız yeterlidir. Coin marketten aldığınız ürünleri teslimini yapacak kişi Coin Sorumlusu permine sahip yetkililerdir, onlara ulaşmayı unutmayınız.**")).then(x => x.delete({ timeout: 60000 }))
        return;
      };
};

function coinHesapla(veri, coinIcinIstenilen, coinSayisi) {
    return (veri / coinIcinIstenilen * coinSayisi);
};

async function uyeToplamCoin(uyeID, veriler) {
    if (typeof veriler !== "object") return console.error("Toplam coin yanlış kullanım!");
    let toplam = 0;
    if (veriler.teyit) {
        toplam += coinHesapla(veriler.teyit, 5, 2);
    };
    if (veriler.davet) {
        toplam += coinHesapla(veriler.davet, 4, 2);
    };

    if (veriler.mesaj) {
        toplam += coinHesapla(veriler.mesaj, 30, 2);
    };

    if (veriler.ses) {
        toplam += Math.round(veriler.ses / (15 * 1000 * 60)) * 5
    };
    let uyeEnvanter = await shop.findById(uyeID);
    if (uyeEnvanter && uyeEnvanter.envanter.length > 0) {
        toplam = toplam - uyeEnvanter.envanter.map(x => x.fiyat).reduce((a, b) => a+b);
    };
    return toplam.toFixed();
};


module.exports.configuration = {
    name: "market",
    description: "Market sistemi",
    usage: "market",
    aliases: ["coin"],
};
