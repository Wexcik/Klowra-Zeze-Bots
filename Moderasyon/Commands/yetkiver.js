const fs = require("fs");

const path = "./Moderasyon/yetkiler.json";
const perms = require("../yetkiler.json");
const RoleData = require('../Models/rollogs.js');

const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    if(!message.channel.name === ayar.yetkitakip && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
    const Webhook = new WebhookClient(ayar.yetkiwebhookid, ayar.yetkiwebhooktoken);
    if (!args[0]) return message.lineReply("\`oluştur\`,\`liste\`,\`bilgi\` \`düzenle\` veya \`kaldır\` argümanlarını kullanmalısın.").then(x => x.delete({ timeout: 7500 }))
    if (args[0] === "oluştur") {
        if (!ayar.yetkiayar.includes(message.author.id)) return message.lineReply("`Yetki ayarlamaya idin girilmemiş.`").then(x => x.delete({ timeout: 7500 }))
        if (!args[1]) return message.lineReply("bir isim girmelisin.");
        if (perms[args[1]]) return message.lineReply("bu isimde zaten bir yetki mevcut.");
        perms[args[1]] = { roles: [], authors: [] }
        fs.writeFile(path, JSON.stringify(perms), (err) => {
            if (err) return console.log(err);
            return message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`), message.lineReply(
                new MessageEmbed()
                    .setDescription(`**${args[1]}** yetkisi başarıyla oluşturuldu.`)
            ).then(x => x.delete({ timeout: 7500 }))
        });
    } else if (args[0] === "kaldır") {
        if (!ayar.yetkiayar.includes(message.author.id)) return message.lineReply("`Yetki ayarlamaya idin girilmemiş.`").then(x => x.delete({ timeout: 7500 }))
        if (!args[1]) return message.lineReply("bir yetki ismi girmelisin.");
        if (!perms[args[1]]) return message.lineReply("yetki bulunamadı.");
        delete perms[args[1]];
        fs.writeFile(path, JSON.stringify(perms), (err) => {
            if (err) return console.log(err);
            return message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`), message.lineReply(
                new MessageEmbed()
                    .setDescription(`**${args[1]}** yetkisi başarıyla kaldırıldı.`)
            ).then(x => x.delete({ timeout: 7500 }));
        });
        Webhook.send(
            new MessageEmbed()
                .setDescription(`Ayarlayan : ${message.author}\n**${args[1]}** yetkisi başarıyla kaldırıldı.`)
        );
    } else if (args[0] === "düzenle") {
        if (!ayar.yetkiayar.includes(message.author.id)) return message.lineReply("`Yetki ayarlamaya idin girilmemiş.`").then(x => x.delete({ timeout: 7500 }));
        if (!args[1]) return message.lineReply("bir yetki ismi girmelisin.").then(x => x.delete({ timeout: 7500 }))
        if (!perms[args[1]]) return message.lineReply("yetki bulunamadı.").then(x => x.delete({ timeout: 7500 }))
        if (!args[2] && args[2] !== "roller" && args[2] !== "kullanabilecekler") return message.lineReply("\`roller\` veya \`kullanabilecekler\` argümanlarını kullanmalısın.").then(x => x.delete({ timeout: 7500 }))
        if (args[2] === "roller") {
            const roles = message.mentions.roles.array();
            if (roles.length < 1) return message.lineReply("rol veya roller etiketlemelisin.").then(x => x.delete({ timeout: 7500 }));
            perms[args[1]].roles = roles.map(role => role.id);
            fs.writeFile(path, JSON.stringify(perms), (err) => {
                if (err) return console.log(err);
                return message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`), message.lineReply(
                    new MessageEmbed()
                        .setDescription(`**${args[1]}** yetkisinde verilecek roller ${roles.join(", ")} olarak ayarlandı.`)
                ).then(x => x.delete({ timeout: 7500 }));
            });
            Webhook.send(
                    new MessageEmbed()
                        .setDescription(`Ayarlayan: ${message.author}\n**${args[1]}** yetkisinde verilecek roller ${roles.join(", ")} olarak ayarlandı.`)
                );
        } else if (args[2] === "kullanabilecekler") {
            const roles = message.mentions.roles.array();
            if (roles.length < 1) return message.lineReply("rol veya roller etiketlemelisin.").then(x => x.delete({ timeout: 7500 }))
            perms[args[1]].authors = roles.map(role => role.id);
            fs.writeFile(path, JSON.stringify(perms), (err) => {
                if (err) return console.log(err);
                return message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`), message.lineReply(
                    new MessageEmbed()
                        .setDescription(`**${args[1]}** yetkisini verebilecek roller ${roles.join(", ")} olarak ayarlandı.`)
                ).then(x => x.delete({ timeout: 7500 }));
            });
            Webhook.send(
                new MessageEmbed()
                    .setDescription(`Ayarlayan: ${message.author}\n**${args[1]}** yetkisini verebilecek roller ${roles.join(", ")} olarak ayarlandı.`)).then(x => x.delete({ timeout: 7500 }));

        }
    } else if (args[0] === "ver") {
        if (!args[1]) return message.lineReply("bir yetki ismi girmelisin.").then(x => x.delete({ timeout: 7500 }));
        if (!perms[args[1]]) if (!args[1]) return message.lineReply("yetki bulunamadı.").then(x => x.delete({ timeout: 7500 }));
        const targetPerm = perms[args[1]];
        if (!message.member.hasPermission("ADMINISTRATOR") && !targetPerm.authors.some(id => message.member.roles.cache.has(id))) return message.lineReply("bu yetkiyi vermek için yetkin yok.").then(x => x.delete({ timeout: 7500 }));
        const targetMember = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
        if (!targetMember) return message.lineReply("bir kullanıcı girmelisin.");
        Webhook.send( new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
        .setColor("GREEN").setTitle("Rol Verildi").setTimestamp()
        .setDescription(`**İşlemi Yapan Üye:** ${message.author} \`${message.author.id}\`)\n\n**İşlem Yapılan Üye:**${targetMember} (\`${targetMember.id}\`)\n\n**Verilen Roller:** ${args[1]} - ${targetPerm.roles.map(x => `${x.name}(${x.id})`).join(",")}`))
        
        message.guild.channels.cache.find(c => c.name === ayar.rollog).send(new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
            .setColor("GREEN").setTitle("Rol Verildi").setTimestamp()
            .setDescription(`**İşlemi Yapan Üye:** ${message.author} \`${message.author.id}\`)\n\n**İşlem Yapılan Üye:**${targetMember} (\`${targetMember.id}\`)\n\n**Verilen Roller:** ${args[1]} - ${targetPerm.roles.map(x => `<@&${x}>`).join(",")}`))
        await targetMember.roles.add(targetPerm.roles).catch(err => {
            return message.lineReply(`❌ Rol vermede bir hata oluştu: **${err.message}**`).then(x => x.delete({ timeout: 7500 }));
        })
        const Data = await RoleData.findOne({ Id: targetMember.id }) || new RoleData({ Id: targetMember.id })
        Data.Logs.push({
            Date: Date.now(),
            Type: "[EKLEME]",
            Executor: message.member.id,
            Role: args[1]
          });
          Data.save()
        await message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`);
    } else if (args[0] === "al") {
        if (!args[1]) return message.lineReply("bir yetki ismi girmelisin.").then(x => x.delete({ timeout: 7500 }));
        if (!perms[args[1]]) if (!args[1]) return message.lineReply("yetki bulunamadı.").then(x => x.delete({ timeout: 7500 }));
        const targetPerm = perms[args[1]];
        if (!message.member.hasPermission("ADMINISTRATOR") && !targetPerm.authors.some(id => message.member.roles.cache.has(id))) return message.lineReply("bu yetkiyi almak için yetkin yok.").then(x => x.delete({ timeout: 7500 }));
        const targetMember = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
        if (!targetMember) return message.lineReply("bir kullanıcı girmelisin.").then(x => x.delete({ timeout: 7500 }));
        Webhook.send(new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("RED").setTitle("Rol Alındı").setTimestamp().setDescription(`**İşlemi Yapan Üye:** ${message.author} \`${message.author.id}\`)\n\n**İşlem Yapılan Üye:**${targetMember} (\`${targetMember.id}\`)\n\n**Alınan Roller:** ${args[1]} - ${targetPerm.roles.map(x => `<@&${x}>`).join(",")}}`))
      
        message.guild.channels.cache.find(c => c.name === ayar.rollog).send(new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
            .setColor("RED").setTitle("Rol Alındı").setTimestamp()
            .setDescription(`**İşlemi Yapan Üye:** ${message.author} \`${message.author.id}\`)\n\n**İşlem Yapılan Üye:**${targetMember} (\`${targetMember.id}\`)\n\n**Alınan Roller:** ${args[1]} - ${targetPerm.roles.map(x => `<@&${x}>`).join(",")}}`))

        await targetMember.roles.remove(targetPerm.roles).catch(err => {
            return message.lineReply(`❌ Rol almada bir hata oluştu: **${err.message}**`).then(x => x.delete({ timeout: 7500 }));
        });
        const Data = await RoleData.findOne({ Id: targetMember.id }) || new RoleData({ Id: targetMember.id })
        Data.Logs.push({
            Date: Date.now(),
            Type: "[KALDIRMA]",
            Executor: message.member.id,
            Role: args[1]
          });
          Data.save()
        await message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`);
    } else if (args[0] === "liste") {
        if (!ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply( "Bunu yapmak için yeterli yetkin bulunmamakta.").then(x => x.delete({ timeout: 7500 }));
        message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`), message.lineReply(new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setDescription(
            `Oluşturulan Yetkiler: ${Object.keys(perms).join(', ')}`))
    } else if (args[0] === "bilgi") {
        if (!ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.lineReply("Bunu yapmak için yeterli yetkin bulunmamakta.").then(x => x.delete({ timeout: 7500 }));
        if (!perms[args[1]]) if (!args[1]) return message.lineReply("Oluşturulmuş bir yetki ismi belirtmelisin. \`.yetki liste\` Yazarak oluşturulan yetkileri görebilirsin.").then(x => x.delete({ timeout: 7500 }));
        const targetPerm = perms[args[1]];
        message.react(`${client.emojis.cache.find(x => x.name === "klowratik")}`), message.lineReply(new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setDescription(
               `**Yetki İsmi:** ${[args[1]]}
                 **Verilen Rollerin Idsi:** ${targetPerm.roles.map(x => `<@&${x}>`).join(",")}
                 **Verebilen Rollerin Idsi:** ${targetPerm.authors.map(x => `<@&${x}>`).join(",")}`

        ))


    } else {
        return message.lineReply("\`oluştur\`,\`liste\`,\`bilgi\` \`düzenle\` veya \`kaldır\` argümanlarını kullanmalısın.").then(x => x.delete({ timeout: 7500 }))
    }

};

module.exports.configuration = {
    name: 'yetki',
    aliases: ["r"],
    usage: 'yetki',
    description: 'yönetim',
    permLevel: 0
};
