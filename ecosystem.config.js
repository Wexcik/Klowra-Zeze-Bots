
const DatabaseName = "alerusv2"

module.exports = {
    apps: [
    {
        name: `${DatabaseName}-davet`,
        script: "./davet/main.js",
        watch: false
    },
    {
        name: `${DatabaseName}-mod`,
        script: "./Moderasyon/main.js",
        watch: false
    },
    {
        name: `${DatabaseName}-2stat`,
        script: "./stat2/index.js",
        watch: true
    },
    {
        name: `${DatabaseName}-stat`,
        script: "./Stat/main.js",
        watch: false
    },
    {
        name: `${DatabaseName}-level`,
        script: "./level/app.js",
        watch: false
    },
    {
        name: `${DatabaseName}-otomasyon`,
        script: "./Otomasyon/main.js",
        watch: false
    },
    {
        name: `${DatabaseName}-eğlence`,
        script: "./eğlence/main.js",
        watch: false
    },
    {
        name: `${DatabaseName}-select`,
        script: "./selectmenu/main.js",
        watch: false
    },
    {
        name: `${DatabaseName}-context`,
        script: "./contextmenu/main.js",
        watch: false
    }
     ]
};
