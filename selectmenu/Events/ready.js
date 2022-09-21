const { etkinlikrol } = require("../../sunucuAyar");

const ayar = global.sunucuAyar;
const client = global.client;
module.exports = () => {
client.ws.on("INTERACTION_CREATE", async (interaction) => {

  let member = await client.guilds.cache.get(sunucuAyar.sunucuID).members.fetch(interaction.member.user.id);
  let reply;
  
  if (interaction.data.custom_id === "cekilis") {
    if(member.roles.cache.has(ayar.cekilisrol)){
      await member.roles.remove(ayar.cekilisrol)
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: "Çekiliş rolünüz alındı.",
            flags: "64"
          }
        }
      });
    } 
    if(!member.roles.cache.has(ayar.cekilisrol)){
      await member.roles.add(ayar.cekilisrol)
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: "Çekiliş rolünüz verildi.",
            flags: "64"
          }
        }
      });
    } 
  }

  if (interaction.data.custom_id === "etkinlik") {
    if(member.roles.cache.has(ayar.etkinlikrol)){
      await member.roles.remove(ayar.etkinlikrol)
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: "Etkinlik rolünüz alındı.",
            flags: "64"
          }
        }
      });
    } 
    if(!member.roles.cache.has(ayar.etkinlikrol)){
      await member.roles.add(ayar.etkinlikrol)
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: "Etkinlik rolünüz verildi.",
            flags: "64"
          }
        }
      });
    } 
  }

  if (interaction.data.custom_id === "renk_menu") {
    if (!member.roles.cache.has(ayar.boosterRolu)) return client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: "Booster değilsiniz!",
          flags: "64"
        }
      }
    });
    let value = interaction.data.values[0];
    if (value === "mavi") {
      await member.roles.remove(sunucuAyar.renkler)
      reply = "Mavi renginin rolünü aldınız!"
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: reply,
            flags: "64"
          }
        }
      });
     await member.roles.add(sunucuAyar.mavirenk)
    }
    if (value === "yeşil") {
      await member.roles.remove(sunucuAyar.renkler)
      reply = "Yeşil renginin rolünü aldınız!"
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: reply,
            flags: "64"
          }
        }
      });
     await member.roles.add(sunucuAyar.yeşilrenk)
    }
    if (value === "mor") {
      await member.roles.remove(sunucuAyar.renkler)
      reply = "Mor renginin rolünü aldınız!"
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: reply,
            flags: "64"
          }
        }
      });
     await member.roles.add(sunucuAyar.morrenk)
    }
    if (value === "kırmızı") {
      await member.roles.remove(sunucuAyar.renkler)
      reply = "Kırmızı renginin rolünü aldınız!"
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: reply,
            flags: "64"
          }
        }
      });
     await member.roles.add(sunucuAyar.kırmızırenk)
    }
    if (value === "turuncu") {
      await member.roles.remove(sunucuAyar.renkler)
      reply = "Turuncu renginin rolünü aldınız!"
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: reply,
            flags: "64"
          }
        }
      });
     await member.roles.add(sunucuAyar.turuncurenk)
    }
    if (value === "sarı") {
      await member.roles.remove(sunucuAyar.renkler)
      reply = "Sarı renginin rolünü aldınız!"
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: reply,
            flags: "64"
          }
        }
      });
     await member.roles.add(sunucuAyar.sarırenk)
    }
    if (value === "temizle") {
      await member.roles.remove(sunucuAyar.renkler)
      reply = "Renk rolü üzerinizden alındı"
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: reply,
            flags: "64"
          }
        }
      });
    }
  }

