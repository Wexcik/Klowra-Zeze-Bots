const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
	let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
	let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
	if (!uye) return message.lineReply(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
	if (!ayar.bansorumlusu.some(rol => message.member.roles.cache.has(rol)) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply("Ban/Jail sorumlularına ulaşmalısın!"), message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
	if (banLimitleri.get(message.author.id) >= ayar.unban && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
	if (uye.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) return message.react(client.emojis.cache.find(c => c.name === 'klowraiptal'));
	Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).sort({ atilmaTarihi: -1 }).exec(async (err, data) => {
		let cezalar = data.filter(d => (d.cezaTuru === "BAN") && (!d.bitisTarihi || d.bitisTarihi > Date.now()))
		if (!cezalar.length) return message.lineReply("Bu kullanıcının kayıtlara geçen bir ban cezası yok.")
		message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`)
		cezalar.forEach(d => {
			d.bitisTarihi = Date.now();
			d.save();
			if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
				banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
			}
						setTimeout(() => {
				banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
			}, 1000 * 60 * 3);
		});
		
		let yetkili = await client.users.fetch(cezalar[0].yetkiliID)
		let roller = await cezalar[0].yetkiler
		let adı = await cezalar[0].adı
		
		await uye.roles.set(roller).catch();
		await uye.setNickname(adı)		
		
		message.lineReply(embed.setDescription(`${uye} üyesinin ${message.guild.roles.cache.get(ayar.underworld).toString()} rolü, ${message.author} tarafından alındı!`)).catch();
		if (client.channels.cache.find(c => c.name === ayar.banLogKanali)) client.channels.cache.find(c => c.name === ayar.banLogKanali).send(new MessageEmbed().setColor("GREEN").setDescription(`${uye} üyesinin ${message.guild.roles.cache.get(ayar.underworld).toString()} rolü, ${message.author} tarafından alındı!`)).catch();
		if (cezalar[0].yetkiliID === message.author.id) return
		await yetkili.send(`${message.author} yetkilisi ${uye}'ye attığın banı kaldırdı.`).catch(err => undefined);
	});
};
module.exports.configuration = {
	name: "unban",
	aliases: [],
	usage: "unban [üye]",
	description: "Belirtilen üyeye af getirirsiniz.",
	permLevel: 0
};