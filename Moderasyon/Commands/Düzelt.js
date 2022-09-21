const { MessageEmbed } = require('discord.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, conf, emoji) => {
	const embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("ff0013");
	const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
	if(!conf.sahipRolu.some(role => message.member.roles.cache.has(role)) && message.channel.name !== conf.kayıtKanali && !conf.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
	if (!client.kullanabilir(message.author.id) && !conf.teyitciRolleri.some(r => message.member.roles.cache.has(r))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
	if (!member) return message.lineReply(embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
	if (banLimitleri.get(message.author.id) >= 3) return message.lineReply(`\`${this.configuration.name} komutu için limite ulaştın!\``).then(x => x.delete({ timeout: 5000 }))
	if (message.member.roles.highest.position <= member.roles.highest.position) return message.lineReply(embed.setDescription('Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!')).then(x => x.delete({ timeout: 5000 }));
	args = args.filter(a => a !== '' && a !== ' ').splice(1);
	const name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', 'İ').toUpperCase() + arg.slice(1)).join(' ');
	let displayName;
	const age = args.filter(arg => !isNaN(arg))[0] || undefined;
	if (!name || !age) return message.lineReply(embed.setDescription('Geçerli bir isim ve yaş belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
	displayName = `${member.user.username.includes(conf.tag) ? conf.tag : conf.ikinciTag} ${name} | ${age}`;
	member.setNickname(displayName);
	message.lineReply(embed.setDescription(`${member.toString()} kişisinin ismi "${displayName.slice(2)}" olarak değiştirildi.`)).then((x) => x.delete({ timeout: 10000 }));
	if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
		banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) + 1);
	}
	setTimeout(() => {
		banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
	}, 1000 * 60 * 3);
};

module.exports.configuration = {
	name: 'isim',
	aliases: ['düzelt', 'name', 'nick'],
	usage: 'isim [üye] [isim] [yaş]',
	description: 'Belirtilen üyenin ismini değiştirir.',
	permLevel: 0
};
