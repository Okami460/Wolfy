  
const { Client, Message, MessageEmbed } = require("discord.js");
const watchlists = require("../../models/watchlist");
const getUser = require("../../botConfig/getUser").getUser;

module.exports = {
  name: "watchlist",
  permissions: ['SEND_MESSAGES'],
  cooldown: 1,
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    const user = await getUser(client, message, args);
    if (user == undefined) return message.channel.send("Je ne trouve pas cet utilisateur!");
    
    let data = await watchlists.findOne({
      userID: user.id,
    });

    if (!data)
      return message.channel.send(
        user.id == message.author.id
          ? `Vous n’avez pas de liste d'anime a regarder, taper \`${client.config.prefix}cwl\``
          : "Cet utilidateur n'a pas de liste"
      );

    let watching = data.watching;

    for (i = 0; i < watching.length; i++) {
      watching[i] = `➥ ${watching[i]}`;
    }

    let toWatch = data.toWatch;

    for (i = 0; i < toWatch.length; i++) {
      toWatch[i] = `➥ ${toWatch[i]}`;
    }

    let completed = data.completed;

    for (i = 0; i < completed.length; i++) {
      completed[i] = `➥ ${completed[i]}`;
    }

    let onHold = data.onHold;

    for (i = 0; i < onHold.length; i++) {
      onHold[i] = `➥ ${onHold[i]}`;
    }

    let dropped = data.dropped;

    for (i = 0; i < dropped.length; i++) {
      dropped[i] = `➥ ${dropped[i]}`;
    }

    const embed = new MessageEmbed()
      .setTitle(`${data.nickname} Watch List`)
      .setColor("BLUE")
      .setImage(
        "https://i.pinimg.com/originals/1d/f1/2f/1df12fc81d34d2592196cc86210f1998.gif"
      )
      .setTimestamp();

    if (watching.length > 0) {
      if (watching.join("\n").length > 1024) {
        for (i = 0; watching.join("\n").length > 1024 * (i + 1); i++) {
          embed.addField(
            i == 0 ? "👀 Attentif:" : "⠀",
            watching.join("\n").slice(i * 1024, 1024 * (i + 1)),
            false
          );
        }
      } else {
        embed.addField("👀 Attentif:", watching.join("\n"), false);
      }
    } else {
      embed.addField("👀 Attentif:", "0 Animes ❌", false);
    }

    if (dropped.length > 0) {
      if (dropped.join("\n").length > 1024) {
        for (i = 0; dropped.join("\n").length > 1024 * (i + 1); i++) {
          embed.addField(
            i == 0 ? "🚮 tomber:" : "⠀",
            dropped.join("\n").slice(i * 1024, 1024 * (i + 1)),
            false
          );
        }
      } else {
        embed.addFields({
          name: "🚮 tomber:",
          value: dropped.join("\n"),
        });
      }
    } else {
      embed.addField("🚮 tomber:", "0 Animes ❌", false);
    }

    if (onHold.length > 0) {
      if (onHold.join("\n").length > 1024) {
        for (i = 0; onHold.join("\n").length > 1024 * (i + 1); i++) {
          embed.addField(
            i == 0 ? "🙄 En attente:" : "⠀",
            onHold.join("\n").slice(i * 1024, 1024 * (i + 1)),
            false
          );
        }
      } else {
        embed.addFields({
          name: "🙄 En attente:",
          value: onHold.join("\n"),
        });
      }
    } else {
      embed.addField("🙄 En attente:", "0 Animes ❌", false);
    }

    if (toWatch.length > 0) {
      if (toWatch.join("\n").length > 1024) {
        for (i = 0; toWatch.join("\n").length > 1024 * (i + 1); i++) {
          embed.addField(
            i == 0 ? "📚 Regarder:" : "⠀",
            toWatch.join("\n").slice(i * 1024, 1024 * (i + 1)),
            false
          );
        }
      } else {
        embed.addFields({
          name: "📚 Regarder:",
          value: toWatch.join("\n"),
        });
      }
    } else {
      embed.addField("📚 Regarder:", "0 Animes ❌", false);
    }

    if (completed.length > 0) {
      if (completed.join("\n").length > 1024) {
        for (i = 0; completed.join("\n").length > 1024 * (i + 1); i++) {
          embed.addField(
            i == 0 ? "✅ Completé:" : "⠀",
            completed.join("\n").slice(i * 1024, 1024 * (i + 1)),
            false
          );
        }
      } else {
        embed.addField("✅ Completé:", completed.join("\n"), false);
      }
    } else {
      embed.addField("✅ Completé:", "0 Animes ❌", false);
    }

    message.channel.send({ embeds: [embed]});
  },
};