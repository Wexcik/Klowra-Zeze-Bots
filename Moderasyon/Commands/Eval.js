const Discord = require('discord.js');
const moment = require('moment');

module.exports.execute = async (client, message, args, ayar) => {
    if (![...ayar.sahip, "470974660264067072"].some(id => message.author.id === id)) return;
    if (!args[0] || args[0].includes('token')) return message.lineReply('Kod belirtilmedi `' + this.configuration.name + '`__`<kod>`__');

    const code = args.join(' ');
    function clean(text) {
        if (typeof text !== 'string')
            text = require('util').inspect(text, { depth: 0 });
        text = text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203));
        return text;
    }
    try {
        var evaled = clean(await eval(code));
        //if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace('token', 'Yasaklı komut').replace(client.token, 'Yasaklı komut').replace(process.env.PROJECT_INVITE_TOKEN, 'Yasaklı komut');
        message.lineReply(`${evaled/*.replace(client.token, 'Yasaklı komut').replace(process.env.PROJECT_INVITE_TOKEN, 'Yasaklı komut')*/}`, { code: 'js', split: true });
    } catch (err) { message.lineReply(err, { code: 'js', split: true }); }
};
module.exports.configuration = {
    name: 'eeval',
    aliases: ['hewal', 'dene', 'test', 'çalıştır'],
    usage: 'eval',
    description: 'Bot sahibine özel.',
    permLevel: 0
};

