const { MessageEmbed } = require("discord.js");
const fetch = require('node-fetch');

module.exports.execute = async (client, message, args, ayar) => {
  if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "zezeiptal")}`);
  if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
  const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;

  let member = client.users.cache.get(user.id)

  let avatar = member.avatarURL({dynamic: true})

  let uid = member.id


  let response = fetch(`https://discord.com/api/v8/users/${uid}`, {
      method: 'GET',
      headers: {
          Authorization: `Bot ${client.token}`
      }
  })

  let receive = ''
  let banner = 'https://cdn.discordapp.com/attachments/829722741288337428/834016013678673950/banner_invisible.gif'

  response.then(a => {
      if (a.status !== 404) {
          a.json().then(data => {
              receive = data['banner']

              if (receive !== null) {

                  let response2 = fetch(`https://cdn.discordapp.com/banners/${uid}/${receive}.gif`, {
                      method: 'GET',
                      headers: {
                          Authorization: `Bot ${client.token}`
                      }
                  })
                  let statut = ''
                  response2.then(b => {
                      statut = b.status
                      banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.gif?size=1024`
                      if (statut === 415) {
                          banner = `https://cdn.discordapp.com/banners/${uid}/${receive}.png?size=1024`
                      }

                  })
              }
          })
      }
  })

  setTimeout(() => {
      if (!receive) return message.lineReply("Bu kullanıcının banneri bulunamadı!").then(x => x.delete({timeout:15000}))
      message.lineReply(new MessageEmbed().setColor("RANDOM")
      .setAuthor(member.tag, avatar)
      .setDescription(`[Resim Adresi](${banner})`)
      .setImage(banner)).then(x => x.delete({timeout:15000})), message.react(`${client.emojis.cache.find(c => c.name === "klowratik")}`)
  }, 1000)
};
module.exports.configuration = {
  name: "banner",
  aliases: ["arkaplan","wallpaper"],
  usage: "banner",
  description: "kullanıcının bannerini gösterir.",
  permLevel: 0
};