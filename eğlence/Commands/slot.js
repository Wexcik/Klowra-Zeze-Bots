const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js');

module.exports.execute = async (client, message, args, ayar) => {
    if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

    let dataBase = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id });
    if(!dataBase) { dataBase = Funny.create({ guildID: message.guild.id, userID: message.author.id })};
    
    let amount = 0;
    let para = parseInt(Number(args[0])) || 1;
    let klowrapara = dataBase.klowrapara;
    if( args[0] && args[0].includes('all') && 10000 < dataBase.klowrapara) { para = 10000 }
    if( args[0] && args[0].includes('all') && 10000 > dataBase.klowrapara) { para = dataBase.klowrapara }
    if( dataBase.klowrapara <= 0 ) return message.lineReply('hiç paran yok.').then(m => m.delete({timeout:5000}))
    if( para > klowrapara) return message.lineReply('bunun için yeterli paran yok.').then(d => d.delete({timeout:5000}));
    if( para > 10000 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`bahse gireceğin miktar 10000 ${client.emojis.cache.find(c => c.name === 'klowracoin')} fazla olamaz.`).then(c => c.delete({timeout:5000}))
    if( para < 0 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`bahse gireceğin miktar 0 ${client.emojis.cache.find(c => c.name === 'klowracoin')} az olamaz.`).then(c => c.delete({timeout:5000}))
    
    let cash = client.emojis.cache.find(x => x.name === "klowracash")
    let patlıcan = client.emojis.cache.find(x => x.name === "klowrapatlican")
    let o = client.emojis.cache.find(x => x.name === "klowrao")
    let w = client.emojis.cache.find(x => x.name === "klowraw")
    let kiraz = client.emojis.cache.find(x => x.name === "klowrakiraz")
    let kalp = client.emojis.cache.find(x => x.name === "klowrakalp")
    
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    let msg = await message.lineReply(`${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
    
    let öncekipara = dataBase.klowrapara || 0 ; 
    dataBase.klowrapara = (Number(öncekipara) - para)
    dataBase.save()
    
    const slots = [patlıcan,kalp,kiraz,cash,o,w]
    let rslots = [];
			let rand = Math.random();
			let win = 0;
			let logging = 0;
			if(rand<=.20){//1x 20%
				win = amount;
				rslots.push(slots[0]);
				rslots.push(slots[0]);
				rslots.push(slots[0]);
				logging = 0;
			}else if(rand<=.40){ //2x 20%
				win = amount*2;
				rslots.push(slots[1]);
				rslots.push(slots[1]);
				rslots.push(slots[1]);
				logging = 1;
			}else if(rand<=.45){ //3x 5%
				win = amount*3;
				rslots.push(slots[2]);
				rslots.push(slots[2]);
				rslots.push(slots[2]);
				logging = 2;
			}else if(rand<=.475){ //4x 2.5%
				win = amount*4;
				rslots.push(slots[3]);
				rslots.push(slots[3]);
				rslots.push(slots[3]);
				logging = 3;
			}else if(rand<=.485){ //10x 1%
				win = amount*10;
				rslots.push(slots[4]);
				rslots.push(slots[5]);
				rslots.push(slots[4]);
				logging = 9;
			}else{
				logging = -1;
				var slot1 = Math.floor(Math.random()*(slots.length-1));
				var slot2 = Math.floor(Math.random()*(slots.length-1));
				var slot3 = Math.floor(Math.random()*(slots.length-1));
                if(slot3==slot1)
					slot2 = (slot1+Math.ceil(Math.random()*(slots.length-2)))%(slots.length-1);
				if(slot2==slots.length-2)
					slot2++;
				rslots.push(slots[slot1]);
				rslots.push(slots[slot2]);
				rslots.push(slots[slot3]);
            }
    
    if( rslots[0] === patlıcan && rslots[1] === patlıcan && rslots[2] === patlıcan ){
       await sleep(2500)
       await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
       await sleep(1500)
       await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${rslots[2]} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
       await sleep(2500)
       await msg.edit(`${rslots[0]} ${rslots[1]} ${rslots[2]} ${message.author} **${para}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kazandın.`)
       let dataBasep = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id });
       let öncekiparap = dataBasep.klowrapara || 0 ; 
       dataBasep.klowrapara = (Number(öncekiparap) + para)
       dataBasep.save()
    }
    if( rslots[0] === cash && rslots[1] === cash && rslots[2] === cash ){
        await sleep(2500)
       await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
       await sleep(1500)
       await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${rslots[2]} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
       await sleep(2500)
       await msg.edit(`${rslots[0]} ${rslots[1]} ${rslots[2]} ${message.author} **${para*4}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kazandın.`)
       let dataBasec = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id });
       let öncekiparac = dataBasec.klowrapara || 0 ; 
       dataBasec.klowrapara = (Number(öncekiparac) + para*4)
       dataBasec.save()
    }
    if( rslots[0] === kalp && rslots[1] === kalp && rslots[2] === kalp){
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(1500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${rslots[2]} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${rslots[1]} ${rslots[2]} ${message.author} **${para*2}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kazandın.`)
        let dataBasek = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id });
        let öncekiparak = dataBasek.klowrapara || 0 ; 
        dataBasek.klowrapara = (Number(öncekiparak) + para*2)
        dataBasek.save()
    }
    if( rslots[0] === kiraz && rslots[1] === kiraz && rslots[2] === kiraz){
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(1500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${rslots[2]} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${rslots[1]} ${rslots[2]} ${message.author} **${para*3}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kazandın.`)
        let dataBaseki = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id });
        let öncekiparaki = dataBaseki.klowrapara || 0 ; 
        dataBaseki.klowrapara = (Number(öncekiparaki) + para*3)
        dataBaseki.save()
    }
    if( rslots[0] === o && rslots[1] === w && rslots[2] === o){
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(1500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${rslots[2]} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${rslots[1]} ${rslots[2]} ${message.author} **${para*10}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kazandın.`)
        let dataBaseo = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id });
        let öncekiparao = dataBaseo.klowrapara || 0 ; 
        dataBaseo.klowrapara = (Number(öncekiparao) + para*10)
        dataBaseo.save()
    }
    if( rslots[0] !== rslots[1] && rslots[0] !== rslots[2]){
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(1500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${rslots[2]} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${rslots[1]} ${rslots[2]} ${message.author} üzgünüm **${para}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kaybettin.`)
    }
    if( rslots[0] === rslots[1] && rslots[0] !== rslots[2]){
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(1500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${rslots[2]} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${rslots[1]} ${rslots[2]} ${message.author} üzgünüm **${para}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kaybettin.`)
    }
    if( rslots[0] !== rslots[1] && rslots[0] === rslots[2] && rslots[0] !== o && rslots[2] !== o){
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(1500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${rslots[2]} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${rslots[1]} ${rslots[2]} ${message.author} üzgünüm **${para}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kaybettin.`)
    }
    if( rslots[0] !== rslots[1] && rslots[0] === rslots[2] && rslots[1] !== w){
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${client.emojis.cache.find(x => x.name === "klowradonen")} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(1500)
        await msg.edit(`${rslots[0]} ${client.emojis.cache.find(x => x.name === "klowradonen")} ${rslots[2]} Slot makinası dönüyor. Bahsin ${para} ${client.emojis.cache.find(c => c.name === 'klowracoin')}`)
        await sleep(2500)
        await msg.edit(`${rslots[0]} ${rslots[1]} ${rslots[2]} ${message.author} üzgünüm **${para}** ${client.emojis.cache.find(c => c.name === 'klowracoin')} kaybettin.`)
    }
}
module.exports.configuration = {
    name: 'slot',
    aliases: ['s'],
    usage: 's all/para miktarı',
    description: 'Slot makinasında para katlamanıza/kaybetmenize yarar.',
    permLevel: 0,
    cooldown: 10
}
3