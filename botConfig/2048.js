module.exports = (client) => {


    /* 2048 game */

const Game = require("./Game")
const version = "1.00";
const config = require("./config.json")



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
}