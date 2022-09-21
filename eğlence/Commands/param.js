const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js'); 
const { createCanvas, loadImage, registerFont } = require('canvas');
registerFont(`${__dirname}/../../images/KoHo-Bold.ttf`, { family : "KoHo"});

module.exports.execute = async (client, message, args, ayar) => {
    
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    let dataBase = await Funny.findOne({ guildID: message.guild.id, userID: user.id })
    if (!dataBase) { dataBase = Funny.create({ guildID: message.guild.id, userID: user.id })}
    let para = dataBase.klowrapara
    let coin = dataBase.coin

    function roundedImage(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    };

    const canvas = createCanvas(700, 370);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#7F221E"
    roundedImage(ctx, 0, 0, canvas.width, canvas.height, 10)
    ctx.clip();
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.restore();

    const backgound = await loadImage(`${__dirname}/../../images/kart.jpg`);
    roundedImage(ctx, 5, 5, 690, 360, 10)
    ctx.clip();
    ctx.drawImage(backgound, 5, 5, 690, 360);

    ctx.restore();

    const x = await loadImage(`${__dirname}/../../images/wifi.png`)
    ctx.drawImage(x, 0, 16, 150, 93)

    const xx = await loadImage(`${__dirname}/../../images/cip.png`);
    ctx.drawImage(xx, 35, 155, 85, 65)

    const xxx = await loadImage(`${__dirname}/../../images/coin.png`);
    ctx.drawImage(xxx, 300, 170, 120, 120) 

    const xxxx = await loadImage(`${__dirname}/../../images/para.png`);
    ctx.drawImage(xxxx, 320, 105, 80, 80) 

    const xxxxx = await loadImage(`${__dirname}/../../images/cizgi.png`);
    ctx.drawImage(xxxxx, 5, 60, 700, 500) 

    ctx.fillStyle = "WHITE";
    ctx.font = "50px KoHo";
    ctx.fillText("KLOWRABANK", 325, 80)

    ctx.fillStyle = "WHITE";
    ctx.font = "35px Arial Black";
    ctx.fillText(`${coin ? parseInt(coin) : '0'}`, 420, 240)

    ctx.fillStyle = "WHITE";
    ctx.font = "35px Arial Black";
    ctx.fillText(`${para ? parseInt(para) : '0'}`, 420, 160)

    ctx.fillStyle = "WHITE";
    ctx.font = "35px Arial Black";
    ctx.fillText(`${user.id}`, 320, 317, 370, 100)

    ctx.fillStyle = "WHITE";
    ctx.font = "35px Tahoma";
    ctx.fillText(`${message.guild.members.cache.get(user.id).displayName ? message.guild.members.cache.get(user.id).displayName : user.username}`, 40, 317, 250, 50)

    message.lineReply({ files: [{ attachment: canvas.toBuffer(), name: "kart.jpg"}]})
}
module.exports.configuration = {
    name: 'para',
    aliases: ["klowrapara","banka", "param"],
    usage: 'banka',
    description: 'Mevcut klowraparanızı görürsünüz.',
    permLevel: 0
}