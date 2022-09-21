const { MessageEmbed } = require('discord.js');
const Penalty = require('../Models/Penalty.js');
const moment = require('moment');
const ms = require('ms');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("ff0013");
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if (!client.kullanabilir(message.author.id) && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!uye) return message.lineReply(embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    if (banLimitleri.get(message.author.id) >= 5) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.lineReply(embed.setDescription('Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!')).then(x => x.delete({ timeout: 5000 }));
    let sure = "14d";
    let reason = args.splice(1).join(' ');
    if (!reason) return message.lineReply(embed.setDescription('**Lütfen geçerli bir uyarı sebebi gir!**')).then(x => x.delete({ timeout: 5000 }));
    const cezaNumara = await client.cezaNumara();
    const atilisTarihi = Date.now();
    const bitisTarihi = Date.now() + ms(sure);
    await message.react("1️⃣");
    await message.react("2️⃣");
    await message.react("3️⃣");
    await message.react("⛏️");

    const filter = (reaction, user) => {
        return ["1️⃣", "2️⃣", '3️⃣', "⛏️"].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    const collector = message.createReactionCollector(filter, { max: 1, time: 30000, error: ['time'] });
    collector.on('collect', async (reaction) => {
        if (reaction.emoji.name == "1️⃣") {
            let newPenalty = new Penalty({
                sunucuID: message.guild.id,
                uyeID: uye.id,
                yetkiliID: message.author.id,
                cezaTuru: 'UYARILDI1',
                cezaSebebi: reason,
                atilmaTarihi: atilisTarihi,
                bitisTarihi: bitisTarihi,
            });
            uye.roles.add(ayar.uyarı1).catch(console.error);
            uye.send(`${reason} sebebiyle ${message.author} adlı yetkili tarafından ilk uyarınızı aldınız. Uyarı almaya devam etmeniz taktirinde yetkileriniz alınacak veya düşürülecektir. 14 gün sonunda herhangi bir uyarı almaz iseniz uyarı perminiz üzerinzden alınır ve siciliniz temizlenir.`).catch(console.error)
            message.lineReply(embed.setDescription(`${uye} \`(${moment.duration(ms(sure)).format('D [gün,] H [saat,] m [dakika]')})\` boyunca ${reason} sebebiyle <@${ayar.uyarı1}> rolü verildi!`)).catch(console.error);
            client.channels.cache.find(c => c.name === ayar.uyarilog).send( new MessageEmbed().setColor('f39c12').setDescription(`Uyaran: ${message.author} \`(${message.author.id})\`\nUyarılan: ${uye.user.tag} \`(${uye.id})\`\nSebep: ${reason}\nCeza-i İşlem: Uyarı(1) \`(${cezaNumara})\``)).catch(console.error);

            newPenalty.save();
        } else if (reaction.emoji.name == "2️⃣") {

            if (!uye.roles.cache.get(ayar.uyarı1)) return message.lineReply(new MessageEmbed().setDescription("`Üyeye uyarı 2 verebilmek için önce uyarı 1 alması gerekmektedir.`")).then(x => x.delete({ timeout: 10000 }));
            uye.roles.add(ayar.uyarı2).catch(console.error);
            message.lineReply(embed.setDescription(`${uye} \`(${moment.duration(ms(sure)).format('D [gün,] H [saat,] m [dakika]')})\` boyunca ${reason} sebebiyle <@${ayar.uyarı2}> rolü verildi!`)).catch(console.error);
            client.channels.cache.find(c => c.name === ayar.uyarilog).send(new MessageEmbed().setColor('f39c12').setDescription(`Uyaran: ${message.author} \`(${message.author.id})\`\nUyarılan: ${uye.user.tag} \`(${uye.id})\`\nSebep: ${reason}\nCeza-i İşlem: Uyarı(1) \`(${cezaNumara})\``)).catch(console.error);
         let newPenalty = new Penalty({
                sunucuID: message.guild.id,
                uyeID: uye.id,
                yetkiliID: message.author.id,
                cezaTuru: 'UYARILDI2',
                cezaSebebi: reason,
                atilmaTarihi: atilisTarihi,
                bitisTarihi: bitisTarihi,
            });
            Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).exec((err, data) => {
                data.filter(d => (d.cezaTuru === 'UYARILDI1') && d.bitisTarihi && d.bitisTarihi > Date.now()).forEach(d => {
                    d.bitisTarihi = Date.now();
                    d.save();
                });
            });

            newPenalty.save();
        } else if (reaction.emoji.name == "3️⃣") {
            if (!client.kullanabilir(message.author.id) && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.lineReply(embed.setDescription('`Yeterli Yetkin Bulunmamakta.`')).then(x => x.delete({ timeout: 5000 }));
            if (!uye.roles.cache.get(ayar.uyarı2)) return message.lineReply(new MessageEmbed().setDescription("`Üyeye uyarı 3 verebilmek için önce uyarı 2 alması gerekmektedir.`")).then(x => x.delete({ timeout: 10000 }));

            if (uye.voice.channelID) uye.voice.kick().catch();
            uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.jailRolu, ayar.boosterRolu] : [ayar.jailRolu]).catch(() => {
                return undefined;
            });
            message.lineReply(embed.setDescription(`${uye} \`(${moment.duration(ms(sure)).format('D [gün,] H [saat,] m [dakika]')})\` boyunca ${reason} sebebiyle uyarı limitini geçtiği için jaile atıldı!`)).catch(console.error);
            client.channels.cache.find(c => c.name === ayar.uyarilog).send(new MessageEmbed().setColor('c0392b').setDescription(`Uyaran: ${message.author} \`(${message.author.id})\`\nUyarılan: ${uye.user.tag} \`(${uye.id})\`\nSebep: ${reason}\nCeza-i İşlem: Uyarı(3)  \`(${cezaNumara})\``)).catch(console.error);
            let newPenalty = new Penalty({
                sunucuID: message.guild.id,
                uyeID: uye.id,
                yetkiliID: message.author.id,
                cezaTuru: "TEMP-JAIL",
                cezaSebebi: reason,
                atilmaTarihi: atilisTarihi,
                bitisTarihi: bitisTarihi,
            });
            Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).exec((err, data) => {
                data.filter(d => (d.cezaTuru === 'UYARILDI2') && d.bitisTarihi && d.bitisTarihi > Date.now()).forEach(d => {
                    d.bitisTarihi = Date.now();
                    d.save();
                });
            });
            newPenalty.save();
        } else if (reaction.emoji.name == "⛏️") {
            if (!client.kullanabilir(message.author.id) && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.lineReply(embed.setDescription('`Yeterli Yetkin Bulunmamakta.`')).then(x => x.delete({ timeout: 5000 }));
            if (uye.roles.cache.has(ayar.muteRolu)) uye.roles.remove(ayar.muteRolu).catch(console.error);
            if (!client.kullanabilir(message.author.id) && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.lineReply(embed.setDescription('`Ne yazık ki chat mute açabilecek yetkiye sahip değilsin ancak üyenin ses mutesi var ise açabilirsin.`')).then(x => x.delete({ timeout: 10000 }));
            message.lineReply(embed.setDescription(`${uye} üyesinin, ${message.author} tarafından uyarıları kaldırıldı!`));
            client.channels.cache.find(c => c.name === ayar.uyarilog).send(new MessageEmbed().setColor('GREEN').setDescription(`Engeli Kaldıran: ${message.author} \`(${message.author.id})\`\nEngeli Kalkan: ${uye} \`(${uye.user.tag})\`\nCeza-i İşlem: Uyarı`)).catch(console.error);
            Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).sort({ atilmaTarihi: -1 }).exec(async (err, data) => {
                let cezalar = data.filter(d => (d.cezaTuru === "UYARILDI1" || d.cezaTuru === "UYARILDI2") && (!d.bitisTarihi || d.bitisTarihi > Date.now()))
                if (!cezalar.length) return message.lineReply("Bu kullanıcı uyarı almamış.")
                cezalar.forEach(async d => {
                    d.bitisTarihi = Date.now();
                    d.save();
                    uye.roles.remove([ayar.uyarı1, ayar.uyarı2])
                    banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) + 1);
                    setTimeout(() => {
                        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
                    }, 1000 * 60 * 3);
                    let yetkili = await client.users.fetch(cezalar[0].yetkiliID)
                    if (cezalar[0].yetkiliID === message.author.id) return
                    await yetkili.send(`${message.author} yetkilisi ${uye}'ye attığın uyarıyı  kaldırdı.`).catch(err => undefined);
                });
            });

        }

    });
    setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
    }, 1000 * 60 * 3);

    collector.on('end', async () => {
        await message.reactions.removeAll();
        message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`);
        if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
            banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
        }
        
        collector.on('error', () => message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`));
    });
};
module.exports.configuration = {
    name: 'uyarı',
    aliases: ['uyarı1', 'inkaz'],
    usage: 'uyarı [üye] [sebep]',
    description: 'Belirtilen üyeyi seste belirtilen süre kadar muteler.',
    permLevel: 0
};