if (interaction.data.custom_id === "burc_menu") {
  let value = interaction.data.values[0];
  if (value === "yengec") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Yengeç burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.yengeçrol)
  }

  if (value === "yay") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Yay burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.yayrol)
  }
  
  if (value === "terazi") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Terazi burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.terazirol)
  }
  
  if (value === "oglak") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Oğlak burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.oğlakrol)
  }
  
  if (value === "kova") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Kova burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.kovarol)
  }

  if (value === "koc") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Koç burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.koçrol)
  }

  if (value === "boga") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Boğa burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.boğarol)
  }

  if (value === "ikizler") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "İkizler burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
   await member.roles.add(sunucuAyar.ikizlerrol)
  }

  if (value === "balık") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Balık burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.balıkrol)
  }

  if (value === "aslan") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Aslan burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.aslanrol)
  }

  if (value === "akrep") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Akrep burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.akreprol)
  }

  if (value === "basak") {
    await member.roles.remove(sunucuAyar.burçlar)
    reply = "Başak burç rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.başakrol)
  }

    if (value === "temizle") {
      await member.roles.remove(sunucuAyar.burçlar)
      reply = "Burç rolü üzerinizden alındı."
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: reply,
            flags: "64"
          }
        }
      });
    }
  }

if (interaction.data.custom_id === "iliski_menu") {
  let value = interaction.data.values[0];
  if (value === "lovers") {
    await member.roles.remove(sunucuAyar.ilişkiler)
    reply = "Lovers rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.loversrol)
  }
  
  if (value === "alone") {
    await member.roles.remove(sunucuAyar.ilişkiler)
    reply = "Alone rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.alonerol)
  }
  
  if (value === "lgbt") {
    await member.roles.remove(sunucuAyar.ilişkiler)
    reply = "LGBT rolünü aldınız!"
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          
          content: reply,
          flags: "64"
        }
      }
    });
    await member.roles.add(sunucuAyar.lgbtrol)
  }

  if (value === "temizle") {
    await member.roles.remove(sunucuAyar.ilişkiler)
    reply = "İlişki rolü üzerinizden alındı."
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
  }
}

