const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js')

module.exports.execute = async (client, message, args, ayar) => {
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const data = await Funny.findOne({ userID: message.author.id })
    if (!data) { data = Funny.create({ guildID: message.guild.id, userID: message.author.id }) }
    if (!args[0] || !args[0].includes('yükselt') && !args[0].includes('bilgi')) return message.lineReply(`Belli bir argüman girmen gerekli. \`bilgi veya yükselt\` Enerji **(${data.energy}/100)**`).then(c => c.delete({ timeout: 7500 }))
    if (args[0] && args[0].includes('bilgi')) {
        let kazma = 'Yok'
        let can = 0
        let kalancan = 0
        let next = 'Taş Kazma'
        if (data.taşkazma == true) {
            kazma = 'Taş Kazma'
            can = data.taşkazmacan
            kalancan = 100 
            next = 'Demir Kazma'
        }
        if (data.demirkazma == true) {
            kazma = 'Demir Kazma'
            can = data.demirkazmacan
            kalancan = 120
            next = 'Altın Kazma'
        }
        if (data.altınkazma == true) {
            kazma = 'Altın Kazma'
            can = data.altınkazmacan
            kalancan = 150
            next = 'Elmas Kazma'
        }
        if (data.elmaskazma == true) {
            kazma = 'Elmas Kazma'
            can = data.elmaskazmacan
            kalancan = 200
            next = 'Yok'
        }
        message.lineReply(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
        .setDescription(`
        \`\`\`..=> Kazma Bilgileri\`\`\`
        \`Şu an Kullanılan Kazma\` : **${kazma}**
        \`Kazmanın Sağlamlık Durumu\` : **${can}/${kalancan}**
        \`Yükseltilebilirlik\` : **${next}**
        \`\`\`..=> Kazmamı Nasıl Yükseltirim ?\`\`\`
        \`.kazma yükselt\` : **Eğer hiç kazmanız yok ise, belirli bir ücret ile ilk kazmanız olan taş kazmaya yükseltebilirsiniz. Diğer kazmalar ise \`.taş\` komutunda topladığınız materyaller ve belirli ücretler ile yükseltilebilir. Bu işlemlerde enerji harcamazsınız.**
        `).setFooter(`Enerjin: ${data.energy}%`))
    }
    if (args[0] && args[0].includes('yükselt')) {
        let yükseltmecoin = 10000
        let demir = 0
        let altın = 0
        let elmas = 0
        let kazma = 'Taş Kazma'
        let kazman = 'Yok'
        let can = 100
        let yükseltilebilirlik = true
        if (data.taşkazma == true) {
            yükseltmecoin = 25000
            demir = 34
            altın = 0
            elmas = 0
            kazma = 'Demir Kazma'
            kazman = 'Taş Kazma'
            can = 120
            yükseltilebilirlik = true
        }
        if (data.demirkazma == true) {
            yükseltmecoin = 40000
            demir = 38
            altın = 16
            elmas = 0
            kazma = 'Altın Kazma'
            kazman = 'Demir Kazma'
            can = 150
            yükseltilebilirlik = true
        }
        if (data.altınkazma == true) {
            yükseltmecoin = 85000
            demir = 52
            altın = 27
            elmas = 14
            kazma = 'Elmas Kazma'
            kazman = 'Altın Kazma'
            can = 200
            yükseltilebilirlik = true
        }
        if (data.elmaskazma == true) {
            yükseltmecoin = 0
            demir = 0
            altın = 0
            elmas = 0
            kazma = 'Yok'
            kazman = 'Elmas Kazma'
            yükseltilebilirlik = false
        }
        if (yükseltilebilirlik = false) return message.lineReply(`Zaten \`Elmas Kazmaya\` sahipsin!`)
        if (data.klowrapara < yükseltmecoin) return message.lineReply(`Gerekli materyaller \`Coin\`: ${data.klowrapara > yükseltmecoin ? yükseltmecoin : data.klowrapara}/${yükseltmecoin} \`Demir\`: ${data.demir > demir ? demir : data.demir}/${demir} \`Altın\`: ${data.altın > altın ? altın : data.altın}/${altın} \`Elmas\`: ${data.elmas > elmas ? elmas : data.elmas}/${elmas}`)
        if (data.demir < demir) return message.lineReply(`Gerekli materyaller \`Coin\`: ${data.klowrapara > yükseltmecoin ? yükseltmecoin : data.klowrapara}/${yükseltmecoin} \`Demir\`: ${data.demir > demir ? demir : data.demir}/${demir} \`Altın\`: ${data.altın > altın ? altın : data.altın}/${altın} \`Elmas\`: ${data.elmas > elmas ? elmas : data.elmas}/${elmas}`)
        if (data.altın < altın) return message.lineReply(`Gerekli materyaller \`Coin\`: ${data.klowrapara > yükseltmecoin ? yükseltmecoin : data.klowrapara}/${yükseltmecoin} \`Demir\`: ${data.demir > demir ? demir : data.demir}/${demir} \`Altın\`: ${data.altın > altın ? altın : data.altın}/${altın} \`Elmas\`: ${data.elmas > elmas ? elmas : data.elmas}/${elmas}`)
        if (data.elmas < elmas) return message.lineReply(`Gerekli materyaller \`Coin\`: ${data.klowrapara > yükseltmecoin ? yükseltmecoin : data.klowrapara}/${yükseltmecoin} \`Demir\`: ${data.demir > demir ? demir : data.demir}/${demir} \`Altın\`: ${data.altın > altın ? altın : data.altın}/${altın} \`Elmas\`: ${data.elmas > elmas ? elmas : data.elmas}/${elmas}`)
        if (data.taşkazma == true && data.demirkazma == false && data.altınkazma == false && data.elmaskazma == false) {
            await Funny.updateOne({ userID: message.author.id }, { $set: { demirkazma: true, demirkazmacan: can }, $inc: { demir: -parseInt(demir), altın: -parseInt(altın), elmas: -parseInt(elmas), klowrapara: -parseInt(yükseltmecoin) } }, { upsert: true })
        }
        if (data.taşkazma == true && data.demirkazma == true && data.altınkazma == false && data.elmaskazma == false) {
            await Funny.updateOne({ userID: message.author.id }, { $set: { altınkazma: true, altınkazmacan: can }, $inc: { demir: -parseInt(demir), altın: -parseInt(altın), elmas: -parseInt(elmas), klowrapara: -parseInt(yükseltmecoin) } }, { upsert: true })
        }
        if (data.taşkazma == true && data.demirkazma == true && data.altınkazma == true && data.elmaskazma == false) {
            await Funny.updateOne({ userID: message.author.id }, { $set: { elmaskazma: true, elmaskazmacan: can }, $inc: { demir: -parseInt(demir), altın: -parseInt(altın), elmas: -parseInt(elmas), klowrapara: -parseInt(yükseltmecoin) } }, { upsert: true })
        }
        if (data.taşkazma == false && data.demirkazma == false && data.altınkazma == false && data.elmaskazma == false) {
            await Funny.updateOne({ userID: message.author.id }, { $set: { taşkazma: true, taşkazmacan: can }, $inc: { demir: -parseInt(demir), altın: -parseInt(altın), elmas: -parseInt(elmas), klowrapara: -parseInt(yükseltmecoin) } }, { upsert: true })
        }
        message.lineReply(new MessageEmbed().setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
        .setDescription(`
        \`\`\`..=> Yükseltme Bilgileri
        ..=>Kazman = ${kazman}
        ..=>Yeni Kazma = ${kazma}
        ..=>Harcanan Materyal = ${demir} demir, ${altın} altın, ${elmas} elmas
        ..=>Harcanan Para = ${yükseltmecoin} coin
        ..=>Kazmanın Sağlamlığı = ${can}/${can}
        ..=>Yükseltme Durumu = Başarılı!\`\`\`
        `))
    }
}
module.exports.configuration = {
    name: 'kazma',
    aliases: [],
    usage: 'kazma bilgi/yükselt',
    description: 'Kazmanınızı yükseltmenize yarar.',
    permLevel: 0
};