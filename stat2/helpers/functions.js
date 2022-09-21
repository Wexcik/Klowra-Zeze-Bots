const { Guild } = require("discord.js");
const config = require("../config.json");
const ayar = require(`${__dirname}/../../sunucuAyar.js`);
const tasks = config.SYSTEM.TASKS.sort((a, b) => a.POINT - b.POINT);

module.exports = {
    createBar(client, current, required, total = 8) {
        let percentage = (100 * current) / required;
        percentage = percentage > 100 ? 100 : percentage;

        let str = "";
        const progress = Math.round((percentage / 100) * total);
        str += percentage > 0 ? client.emojis.cache.find(emoji => emoji.name === "klowradolubas").toString() : client.emojis.cache.find(c => c.name === "klowrabosbas").toString();
        str += client.emojis.cache.find(emoji => emoji.name === "klowradolu").toString().repeat(progress);
        str += client.emojis.cache.find(emoji => emoji.name === "klowrabos").toString().repeat(8 - progress);
        str += percentage === 100 ? client.emojis.cache.find(emoji => emoji.name === "klowradoluson").toString() : client.emojis.cache.find(c => c.name === "klowrabosson").toString();

        return str;
    },
    numberToString(ms) {
        if (ms === 0) return undefined;
        const hours = Math.floor(ms / 1000 / 60 / 60);
        const minutes = Math.floor((ms / 1000 / 60 / 60 - hours) * 60);
        const seconds = Math.floor(((ms / 1000 / 60 / 60 - hours) * 60 - minutes) * 60);
        return hours > 0 ? `${hours} saat, ${minutes} dakika` : `${minutes} dakika, ${seconds} saniye`;
    },
    checkStaff(member) {
        let ekipRol = member.guild.roles.cache.get(ayar.enAltYetkiliRolu);
        const yetkiliRol = member.roles.cache.filter(rol => ekipRol.rawPosition <= rol.rawPosition).map(rol => rol.id)
        const StaffRole = member.roles.cache.some(role => yetkiliRol.includes(role.id))
        return member && (StaffRole || member.hasPermission("ADMINISTRATOR"));
    }
};
