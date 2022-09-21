const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js')
const { MessageMenu, MessageMenuOption, MessageActionRow } = require('discord-buttons')
const timeout = new Map()

module.exports.execute = async (client, message, args, ayar) => {
    if (message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const data = await Funny.findOne({ userID: message.author.id })
    if (!data) { data = Funny.create({ guildID: message.guild.id, userID: message.author.id }) }
    if (!args[0] || !args[0].includes('topla') && !args[0].includes('yıka') && !args[0].includes('işle') && !args[0].includes('bilgi') && !args[0].includes('sat')) return message.lineReply(`Belli bir argüman girmen gerekli. \`bilgi, sat, topla, yıka veya işle\` Enerji **(${data.energy}/100)**`).then(c => c.delete({ timeout: 7500 }))
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    if (args[0] && args[0].includes('topla')) {
        if (data.energy < 5) return message.lineReply(`Taş toplamak için enerjin yetersiz! Enerejin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
        if (timeout.get(message.author.id) == 1) return message.lineReply(`Bu komudu sıksık kullanamazsın! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
        timeout.set(message.author.id, 1)
        let ihtimal = (40 - 20 + 1)
        if (data.taşkazma == true) {
            ihtimal = (45 - 25 + 1)
            await Funny.updateOne({ userID: message.author.id }, { $inc: { taşkazmacan: -1 } }, { upsert: true })
            if (data.taşkazmacan <= 0) { Funny.updateOne({ userID: message.author.id }, { $inc: { taşkazma: false } }, { upsert: true}) }
        }
        if (data.demirkazma == true) {
            ihtimal = (50 - 30 + 1)
            await Funny.updateOne({ userID: message.author.id }, { $inc: { demirkazmacan: -1 } }, { upsert: true })
            if (data.demirkazmacan <= 0) { Funny.updateOne({ userID: message.author.id }, { $inc: { demirkazma: false } }, { upsert: true}) }
        }
        if (data.altınkazma == true) {
            ihtimal = (60 - 40 + 1)
            await Funny.updateOne({ userID: message.author.id }, { $inc: { altınkazmacan: -1 } }, { upsert: true })
            if (data.altınkazmacan <= 0) { Funny.updateOne({ userID: message.author.id }, { $inc: { altınkazma: false } }, { upsert: true}) }
        }
        if (data.elmaskazma == true) {
            ihtimal = (75 - 45 + 1)
            await Funny.updateOne({ userID: message.author.id }, { $inc: { elmaskazmacan: -1 } }, { upsert: true })
            if (data.elmaskazmacan <= 0) { Funny.updateOne({ userID: message.author.id }, { $inc: { elmaskazma: false } }, { upsert: true}) }
        }
        let taşsayı = Math.floor(Math.random() * ihtimal) + 10;
        const msj = await message.lineReplyNoMention(`Taş toplamaya başladın. \`Harcanacak enerji miktarı:\` **5%**`)
        await Funny.updateOne({ userID: message.author.id }, { $inc: { energy: -5 } }, { upsert: true })
        await sleep(4500)
        msj.edit(`Taş topluyorsun. \`Topladığın miktar:\` **${parseInt(taşsayı / 5)}**`)
        await sleep(4500)
        msj.edit(`Taş topluyorsun. \`Topladığın miktar:\` **${parseInt(taşsayı / 4)}**`)
        await sleep(4500)
        msj.edit(`Taş topluyorsun. \`Topladığın miktar:\` **${parseInt(taşsayı / 3)}**`)
        await sleep(4500)
        msj.edit(`Taş topluyorsun. \`Topladığın miktar:\` **${parseInt(taşsayı / 2)}**`)
        await sleep(4500)
        msj.edit(`Taş topluyorsun. \`Topladığın miktar:\` **${parseInt(taşsayı)}**`)
        await sleep(2500)
        msj.delete()
        await message.lineReply(`Taş toplama işlemi bitti. \`Topladığın taş miktarı:\` **${parseInt(taşsayı)}** \`Toplam taş miktarı:\` **${parseInt(taşsayı + data.taş)}**`)
        await Funny.updateOne({ userID: message.author.id }, { $inc: { taş: parseInt(taşsayı) } }, { upsert: true })
    }

    if (args[0] && args[0].includes('yıka')) {
        if (data.energy < 5) return message.lineReply(`Taş yıkamak için enerjin yetersiz! Enerejin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
        if (data.taş <= 15) return message.lineReply(`Taşlarını yıkayabilmen için, elinde en az 15 taş bulunması gerekli! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
        if (timeout.get(message.author.id) == 1) return message.lineReply(`Bu komudu sıksık kullanamazsın! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
        timeout.set(message.author.id, 1)
        let yıkanacak = data.taş
        if (yıkanacak >= 100) { yıkanacak = 100 }
        let yıkanmış = yıkanacak * 75 / 100
        const msj = await message.lineReplyNoMention(`Taş yıkamaya başladın. \`Harcanacak enerji miktarı:\` **5%**`)
        await Funny.updateOne({ userID: message.author.id }, { $inc: { energy: -5 } }, { upsert: true })
        await sleep(4500)
        msj.edit(`Taş yıkıyorsun. \`Yıkadağın taş sayısı:\` **${parseInt(yıkanacak / 5)}** \`Sağlam çıkan taş sayısı:\` **${parseInt(yıkanmış / 5)}** \`Kalan yıkanmamış taş miktarı:\` **${parseInt(yıkanacak - yıkanacak / 5)}**`)
        await sleep(4500)
        msj.edit(`Taş yıkıyorsun. \`Yıkadağın taş sayısı:\` **${parseInt(yıkanacak / 4)}** \`Sağlam çıkan taş sayısı:\` **${parseInt(yıkanmış / 4)}** \`Kalan yıkanmamış taş miktarı:\` **${parseInt(yıkanacak - yıkanacak / 4)}**`)
        await sleep(4500)
        msj.edit(`Taş yıkıyorsun. \`Yıkadağın taş sayısı:\` **${parseInt(yıkanacak / 3)}** \`Sağlam çıkan taş sayısı:\` **${parseInt(yıkanmış / 3)}** \`Kalan yıkanmamış taş miktarı:\` **${parseInt(yıkanacak - yıkanacak / 3)}**`)
        await sleep(4500)
        msj.edit(`Taş yıkıyorsun. \`Yıkadağın taş sayısı:\` **${parseInt(yıkanacak / 2)}** \`Sağlam çıkan taş sayısı:\` **${parseInt(yıkanmış / 2)}** \`Kalan yıkanmamış taş miktarı:\` **${parseInt(yıkanacak - yıkanacak / 2)}**`)
        await sleep(4500)
        msj.edit(`Taş yıkıyorsun. \`Yıkadağın taş sayısı:\` **${parseInt(yıkanacak)}** \`Sağlam çıkan taş sayısı:\` **${parseInt(yıkanmış)}** \`Kalan yıkanmamış taş miktarı:\` **${parseInt(yıkanacak - yıkanacak)}**`)
        await sleep(2500)
        msj.delete()
        await message.lineReply(`Taş yıkama işlemi bitti. Yıkadığın sağlam taş miktarı: **${parseInt(yıkanmış)}** Toplam yıkanmış taş miktarı: **${parseInt(yıkanmış + data.yıkanmıştaş)}** Toplam yıkanan taş miktarı: **${parseInt(yıkanacak)}** Kalan taş miktarı: **${parseInt(data.taş - yıkanacak)}**`)
        await Funny.updateOne({ userID: message.author.id }, { $inc: { taş: -parseInt(yıkanacak), yıkanmıştaş: parseInt(yıkanmış) } }, { upsert: true })
    }

    if (args[0] && args[0].includes('işle')) {
        if (data.energy < 10) return message.lineReply(`Taş yakmak için enerjin yetersiz! Enerejin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
        let kömür = new MessageMenuOption().setLabel('Kömür').setValue('komur').setDescription('İşleyeceğiniz materyal!!!')
        let bakır = new MessageMenuOption().setLabel('Bakır').setValue('bakir').setDescription('İşleyeceğiniz materyal!!!')
        let demir = new MessageMenuOption().setLabel('Demir').setValue('demir').setDescription('İşleyeceğiniz materyal!!!')
        let altın = new MessageMenuOption().setLabel('Altın').setValue('altin').setDescription('İşleyeceğiniz materyal!!!')
        let elmas = new MessageMenuOption().setLabel('Elmas').setValue('elmas').setDescription('İşleyeceğiniz materyal!!!')
        const menu = new MessageMenu().addOptions(kömür, bakır, demir, altın, elmas).setMaxValues(1).setMinValues(1).setPlaceholder('Materyal seçiniz!!!').setID('menu')
        const menümesajı = await message.channel.send({ content: 'İşlemek istediğiniz materyali seçiniz!!', component: menu})
        client.on('clickMenu', async menu => {
            menu.reply.defer();
            if (menu.clicker.member.id !== message.author.id) return; 
            if (menu.values[0] === 'komur') {
                await menümesajı.delete()
                if (data.yıkanmıştaş < 1) return message.lineReply(`En az 1 yıkanmış taşı kömüre çevirebilirsin! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
                if (timeout.get(message.author.id) == 1) return message.lineReply(`Bu komudu sıksık kullanamazsın! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
                timeout.set(message.author.id, 1)
                let yıkanmış = data.yıkanmıştaş
                if (yıkanmış >= 90) { yıkanmış = 90 }
                let dönüşmüş = yıkanmış
                const msj = await message.lineReplyNoMention(`Yıkanmış taşlarını kömür olarak işlemeye başladın. \`Harcanacak enerji miktarı:\` **10%**`)
                await Funny.updateOne({ userID: message.author.id }, { $inc: { energy: -10 } }, { upsert: true })
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını kömür olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 5)}** \`Kazandığın kömür sayısı:\` **${parseInt(dönüşmüş / 5)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 5)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını kömür olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 4)}** \`Kazandığın kömür sayısı:\` **${parseInt(dönüşmüş / 4)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 4)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını kömür olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 3)}** \`Kazandığın kömür sayısı:\` **${parseInt(dönüşmüş / 3)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 3)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını kömür olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 2)}** \`Kazandığın kömür sayısı:\` **${parseInt(dönüşmüş / 2)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 2)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını kömür olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış)}** \`Kazandığın kömür sayısı:\` **${parseInt(dönüşmüş)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış)}**`)
                await sleep(2500)
                msj.delete()
                await message.lineReply(`Kömür işleme işlemi bitti. İşlediğin kömür miktarı: **${parseInt(dönüşmüş)}** Toplam kömür miktarı: **${parseInt(data.kömür + dönüşmüş)}** İşlenen yıkanmış taş miktarı: **${parseInt(yıkanmış)}** Kalan yıkanmış taş miktarı: **${parseInt(data.yıkanmıştaş - yıkanmış)}**`)
                await Funny.updateOne({ userID: message.author.id }, { $inc: { yıkanmıştaş: -parseInt(yıkanmış), kömür: parseInt(dönüşmüş) } }, { upsert: true })
            }
            if (menu.values[0] === 'bakir') {
                await menümesajı.delete()
                if (data.yıkanmıştaş < 2) return message.lineReply(`En az 2 yıkanmış taşı bakıra çevirebilirsin! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
                if (timeout.get(message.author.id) == 1) return message.lineReply(`Bu komudu sıksık kullanamazsın! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
                timeout.set(message.author.id, 1)
                let random = Math.floor(Math.random() * (100 - 85 + 1)) + 85;
                let yıkanmış = data.yıkanmıştaş
                if (yıkanmış >= 90) { yıkanmış = 90 }
                let dönüşmüş = yıkanmış * random / 100
                const msj = await message.lineReplyNoMention(`Yıkanmış taşlarını bakır olarak işlemeye başladın. \`Harcanacak enerji miktarı:\` **10%**`)
                await Funny.updateOne({ userID: message.author.id }, { $inc: { energy: -10 } }, { upsert: true })
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını bakır olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 5)}** \`Kazandığın bakır sayısı:\` **${parseInt(dönüşmüş / 5)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 5)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını bakır olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 4)}** \`Kazandığın bakır sayısı:\` **${parseInt(dönüşmüş / 4)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 4)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını bakır olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 3)}** \`Kazandığın bakır sayısı:\` **${parseInt(dönüşmüş / 3)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 3)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını bakır olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 2)}** \`Kazandığın bakır sayısı:\` **${parseInt(dönüşmüş / 2)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 2)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını bakır olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış)}** \`Kazandığın bakır sayısı:\` **${parseInt(dönüşmüş)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış)}**`)
                await sleep(2500)
                msj.delete()
                await message.lineReply(`Bakır işleme işlemi bitti. İşlediğin bakır miktarı: **${parseInt(dönüşmüş)}** Toplam bakır miktarı: **${parseInt(data.bakır + dönüşmüş)}** İşlenen yıkanmış taş miktarı: **${parseInt(yıkanmış)}** Kalan yıkanmış taş miktarı: **${parseInt(data.yıkanmıştaş - yıkanmış)}**`)
                await Funny.updateOne({ userID: message.author.id }, { $inc: { yıkanmıştaş: -parseInt(yıkanmış), bakır: parseInt(dönüşmüş) } }, { upsert: true })
            }
            if (menu.values[0] === 'demir') {
                await menümesajı.delete()
                if (data.yıkanmıştaş < 2) return message.lineReply(`En az 2 yıkanmış taşı demire çevirebilirsin! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
                if (timeout.get(message.author.id) == 1) return message.lineReply(`Bu komudu sıksık kullanamazsın! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
                timeout.set(message.author.id, 1)
                let random = Math.floor(Math.random() * (100 - 80 + 1)) + 80;
                let yıkanmış = data.yıkanmıştaş
                if (yıkanmış >= 90) { yıkanmış = 90 }
                let dönüşmüş = yıkanmış * random / 100
                const msj = await message.lineReplyNoMention(`Yıkanmış taşlarını demir olarak işlemeye başladın. \`Harcanacak enerji miktarı:\` **10%**`)
                await Funny.updateOne({ userID: message.author.id }, { $inc: { energy: -10 } }, { upsert: true })
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını demir olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 5)}** \`Kazandığın demir sayısı:\` **${parseInt(dönüşmüş / 5)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 5)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını demir olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 4)}** \`Kazandığın demir sayısı:\` **${parseInt(dönüşmüş / 4)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 4)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını demir olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 3)}** \`Kazandığın demir sayısı:\` **${parseInt(dönüşmüş / 3)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 3)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını demir olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 2)}** \`Kazandığın demir sayısı:\` **${parseInt(dönüşmüş / 2)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 2)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını demir olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış)}** \`Kazandığın demir sayısı:\` **${parseInt(dönüşmüş)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış)}**`)
                await sleep(2500)
                msj.delete()
                await message.lineReply(`Demir işleme işlemi bitti. İşlediğin demir miktarı: **${parseInt(dönüşmüş)}** Toplam demir miktarı: **${parseInt(data.demir + dönüşmüş)}** İşlenen yıkanmış taş miktarı: **${parseInt(yıkanmış)}** Kalan yıkanmış taş miktarı: **${parseInt(data.yıkanmıştaş - yıkanmış)}**`)
                await Funny.updateOne({ userID: message.author.id }, { $inc: { yıkanmıştaş: -parseInt(yıkanmış), demir: parseInt(dönüşmüş) } }, { upsert: true })
            }
            if (menu.values[0] === 'altin') {
                await menümesajı.delete()
                if (data.yıkanmıştaş < 4) return message.lineReply(`En az 4 yıkanmış taşı altına çevirebilirsin! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
                if (timeout.get(message.author.id) == 1) return message.lineReply(`Bu komudu sıksık kullanamazsın! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
                timeout.set(message.author.id, 1)
                let random = Math.floor(Math.random() * (100 - 80 + 1)) + 80;
                let yıkanmış = data.yıkanmıştaş
                if (yıkanmış >= 90) { yıkanmış = 90 }
                let dönüşmüş = yıkanmış / 4
                const msj = await message.lineReplyNoMention(`Yıkanmış taşlarını altın olarak işlemeye başladın. \`Harcanacak enerji miktarı:\` **10%**`)
                await Funny.updateOne({ userID: message.author.id }, { $inc: { energy: -10 } }, { upsert: true })
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını altın olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 5)}** \`Kazandığın altın sayısı:\` **${parseInt(dönüşmüş / 5)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 5)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını altın olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 4)}** \`Kazandığın altın sayısı:\` **${parseInt(dönüşmüş / 4)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 4)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını demir olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 3)}** \`Kazandığın altın sayısı:\` **${parseInt(dönüşmüş / 3)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 3)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını demir olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 2)}** \`Kazandığın altın sayısı:\` **${parseInt(dönüşmüş / 2)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 2)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını demir olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış)}** \`Kazandığın altın sayısı:\` **${parseInt(dönüşmüş)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış)}**`)
                await sleep(2500)
                msj.delete()
                await message.lineReply(`Altın işleme işlemi bitti. İşlediğin altın miktarı: **${parseInt(dönüşmüş)}** Toplam altın miktarı: **${parseInt(data.altın + dönüşmüş)}** İşlenen yıkanmış taş miktarı: **${parseInt(yıkanmış)}** Kalan yıkanmış taş miktarı: **${parseInt(data.yıkanmıştaş - yıkanmış)}**`)
                await Funny.updateOne({ userID: message.author.id }, { $inc: { yıkanmıştaş: -parseInt(yıkanmış), altın: parseInt(dönüşmüş) } }, { upsert: true })
            }
            if (menu.values[0] === 'elmas') {
                await menümesajı.delete()
                if (data.yıkanmıştaş < 20) return message.lineReply(`En az 20 yıkanmış taşı elmasa çevirebilirsin! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
                if (timeout.get(message.author.id) == 1) return message.lineReply(`Bu komudu sıksık kullanamazsın! Enerjin **(${data.energy}/100)**`).then(c => c.delete({ timeout: 5000 }))
                timeout.set(message.author.id, 1)
                let random = Math.floor(Math.random() * (100 - 80 + 1)) + 80;
                let yıkanmış = data.yıkanmıştaş
                if (yıkanmış >= 100) { yıkanmış = 100 }
                let dönüşmüş = yıkanmış / 20
                const msj = await message.lineReplyNoMention(`Yıkanmış taşlarını elmas olarak işlemeye başladın. \`Harcanacak enerji miktarı:\` **10%**`)
                await Funny.updateOne({ userID: message.author.id }, { $inc: { energy: -10 } }, { upsert: true })
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını elmas olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 5)}** \`Kazandığın elmas sayısı:\` **${parseInt(dönüşmüş / 5)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 5)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını elmas olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 4)}** \`Kazandığın elmas sayısı:\` **${parseInt(dönüşmüş / 4)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 4)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını elmas olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 3)}** \`Kazandığın elmas sayısı:\` **${parseInt(dönüşmüş / 3)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 3)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını demir olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış / 2)}** \`Kazandığın elmas sayısı:\` **${parseInt(dönüşmüş / 2)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış / 2)}**`)
                await sleep(4500)
                msj.edit(`Yıkanmış taşlarını elmas olarak işliyorsun. \`İşlediğin taş sayısı:\` **${parseInt(yıkanmış)}** \`Kazandığın elmas sayısı:\` **${parseInt(dönüşmüş)}** \`Kalan işlenmemiş taş sayısı:\` **${parseInt(yıkanmış - yıkanmış)}**`)
                await sleep(2500)
                msj.delete()
                await message.lineReply(`Elmas işleme işlemi bitti. İşlediğin elmas miktarı: **${parseInt(dönüşmüş)}** Toplam elmas miktarı: **${parseInt(data.elmas + dönüşmüş)}** İşlenen yıkanmış taş miktarı: **${parseInt(yıkanmış)}** Kalan yıkanmış taş miktarı: **${parseInt(data.yıkanmıştaş - yıkanmış)}**`)
                await Funny.updateOne({ userID: message.author.id }, { $inc: { yıkanmıştaş: -parseInt(yıkanmış), elmas: parseInt(dönüşmüş) } }, { upsert: true })
            }
        })
        
    }

    if (args[0] && args[0].includes('bilgi')) {
        await message.lineReply(new MessageEmbed()
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
            .setDescription(`\`\`\` Genel Bilgiler \`\`\`
                \`Taş\` : **${data.taş}** adet
                \`Yıkanmış Taş\` : **${data.yıkanmıştaş}** adet
                \`Kömür\` : **${data.kömür}** adet
                \`Bakır\` : **${data.bakır}** adet
                \`Demir\` : **${data.demir}** adet
                \`Altın\` : **${data.altın}** adet
                \`Elmas\` : **${data.elmas}** adet
                \`\`\` Taş nasıl toplarım ? \`\`\`
                \`.taş topla\` : **Taş toplamaya başlarsınız. Her 7 buçuk saniyede artacak şekilde 5 seferlik bir döngü sonunda toplam kazandığınız taş miktarı belli olur. İşlem sonunda __5%__ enerji yakarsınız.**
                \`\`\` Topladığım taşları nasıl yıkarım ? \`\`\`
                \`.taş yıka\` : **Topladığınız taşları yıkamaya başlarsınız. Her 7 buçuk saniyede artacak şekilde 5 seferlik bir döngü sonunda elinizdeki taşların tamamını yıkamış olursunuz. Eğer taşlarınızın miktarı 100den fazla ise, tek seferde sadece 100 taşınızı yıkayabilirsiniz. İşlem sonunda __5%__ enerji yakarsınız.**
                \`\`\` Yıkanmış taşlarımı nasıl işlerim ? \`\`\`
                \`.taş işle kömür\` : **Yıkanmış taşlarınızı kömüre işlemeye başlarsınız. Kömür, satılabilen ve enerji üretiminde kullanılabilen bir materyaldir. Kömür işlerken taşlarınızdan bir feda durumu söz konusu olmaz. İşlem sonunda __10%__ enerji yakarsınız.**
                \`.taş işle bakır\` : **Yıkanmış taşlarınızı bakıra işlemeye başlarsınız. Bakır, satılabilen ve enerji üretiminde kullanılabilen bir materyaldir. Bakır işlerken taşlarınızdan belli bir bölümünü kaybedebilirsiniz. İşlem sonunda __10%__ enerji yakarsınız.**
                \`.taş işle demir\` : **Yıkanmış taşlarınızı demire işlemeye başlarsınız. Demir, sadece satılabilen bir materyaldir(en azından şimdilik). Demir işlerken taşlarınızdan belli bir bölümünü kaybedersiniz. İşlem sonunda __10%__ enerji yakarsınız.**
                \`.taş işle altın\` : **Yıkanmış taşlarınızı altına işlemeye başlarsınız. Altın, değeri yüksek olan bir borsa materyalidir. Sadece satış için kullanılabilir(en azından şimdilik). Altın işlerken taşlarınızdan büyük bir bölümünü kaybedebilirsiniz. İşlem sonunda __10%__ enerji yakarsınız.**
                \`.taş işle elmas\` : **Yıkanmış taşlarınızı elmasa işlemeye başlarsınız. Elmas, değeri rakiplerine göre ulaşılamayacak bir yükseklikte olan borsa materyalidir. Sadece satış için kullanılabilir(en azından şimdilik). Elmas işlerken taşlarınızın __80%__ kaybedersiniz. İşlem sonunda __10%__ enerji yakarsınız.**`
            ).setFooter(`Enerjin: ${data.energy}%`)
        )
    }

    setTimeout(async () => {
        timeout.delete(message.author.id)
    }, 1000 * 10)
}
module.exports.configuration = {
    name: 'taş',
    aliases: ["tas", "TAS", "TAŞ"],
    usage: 'taş topla/yıka/yak',
    description: 'Taş mesleği yapmış olursunuz.',
    permLevel: 0
}