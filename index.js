const discord = require("discord.js")
const client = new discord.Client({
  intents: 32767,
  partials: ["MESSAGECreate", "CHANNEL", "REACTION"]
});
const config = require("./botConfig/config.json")
const fs = require("fs")
const { GiveawaysManager } = require("discord-giveaways")

const dotenv = require("dotenv")
dotenv.config()
const axios = require("axios")
const { writeFileSync } = require("fs")
const { adkami } = require("./botConfig/adkami")




/* Import de mongoose*/
const mongoose = require("mongoose");

/*Connection à MongoDB */
mongoose.connect(process.env.MONGODBURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(console.log("Connecté à MongoDB"))


/* Giveaways */
client.giveaways = new GiveawaysManager(client, {
  storage: "./botConfig/giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#d35201",
    reaction: "🎉"
  }
})


/* Collections */
client.queue = new discord.Collection()
client.config = require("./botConfig/config.json")
client.commands = new discord.Collection()
client.events = new discord.Collection()
client.aliases = new discord.Collection()
client.snipes = new discord.Collection()
client.categories = fs.readdirSync("./commands")
client.logger = require("./botConfig/logger");
client.snipes = new Map();

/*Permet de lire dans le fichier handler */
module.exports = client;
["handler", "distube-handler"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
})


require(`./botConfig/2048`)(client)




// const MAX_ERROR_LOGS_SIZE = 5

// function addErrorLog(err) {
//   if (!require("fs").existsSync("botConfig/errorLogs.json")) require("fs").writeFileSync("botConfig/errorLogs.json", JSON.stringify([]));
//   let logs = JSON.parse(require("fs").readFileSync("botConfig/errorLogs.json", "utf-8"));
//   while (logs.length >= MAX_ERROR_LOGS_SIZE) logs.shift();
//   logs.push({
//     date: { __parsed: Date.now(), raw: new Date() },
//     message: err.message,
//     code: err.code,
//     name: err.name,
//     description: err.description || false,
//     origin: err.fileName || false,
//     stack: err.stack.split(/\n/g).filter((ln) => !(/node:internal/).test(ln)).map((l) => {
//       const target = l.trim().replace(/at (?:[^()]+)(.+)?/, "$1").trim();
//       const parsed = ((target || "").match(/:([0-9]+):[0-9]+/))
//       return ({
//         at: l.trim().replace(/at ([^()]+)(.+)?/, "$1").trim(),
//         __rawTarget: target,
//         target: target.replace(/\\{2}/gim, "/").replace(/^\((.+)\)$/, "$1") || false,
//         line: (parsed ? parsed[1] || 0 : 0),
//         column: (parsed ? parsed[2] || 0 : 0),
//         __raw__: l,
//       })
//     }),
//   });


//   try { require("fs").writeFileSync("botConfig/errorLogs.json", JSON.stringify(logs, null, 2)); } catch (_) { };
//   return true;
// }


// client.on('error', error => client.logger.log(error, "error"));
// client.on('warn', info => client.logger.log(info, "warn"));
// process.on('unhandledRejection', error => { addErrorLog(error); client.logger.log("UNHANDLED_REJECTION\n" + error, "error") });
// process.on('uncaughtException', error => {
//   addErrorLog(error);
//   client.logger.log("UNCAUGHT_EXCEPTION\n" + error, "error");
//   client.logger.log("Uncaught Exception is detected, restarting...", "info");
//   process.exit(1);
// });



setTimeout(() => {
  
  adkami(client, axios, discord, fs)
}, 5000)





client.login(process.env.TOKEN)
