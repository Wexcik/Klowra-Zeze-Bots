const { randomRange, verify } = require('../util/Util.js');
const { stripIndents } = require('common-tags');
const { MessageEmbed } = require('discord.js');
const Funny = require('../Models/Funny.js');

module.exports.execute = async (client, message, args, ayar) => {
	if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    this.fighting = new Set();
	if(args[0] && args[0].includes('bilgi')) {
let user =  message.mentions.users.first() || client.users.cache.get(args[1]) || message.author;
		let authorDatais = await Funny.findOne({ guildID: message.guild.id, userID: user.id }) 
		if (!authorDatais) {
		authorDatais = await Funny.create({ guildID: message.guild.id, userID: user.id })}

		message.lineReply(new MessageEmbed().setAuthor(`${user.tag}`, user.avatarURL({dynamic: true, size:256}) ? user.avatarURL({dynamic: true, size:256}) : message.guild.iconURL({dynamic: true, size:256})).setThumbnail(`${user.avatarURL({dynamic: true, size:256}) ? user.avatarURL({dynamic: true, size:256}) : message.guild.iconURL({dynamic: true, size:256})}`).addField(`${client.emojis.cache.find(x => x.name === "klowrareg2")} Kazandığın Maçlar :`, `${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Toplam:\`  **${!authorDatais.kazanılan ? '0' : authorDatais.kazanılan}** \`maç!\``).addField(`${client.emojis.cache.find(x => x.name === "klowrareg2")} Kaybettiğin Maçlar :`, `${client.emojis.cache.find(x => x.name === "klowrareg2")} \`Toplam:\`  **${!authorDatais.kaybedilen ? '0' : authorDatais.kaybedilen}** \`maç!\``).setFooter(`K/D : ${`${authorDatais.kazanılan ? authorDatais.kazanılan : '0'}`/`${authorDatais.kaybedilen ? authorDatais.kaybedilen : '0'}`}`).setTimestamp().setColor("RANDOM"))
return

	}
	let opponent = message.mentions.users.first() || client.users.cache.get(args[0])
	if (!opponent && !args[0]) return message.lineReply("Oynamak istediğin kişiyi etiketleyip istersen bahis belirtebilirsin \n (örn: .düello <@kişietiketi> 500) yada \`bilgi\` argümanını belirtmelisin!").then(m=>m.delete({timeout: 5000}))

    let bahis = parseInt(Number(args[1]))

	let authorDatakisi = await Funny.findOne({ guildID: message.guild.id, userID: message.author.id }) 
	if (!authorDatakisi) {
		authorDatakisi = await Funny.create({ guildID: message.guild.id, userID: message.author.id })}
	let authorDataoppo = await Funny.findOne({ guildID: message.guild.id, userID: opponent.id })
	if (!authorDataoppo) {
	authorDataoppo = await Funny.create({ guildID: message.guild.id, userID: opponent.id })}
	if (bahis > 10000 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`bahse gireceğin miktar 10000 ${client.emojis.cache.find(c => c.name === 'klowracoin')} fazla olamaz. Enerjin **(${authorDatakisi.energy}/100)**`).then(c => c.delete({timeout:5000}))
    if (bahis < 0 && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`bahse gireceğin miktar 0 ${client.emojis.cache.find(c => c.name === 'klowracoin')} az olamaz. Enerjin **(${authorDatakisi.energy}/100)**`).then(c => c.delete({timeout:5000}))
	if (bahis > authorDatakisi.klowrapara) return message.lineReply('yeterli paran yok. Enerjin **(${authorDatakisi.energy}/100)**').then(c => c.delete({timeout: 5000}))
	if (bahis > authorDataoppo.klowrapara) return message.lineReply(`${opponent} kişisinin parası yeterli değil. Enerjin **(${authorDatakisi.energy}/100)**`).then(c => c.delete({timeout: 5000})) 
	if (authorDatakisi.energy < 5) return message.lineReply(`Enerjin yeterli değil! Enerjin **(${authorDatakisi.energy}/100)**`).then(c => c.delete({timeout: 5000})) 
	if (authorDataoppo.energy < 5) return message.lineReply(`Düello teklif ettiğin kişinin enerjisi yeterli değil! Kişinin enerji durumu **(${authorDataoppo.energy}/100)**`).then(c => c.delete({timeout: 5000})) 
  if (opponent.bot) return message.lineReply('Botlar ile oynayamazsın! Enerjin **(${authorDatakisi.energy}/100)**').then(c => c.delete({timout: 5000}));
  if (opponent.id === message.author.id) return message.lineReply('Kendin ile düello Atamazsın! Enerjin **(${authorDatakisi.energy}/100)**').then(c => c.delete({timout: 5000}));
		if (this.fighting.has(message.channel.id)) return message.lineReply('Kanal başına sadece bir düello meydana gelebilir.').then(c => c.delete({timeout: 5000}));
		this.fighting.add(message.channel.id);
		try {
			if (!opponent.bot || !bahis) {
                let msg = await message.lineReplyNoMention(`${opponent}`, new MessageEmbed()
				.setAuthor(`${opponent.tag}`, opponent.avatarURL({dynamic: true, size:256}))
				.setThumbnail(`${opponent.avatarURL({dynamic: true, size:256})}`)
				.setDescription(bahis ? `**${bahis}** ${client.emojis.cache.find(x => x.name === "klowracoin")} düello isteği geldi. Düello'yu kabul ediyor musun? \`evet\` veya \`hayır\` olarak cevap veriniz.` : `Düello isteği geldi. Düello'yu kabul ediyor musun? \`evet\` veya \`hayır\` olarak cevap veriniz.`).setTimestamp().setColor("BLACK"));
				const verification = await verify(message.channel, opponent);
				if (!verification) {
					this.fighting.delete(message.channel.id);
					msg.delete()
					return message.lineReply(`Düello kabul edilmedi...`).then(c => c.delete({timeout: 10000}));
				}
				await Funny.updateOne({ userID: opponent.id}, { $inc: { energy: -5}}, { upsert: true})
				await Funny.updateOne({ userID: message.author.id}, { $inc: { energy: -5}}, { upsert: true})
			}
			let userHP = 1000;
			let oppoHP = 1000;
			let userTurn = false;
			let guard = false;
			let heal = false;
			const resetg = (changeGuard = true) => {
				userTurn = !userTurn;
				if (changeGuard && guard) guard = false;
			};
			const dealDamage = damage => {
				if (userTurn) oppoHP -= damage;
				else userHP -= damage;
			};
			const healDamage = damage => {
				if (userTurn) userHP += damage;
				else oppoHP += damage;
			};
			const healDamage2 = damage => {
				if (userTurn) userHP -= damage;
				else oppoHP -= damage;
			};
			const forfeit = () => {
				if (userTurn) userHP = 0;
				else oppoHP = 0;
			};
			while (userHP > 0 && oppoHP > 0) { // eslint-disable-line no-unmodified-loop-condition
				const user = userTurn ? message.author : opponent;
				let choice;
				if (!opponent.bot || (opponent.bot && userTurn)) {
					await message.lineReplyNoMention(stripIndents`
						${user}, ne yapmak istersin? \`saldır\`, \`savun\`, \`iyileş\` veya \`ultra güç\`?
						**${message.author.username}**: ${userHP} :heartpulse:
						**${opponent.username}**: ${oppoHP} :heartpulse:
					`);
					const filter = res =>
						res.author.id === user.id && ['saldır', 'savun', 'ultra güç', 'iyileş'].includes(res.content.toLowerCase());
					const turn = await message.channel.awaitMessages(filter, {
						max: 1,
						time: 30000
					});
					if (!turn.size) {
						const damage2 = randomRange(80, heal ? 50 : 65)
						await message.lineReplyNoMention(`${user} üzgünüm ama, süre doldu! ${damage2} hasar aldın.`);
						healDamage2(damage2)
						resetg();
						continue;
					}
					choice = turn.first().content.toLowerCase();
				} else {
					const choices = ['saldır', 'savun', 'iyileş', 'ultra güç'];
					choice = choices[Math.floor(Math.random() * choices.length)];
				}
				if (choice === 'saldır') {
					const damage = Math.floor(Math.random() * (guard ? 5 : 100)) + 1;
					await message.lineReplyNoMention(`${user}, **${damage}** hasar vurdu!`);
					dealDamage(damage);
					resetg();
				} else if (choice === 'savun') {
					await message.lineReplyNoMention(`${user}, kendisini süper kalkan ile savundu!`);
					guard = true;
					resetg(false);
				} else if (choice === 'ultra güç') {
					const miss = Math.floor(Math.random() * 2);
					if (!miss) {
						const damage = randomRange(150, guard ? 1 : 100);
						await message.lineReplyNoMention(`${user}, çok uzak galaksilerden gelen ultra sonik enerjiyi yeterli miktarda topladın ve **${damage}** hasar vurdun!!`);
						dealDamage(damage);
					} else {
						const damage2 = randomRange(25, guard ? 5 : 10);
						await message.lineReplyNoMention(`${user}, çok uzak galaksilerden gelen ultra sonik enerjiyi yeterli miktarda toplayamadığın için ulta güç kullanamadın! Yorgunluktan dolayı **${damage2}** hasar yedin.`);
						healDamage2(damage2)
					}
					resetg();
				} else if (choice === 'iyileş') {
					const miss = Math.floor(Math.random() * 2);
					if (!miss) {
						const damage = randomRange(100, heal ? 10 : 60);
						await message.lineReplyNoMention(`${user}, ustasının öğrettiği şekilde büyü gücü kullanarak kendini **${damage}** can iyileştirdin.`);
						healDamage(damage);
					} else {
						const damage2 = randomRange(10, heal ? 1 : 5)
						await message.lineReplyNoMention(`${user}, Büyü gücün bunun için yetersiz kaldı ve iyileştirme işlemin yarıda kesildi. Büyünün yarattığı ters etkiden dolayı **${damage2}** hasar aldın.`);
						healDamage2(damage2)
					}
					resetg();
				} else {
					await message.lineReplyNoMention('Ne yapmak istediğini anlamadım.');
				}
			}
			this.fighting.delete(message.channel.id);
            const winner = userHP > oppoHP ? message.author : opponent;
			message.lineReplyNoMention(`Oyun bitti! Tebrikler, **${winner}** kazandı! ${bahis ? `**${bahis}** ${client.emojis.cache.find(x => x.name === "klowracoin")}` : 'Bahis yok.'} \n**${message.author.username}**: ${userHP} :heartpulse: \n**${opponent.username}**: ${oppoHP} :heartpulse:`);
			let authorData = await Funny.findOne({ guildID: message.guild.id, userID: winner.id });
			if (!authorData) {
				authorData = await Funny.create({
					guildID: message.guild.id,
					userID: winner.id,
					kazanılan: 1,
				});
			} else {
				let öncekiveri = authorData.kazanılan || 0;
				let öncekipara = authorData.klowrapara || 0;
				authorData.kazanılan = (Number(öncekiveri) + 1);
				if (bahis) authorData.klowrapara = (Number(öncekipara) + bahis)
				authorData.save();
			};
			const looser = oppoHP > userHP ? message.author : opponent;
			let authorData1 = await Funny.findOne({ guildID: message.guild.id, userID: looser.id });
			if (!authorData1) {
				authorData1 = await Funny.create({
					guildID: message.guild.id,
					userID: looser.id,
					kaybedilen: 1,
				});
			} else {
				let öncekiveri = authorData1.kaybedilen || 0;
				let öncekipara = authorData1.klowrapara || 0;
				authorData1.kaybedilen = (Number(öncekiveri) + 1);
				if (bahis) authorData1.klowrapara = (Number(öncekipara) - bahis)
				authorData1.save();
			
			return 
		
			
			};} catch (err) {
			this.fighting.delete(message.channel.id);
			throw err;
		}
};
module.exports.configuration = {
    name: 'düello',
    aliases: ["duello","vs","kapışma"],
    usage: 'düello [kişi etiketi]',
    description: 'Etiketlediğiniz kişi ile düelloya girersiniz.',
    permLevel: 0,
	cooldown: 0
};