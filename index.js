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



/* 2048 game */

const Game = require("./botConfig/Game")
const version = "1.00";




var currentGames = new Map();
var overrideCurrent = new Set();

// emojis
const left = config.left;
const right = config.right;
const up = config.up;
const down = config.down;

const directions = [left, right, up, down];

var edit = config.edit; // edit previous boards or send new ones
var manualcmds = config.disableManualCmds; // allow manual commands (like !left)


client.on("messageCreate", async (message) => {


  if (message.author.bot) {
    return;
  }

  if (message.content.startsWith(client.config.prefix + "2048 new")) {
    if (currentGames.get(message.author.id)) {
      if (!overrideCurrent.has(message.author.id)) {
        overrideCurrent.add(message.author.id);
        message.channel.send("Vous avez déjà une game un cours...!\n"
          + "Tapez à nouveau la commande si vous êtes sûr de vouloir la recommencer,\n"
          + `ou faite ${client.config.prefix}2048 continue pour continuer la partie actuelle`);
        return;
      }
    }

    overrideCurrent.delete(message.author.id);


    currentGames.set(message.author.id, new Game(message.author));
    let g = currentGames.get(message.author.id);
    message.channel.send(g.drawBoard())
      .then(m => {
        g.setMsg(m);
        reactAll(m);
      })
      .catch(console.error);

    return;
  }


  overrideCurrent.delete(message.author.id);



  // ccontinue
  if (message.content.startsWith(client.config.prefix + "2048 continue")) {
    let g = currentGames.get(message.author.id);
    if (g != null) {
      message.channel.send(g.drawBoard())
        .then(m => {
          g.setMsg(m);
          reactAll(m);
        })
        .catch(console.error);
    } else {
      message.channel.send("Pas de game à continuer\n"
        + `Utilisez ${client.config.prefix}2048 new pour créer une partie`);
    }
    return;
  }


  if (manualcmds) {
    return;
  }

  /* mouvement */
  if (message.content.startsWith(client.config.prefix + "left")) {
    var g = currentGames.get(message.author.id);
    if (g != null) {
      tryLeft(g, message.channel);
    }
    return;
  }

  if (message.content.startsWith(client.config.prefix + "right")) {
    var g = currentGames.get(message.author.id);
    if (g != null) {
      tryRight(g, message.channel);
    }
    return;
  }

  if (message.content.startsWith(client.config.prefix + "up")) {
    var g = currentGames.get(message.author.id);
    if (g != null) {
      tryUp(g, message.channel);
    }
    return;
  }

  if (message.content.startsWith(client.config.prefix + "down")) {
    var g = currentGames.get(message.author.id);
    if (g != null) {
      tryDown(g, message.channel);
    }
    return;
  }

});
/* contrôle des réactions */
client.on("messageReactionAdd", (reaction, user) => {

  // si c'est un bot
  if (user.bot) {
    return;
  }

  let g = currentGames.get(user.id);

  if (g) {
    reaction.users.remove(user);
    if (reaction.message.id == g.msg.id) {

      if (directions.includes(reaction.emoji.name)) {

        if (reaction.emoji.name == left) {
          tryLeft(g, reaction.message.channel);
        }

        if (reaction.emoji.name == down) {
          tryDown(g, reaction.message.channel);
        }

        if (reaction.emoji.name == up) {
          tryUp(g, reaction.message.channel);
        }

        if (reaction.emoji.name == right) {
          tryRight(g, reaction.message.channel);
        }

        // essayer d'enlerver les réactions

      }
    }
  }

}); // fin du réaction du client
// 0: left 1: right 2: up 3: down
/* mouvements fonctions */
function tryLeft(g, channel) {
  if (g.possibleNext.includes(0)) {
    g.left();
    handleAfterMovement(g, channel);
  }
  return;
}

function tryRight(g, channel) {
  if (g.possibleNext.includes(1)) {
    g.right();
    handleAfterMovement(g, channel);
  }
  return;
}

function tryUp(g, channel) {
  if (g.possibleNext.includes(2)) {
    g.up();
    handleAfterMovement(g, channel);
  }
  return;
}

function tryDown(g, channel) {
  if (g.possibleNext.includes(3)) {
    g.down();
    handleAfterMovement(g, channel);
  }
  return;
}