if (interaction.data.custom_id === "oyun_menu") {

  const seçim = interaction.data.values;

  if (seçim[0] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[0] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[0] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[0] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[0] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[1] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[1] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[1] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[1] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[1] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[2] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[2] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[2] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[2] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[2] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[3] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[3] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[3] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[3] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[4] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[4] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[4] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[4] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[5] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[5] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[5] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[5] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[6] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[6] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[6] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[6] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[7] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[7] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[7] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[7] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[8] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[8] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[8] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[8] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[8] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[9] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[9] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[9] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[9] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[10] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[10] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[10] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[10] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[11] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[11] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[11] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[11] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[12] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[12] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[12] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[12] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[13] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[13] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[13] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[13] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[14] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[14] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[14] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[14] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[15] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[15] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[15] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[15] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[15] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }
    
  if (seçim[16] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[16] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[16] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[16] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[16] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[17] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[17] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[17] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[17] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[18] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[18] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[18] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[18] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[18] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }
    
  if (seçim[19] === "gtav") {
    await member.roles.add(sunucuAyar.gtavrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[19] === "csgo") {
    await member.roles.add(sunucuAyar.csgorol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[19] === "pubg") {
    await member.roles.add(sunucuAyar.pubgrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "lol") {
    await member.roles.add(sunucuAyar.lolrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[19] === "valorant") {
    await member.roles.add(sunucuAyar.valorol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "minecraft") {
    await member.roles.add(sunucuAyar.mcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "fortnite") {
    await member.roles.add(sunucuAyar.fortniterol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "cod") {
    await member.roles.add(sunucuAyar.codrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "ets2") {
    await member.roles.add(sunucuAyar.ets2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "mt2") {
    await member.roles.add(sunucuAyar.mt2rol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "ml") {
    await member.roles.add(sunucuAyar.mlrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "gartic") {
    await member.roles.add(sunucuAyar.garticrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "wr") {
    await member.roles.add(sunucuAyar.wrrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "pubgmob") {
    await member.roles.add(sunucuAyar.pubgmobrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "apex") {
    await member.roles.add(sunucuAyar.apexrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "zula") {
    await member.roles.add(sunucuAyar.zularol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "amongus") {
    await member.roles.add(sunucuAyar.amongusrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "koltuk") {
    await member.roles.add(sunucuAyar.koltukrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "dc") {
    await member.roles.add(sunucuAyar.dcrol)
    reply = "Rolleriniz güncellendi!"
  }

  if (seçim[19] === "vk") {
    await member.roles.add(sunucuAyar.vkrol)
    reply = "Rolleriniz güncellendi!"
  }
  
  if (seçim[0] === "temizle") {
    if (seçim[1] && seçim[2] && seçim[3] && seçim[4] && seçim[5] && seçim[6] && seçim[7] && seçim[8] && seçim[9] && seçim[10] && seçim[11] && seçim[12] && seçim[13] && seçim[14] && seçim[15] && seçim[16] && seçim[17] && seçim[18] && seçim[19]){ reply = "Temizle seçeneği ile rol seçeneklerini aynı anda seçemessiniz. Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"} 
    else {
      await member.roles.remove(sunucuAyar.oyunlar)
      reply = "Rolleriniz temizlendi!"
    }
  }
  
  if (seçim[1] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }

  if (seçim[2] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }

  if (seçim[3] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }

  if (seçim[4] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }

  if (seçim[5] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }

  if (seçim[6] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }

  if (seçim[7] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[8] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[9] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[10] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[11] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[12] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[13] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[14] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[15] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[16] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[17] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[18] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
  if (seçim[19] === "temizle") {
    reply = "Rolleriniz güncellendi! Rollerinizi temizlemek istiyorsanız sadece temizle seçeneğini seçmelisiniz!"
  }
  
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data: {
        type: 4,
        data: {
          content: reply,
          flags: "64"
        }
      }
    });
}

});
// client.api.channels("826721266886246400").messages.post({ data: { 
//   "content": "Buradan görünmek istediğiniz rengi seçebilirsiniz.",
//   "components": [
//     {
//       "type": 1,
//       "components": [
//           {
            
//             "type": 3,
//             "custom_id": "renk_menu",
//             "default": false,
//             "options":[
//               {
//                 "label": "Mavi",
//                 "value": "mavi",
//                 "description": "Bu rengi seçerseniz kullanıcı adınız chat ve üye listesinde mavi gözükecektir.",
//                 "emoji": {
//                   "name": "klowragem", 
//                   "id": "915906447068516353"
//                 }
//               },
//               {
//                 "label": "Yeşil",
//                 "value": "yeşil",
//                 "description": "Bu rengi seçerseniz kullanıcı adınız chat ve üye listesinde yeşil gözükecektir.",
//                 "emoji": {
//                   "name": "klowrakiwi", 
//                   "id": "915906448268095558"
//                 }
//               },
//               {
//                 "label": "Mor",
//                 "value": "mor",
//                 "description": "Bu rengi seçerseniz kullanıcı adınız chat ve üye listesinde mor gözükecektir.",
//                 "emoji": {
//                   "name": "klowraberry", 
//                   "id": "915906448427450398"
//                 }
//               },
//               {
//                 "label": "Kırmızı",
//                 "value": "kırmızı",
//                 "description": "Bu rengi seçerseniz kullanıcı adınız chat ve üye listesinde kırmızı gözükecektir.",
//                 "emoji": {
//                   "name": "klowrakiraz2", 
//                   "id": "915906444958785536"
//                 }
//               },
//               {
//                 "label": "Turuncu",
//                 "value": "turuncu",
//                 "description": "Bu rengi seçerseniz kullanıcı adınız chat ve üye listesinde turuncu gözükecektir.",
//                 "emoji": {
//                   "name": "klowraportakal", 
//                   "id": "915906444057014302"
//                 }
//               },
//               {
//                 "label": "Sarı",
//                 "value": "sarı",
//                 "description": "Bu rengi seçerseniz kullanıcı adınız chat ve üye listesinde sarı gözükecektir.",
//                 "emoji": {
//                   "name": "klowrabanana", 
//                   "id": "923048932119035984"
//                 }
//               },
//               {
//                 "label": "Temizle",
//                 "value": "temizle",
//                 "description": "Bu seçenek üzerinizdeki rolü temizlemenize yarar.",
//                 "emoji": {
//                   "name": "klowratrash", 
//                   "id": "915906447508906005"
//                 }
//               },
//             ],
//             "placeholder": "Renk seç...",
//             "min_values": 1,
//             "max_values": 1
//         },
//       ]
//     }
//   ],
//   }
//   })
// client.api.channels("826721266886246400").messages.post({ data: { 
//   "content": "Buradan burcunuzu seçebilirsiniz.",
//   "components": [
//     {
//       "type": 1,
//       "components": [
//           {
            
//             "type": 3,
//             "custom_id": "burc_menu",
//             "default": false,
//             "options":[
//               {
//                 "label": "Yengeç",
//                 "value": "yengec",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc9", 
//                   "id": "848959492850974754"
//                 }
//               },
//               {
//                 "label": "Yay",
//                 "value": "yay",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc6", 
//                   "id": "848958520488493056"
//                 }
//               },
//               {
//                 "label": "Terazi",
//                 "value": "terazi",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc4", 
//                   "id": "848957779523403816"
//                 }
//               },
//               {
//                 "label": "Oğlak",
//                 "value": "oglak",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc5", 
//                   "id": "848958161280696370"
//                 }
//               },
//               {
//                 "label": "Kova",
//                 "value": "kova",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc1", 
//                   "id": "848925175093526558"
//                 }
//               },
//               {
//                 "label": "Koç",
//                 "value": "koc",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc12", 
//                   "id": "848960960425099315"
//                 }
//               },
//               {
//                 "label": "Boğa",
//                 "value": "boga",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc11", 
//                   "id": "848960542176444486"
//                 }
//               },
//               {
//                 "label": "İkizler",
//                 "value": "ikizler",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc10", 
//                   "id": "848960046024359987"
//                 }
//               },
//               {
//                 "label": "Balık",
//                 "value": "balık",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc3", 
//                   "id": "848957147277951037"
//                 }
//               },
//               {
//                 "label": "Aslan",
//                 "value": "aslan",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc7", 
//                   "id": "848958688450052117"
//                 }
//               },
//               {
//                 "label": "Akrep",
//                 "value": "akrep",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc2", 
//                   "id": "848925353518170153"
//                 }
//               },
//               {
//                 "label": "Başak",
//                 "value": "basak",
//                 "description": "Bu rol sizin burcunuz olarak gözükecektir.",
//                 "emoji": {
//                   "name": "ALERUS_burc8", 
//                   "id": "848959245760331838"
//                 }
//               },
//               {
//                 "label": "Temizle",
//                 "value": "temizle",
//                 "description": "Bu seçenek üzerinizdeki rolü temizlemenize yarar.",
//                 "emoji": {
//                 "name": "klowratrash", 
//                 "id": "915906447508906005"
//                 }
//               },
//             ],
//             "placeholder": "Burç seç...",
//             "min_values": 1,
//             "max_values": 1
//         },
//       ]
//     }
//   ],
//   }
//   })
// client.api.channels("826721266886246400").messages.post({ data: { 
//   "content": "Buradan ilişki durumunuzu seçebilirsiniz.",
//   "components": [
//     {
//       "type": 1,
//       "components": [
//           {
            
//             "type": 3,
//             "custom_id": "iliski_menu",
//             "default": false,
//             "options":[
//               {
//                 "label": "İlişkim var.",
//                 "value": "lovers",
//                 "description": "Bu rol diğer üyelere ilişkinizin olduğunu gösterir.",
//                 "emoji": {
//                   "name": "LOVER", 
//                   "id": "850131934633525278"
//                 }
//               },
//               {
//                 "label": "İlişkim yok.",
//                 "value": "alone",
//                 "description": "Bu rol diğer üyelere ilişkinizin olmadığını gösterir.",
//                 "emoji": {
//                   "name": "ALONE", 
//                   "id": "850132192414793738"
//                 }
//               },
//               {
//                 "label": "LGBT.",
//                 "value": "lgbt",
//                 "description": "Bu rol diğer üyelere lgbt destekçisi olduğunuzu gösterir.",
//                 "emoji": {
//                   "name": "LGBT", 
//                   "id": "850132372513882162"
//                 }
//               },
//               {
//                 "label": "Temizle",
//                 "value": "temizle",
//                 "description": "Bu seçenek üzerinizdeki rolü temizlemenize yarar.",
//                 "emoji": {
//                   "name": "klowratrash", 
//                   "id": "915906447508906005"
//                 }
//               },
//             ],
//             "placeholder": "İlişki rolü seç...",
//             "min_values": 1,
//             "max_values": 1
//         },
//       ]
//     }
//   ],
//   }
//   })
// client.api.channels("826721266886246400").messages.post({ data: { 
//   "content": "Buradan oyun rollerinizi seçebilirsiniz.",
//   "components": [
//     {
//       "type": 1,
//       "components": [
//           {
            
//             "type": 3,
//             "custom_id": "oyun_menu",
//             "default": false,
//             "options":[
//               {
//                 "label": "GTA V",
//                 "value": "gtav",
//                 "description": "Gta 5 oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "OYUN_GTAV", 
//                   "id": "849063482356006923"
//                 }
//               },
//               {
//                 "label": "CS GO",
//                 "value": "csgo",
//                 "description": "Csgo oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "OYUN_CSGO", 
//                   "id": "849062494307876914"
//                 }
//               },
//               {
//                 "label": "PUBG",
//                 "value": "pubg",
//                 "description": "Pubg oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "OYUN_PUBG", 
//                   "id": "849061625734234132"
//                 }
//               },
//               {
//                 "label": "LOL",
//                 "value": "lol",
//                 "description": "Lol oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "OYUN_LOL", 
//                   "id": "849060820012630026"
//                 }
//               },
//               {
//                 "label": "VALORANT",
//                 "value": "valorant",
//                 "description": "Valorant oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "OYUN_VALORANT", 
//                   "id": "849059607959830559"
//                 }
//               },
//               {
//                 "label": "MİNECRAFT",
//                 "value": "minecraft",
//                 "description": "Minecraft oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "OYUN_MC", 
//                   "id": "849056837311660083"
//                 }
//               },
//               {
//                 "label": "FORTNİTE",
//                 "value": "fortnite",
//                 "description": "Fortnite oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "OYUN_FORTNITE", 
//                   "id": "849049998607122452"
//                 }
//               },
//               {
//                 "label": "COD",
//                 "value": "cod",
//                 "description": "Call of duty oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "OYUN_COD", 
//                   "id": "849053064052473906"
//                 }
//               },
//               {
//                 "label": "Doğruluk Cesaretlilik",
//                 "value": "dc",
//                 "description": "Doğruluk cesaretlilik oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowradc", 
//                   "id": "915906445680193546"
//                 }
//               },
//               {
//                 "label": "Euro Truck Simulator 2",
//                 "value": "ets2",
//                 "description": "Euro truck simulator 2 oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowraets2", 
//                   "id": "923055516345839666"
//                 }
//               },
//               {
//                 "label": "Apex Legends",
//                 "value": "apex",
//                 "description": "Apex legends oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowraapex", 
//                   "id": "923053299299659796"
//                 }
//               },
//               {
//                 "label": "Among US",
//                 "value": "amongus",
//                 "description": "Among US oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowraamongus", 
//                   "id": "923053296451719248"
//                 }
//               },
//               {
//                 "label": "Mobile Legends",
//                 "value": "ml",
//                 "description": "Mobile legends oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowraml", 
//                   "id": "923053725231235123"
//                 }
//               },
//               {
//                 "label": "Wild Rift",
//                 "value": "wr",
//                 "description": "Wild Rift oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowrawr", 
//                   "id": "923053299844927578"
//                 }
//               },
//               {
//                 "label": "Vampir Köylü",
//                 "value": "vk",
//                 "description": "Vampir köylü oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowravk", 
//                   "id": "915906444447080449"
//                 }
//               },
//               {
//                 "label": "Kırmızı Koltuk",
//                 "value": "koltuk",
//                 "description": "Kırmızı koltuk oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowrakoltuk", 
//                   "id": "923053296409780234"
//                 }
//               },
//               {
//                 "label": "Pubg Mobile",
//                 "value": "pubgmob",
//                 "description": "Pubg mobile oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowrapubgmob", 
//                   "id": "923053299375165440"
//                 }
//               },
//               {
//                 "label": "Zula",
//                 "value": "zula",
//                 "description": "Zula oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowrazula", 
//                   "id": "923053298087497738"
//                 }
//               },
//               {
//                 "label": "Gartic İO",
//                 "value": "gartic",
//                 "description": "Gartic oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowragartic", 
//                   "id": "923053300700561429"
//                 }
//               },
//               {
//                 "label": "Metin 2",
//                 "value": "mt2",
//                 "description": "Metin 2 oyun rolünü alırsınız.",
//                 "emoji": {
//                   "name": "klowram2", 
//                   "id": "923055310191599696"
//                 }
//               },
//               {
//                 "label": "Temizle",
//                 "value": "temizle",
//                 "description": "Bu seçenek üzerinizdeki rolleri temizlemenize yarar.",
//                 "emoji": {
//                   "name": "klowratrash", 
//                   "id": "915906447508906005"
//                 }
//               },
//             ],
//             "placeholder": "Oyun rollerini seç...",
//             "min_values": 1,
//             "max_values": 20
//         },
//       ]
//     }
//   ],
//   }
//   })
// client.api.channels("826721266886246400").messages.post({ data: { 
//   "content": "Merhaba **Incıdent** üyeleri,\nÖncelikle sunucumuza hoş geldin. Biliyorsun, bu sunucu tamamen senin şansını görüyor <:netflix:869731078879969320>, <a:klowraspotify:923198093275561984>, <a:ict_nitro:869731719291469824>, <:klowraexxen:923198316974587926>, <:klowrablutv:923198488005705748> gibi çeşitli ödüllerin sahibi olabilirsin. Bunun için aşşağıdaki butona tıklayarak **Çekiliş Katılımcısı** rolünü elde edebilirsin,\nEğer \`Ödüllere gerek yok.\` diyorsan sorun yok. \`Ben etkinliklerde bulunmayı seviyorum.\` diyorsan da **Etkinlik Katılımcısı** rolünü alarak etkinliklerimizden haberdar olabilirsin.\n\n__Sende ödüllerden haberdar ve erken yazılma hakkını aşşağıdaki yukarıda belirtildiği gibi \`Çekiliş Katılımcısı\` rolünü alarak uzun soluklu sohbet ortamına giriş yapabilirsin.__",
//   "components": [
//     {
//       "type": 1,
//       "components": [
//           {
//             "type": 2,
//             "style": 3,
//             "custom_id": "cekilis",
//             "label": "Çekiliş Katılımcısı",
//             "emoji": {
//               "name": "klowragift",
//               "id":"915906440537997322",
//             }
//           },
//           {
//             "type": 2,
//             "style": 4,
//             "custom_id": "etkinlik",
//             "label": "Etkinlik Katılımcısı",
//             "emoji": {
//               "name": "klowraconf",
//               "id":"923202974828859432",
//             }
//           },
//       ]
//     }
//   ],
//   }
//   })
}
module.exports.configuration = {
  name: "ready"
}
