const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const StatsModel = require("../models/Stats.js");
const functions = require("../helpers/functions.js");
const ayar = require(`${__dirname}/../../sunucuAyar.js`)

module.exports = {
    usages: ["yetkidüzenle"],
    async execute({ message, client }) {
        
        if(message.channel.name === ayar.chatKanali && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role)) && !ayar.sahip.some(id => message.author.id === id)) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);
        if(!ayar.sahip.some(id => message.author.id === id) && !ayar.sahipRolu.some(role => message.member.roles.cache.has(role))) return message.react(`${client.emojis.cache.find(x => x.name === "klowraiptal")}`);

        let user = message.mentions.users.first() || client.users.cache.get(args[0])

        // client.api.channels(message.channel.id).messages.post({ data: { 
        //     "content": `Yerleştireceğiniz yetkiyi seçiniz.`,
        //     "components": [
        //       {
        //         "type": 1,
        //         "components": [
        //             {
                      
        //               "type": 3,
        //               "custom_id": "yetki_menu",
        //               "default": false,
        //               "options":[
        //                 {
        //                   "label": config.TASKS[0].NAME,
        //                   "value": "1",
        //                   "description": `${config.TASKS[0].POINT} point`,
        //                 },
        //                 {
        //                   "label": config.TASKS[1].NAME,
        //                   "value": "2",
        //                   "description": `${config.TASKS[1].POINT} point`,
        //                 },
        //                 {
        //                   "label": config.TASKS[2].NAME,
        //                   "value": "3",
        //                   "description": `${config.TASKS[2].POINT} point`,
        //                 },
        //                 {
        //                   "label": config.TASKS[3].NAME,
        //                   "value": "4",
        //                   "description": `${config.TASKS[3].POINT} point`,
        //                 },
        //                 {
        //                   "label": config.TASKS[4].NAME,
        //                   "value": "5",
        //                   "description": `${config.TASKS[4].POINT} point`,
        //                 },
        //                 {
        //                   "label": config.TASKS[5].NAME,
        //                   "value": "6",
        //                   "description": `${config.TASKS[5].POINT} point`,
        //                 },
        //                 {
        //                   "label": config.TASKS[6].NAME,
        //                   "value": "7",
        //                   "description": `${config.TASKS[6].POINT} point`,
        //                 },
        //                 {
        //                   "label": config.TASKS[7].NAME,
        //                   "value": "8",
        //                   "description": `${config.TASKS[7].POINT} point`,
        //                 },
        //                 {
        //                   "label": config.TASKS[8].NAME,
        //                   "value": "9",
        //                   "description": `${config.TASKS[8].POINT} point`,
        //                 },
        //                 {
        //                   "label": config.TASKS[9].NAME,
        //                   "value": "10",
        //                   "description": `${config.TASKS[9].POINT} point`,
        //                 },
        //               ],
        //               "placeholder": "Yetki seç...",
        //               "min_values": 1,
        //               "max_values": 1
        //           },
        //         ]
        //       }
        //     ],
        //     }
        //     })
    }
};