function handleAfterMovement(g, channel) {
  if (edit & g.msg.channel == channel) {
    g.msg.edit(g.drawBoard());
  } else {
    channel.send(g.drawBoard())
      .then(m => {
        g.setMsg(m);
        reactAll(m);
      })
      .catch(console.error);
  }

  // vérifie le status du jeu
  if (g.win) {
    channel.send("tu as gagné <@" + g.user.id + ">!");
    currentGames.delete(g.user.id);
  }

  if (g.lose) {
    channel.send("tu as perdu <@" + g.user.id + ">!");
    currentGames.delete(g.user.id);
  }
}

function reactAll(message) {
  try {

    message.react(left)
      .then(x => {
        message.react(down)
          .then(x => {
            message.react(up)
              .then(x => {
                message.react(right)
              });
          });
      });

  } catch (e) {
    console.log("Can't react to messages")
  }
}

const MAX_ERROR_LOGS_SIZE = 5

function addErrorLog(err) {
  if (!require("fs").existsSync("botConfig/errorLogs.json")) require("fs").writeFileSync("botConfig/errorLogs.json", JSON.stringify([]));
  let logs = JSON.parse(require("fs").readFileSync("botConfig/errorLogs.json", "utf-8"));
  while (logs.length >= MAX_ERROR_LOGS_SIZE) logs.shift();
  logs.push({
    date: { __parsed: Date.now(), raw: new Date() },
    message: err.message,
    code: err.code,
    name: err.name,
    description: err.description || false,
    origin: err.fileName || false,
    stack: err.stack.split(/\n/g).filter((ln) => !(/node:internal/).test(ln)).map((l) => {
      const target = l.trim().replace(/at (?:[^()]+)(.+)?/, "$1").trim();
      const parsed = ((target || "").match(/:([0-9]+):[0-9]+/))
      return ({
        at: l.trim().replace(/at ([^()]+)(.+)?/, "$1").trim(),
        __rawTarget: target,
        target: target.replace(/\\{2}/gim, "/").replace(/^\((.+)\)$/, "$1") || false,
        line: (parsed ? parsed[1] || 0 : 0),
        column: (parsed ? parsed[2] || 0 : 0),
        __raw__: l,
      })
    }),
  });


  try { require("fs").writeFileSync("botConfig/errorLogs.json", JSON.stringify(logs, null, 2)); } catch (_) { };
  return true;
}


client.on('error', error => client.logger.log(error, "error"));
client.on('warn', info => client.logger.log(info, "warn"));
process.on('unhandledRejection', error => { addErrorLog(error); client.logger.log("UNHANDLED_REJECTION\n" + error, "error") });
process.on('uncaughtException', error => {
  addErrorLog(error);
  client.logger.log("UNCAUGHT_EXCEPTION\n" + error, "error");
  client.logger.log("Uncaught Exception is detected, restarting...", "info");
  process.exit(1);
});




// (async function () {

//   setInterval(async () => {
    
//     try {
//       let info = await axios.get("https://m.adkami.com/api/main?objet=news&bot=an-hactys")
    
    
//       let urlimage = info.data["episodes"][0]["image"]
//       let urlserie = info.data["episodes"][0]["url"]
//       urlserie = "https://" + urlserie.slice(15, -1)
//       let epname = info.data["episodes"][0]["title"]
//       let epinfo = info.data["episodes"][0]["info"]
//       let kami_back = info.data["episodes"][1]["title"]
//       let kami_back_ep = info.data["episodes"][1]["info"]
//       let kami_back_image = info.data["episodes"][1]["image"]
//       let kami_back_url = info.data["episodes"][0]["url"]
    
    
    
//       const embed = new discord.MessageEmbed()
//         .setTitle(`${epname}`)
//         .setDescription(`${epinfo}\n${urlserie}`)
//         .setAuthor({ name: "team: " + info.data["episodes"][0]["team"], iconURL: "https://m.adkami.com/favicon2.png" })
//         .setImage(urlimage)
//         .setURL(urlserie)
//         .setFooter({ text: "ADKami" })
    
    
//       const anime = require("./botConfig/anime.json")
    
    

//         if (!anime.anime_name.includes(`${epname} ${epinfo}`)) {
//           anime.anime_name.push(`${epname} ${epinfo}`)
    
//           writeFileSync("./botConfig/anime.json", JSON.stringify(anime, null, 4))
//           await client.channels.cache.get("929074477579505667").send({
//             embeds: [embed]
//           })
//         } else return
    
//       } catch (error) {
//         console.log(error)
//       }

//   }, 5000)





// })()






client.login(process.env.TOKEN)
