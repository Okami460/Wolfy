  
const {
    Client,
    Message,
    MessageEmbed,
    MessageAttachment,
  } = require("discord.js");
  const lyricsFinder = require("lyrics-finder");
  const canvacord = require("canvacord");
  
  module.exports = {
    name: "spotify",
    usage: "<[@membre/nom_membre]>",
    permissions: ['SEND_MESSAGES'],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {    
      if (!args[0]) {
        var user = message.member;
      } else {
        var user =
          message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      }
  
  
  
      let activity =
        user.presence.activities.find((s) =>
          ["PLAYING", "WATCHING", "LISTENING"].includes(s.type)
        ) || false;
  
      
      console.log(user.presence.activities)
      const isSpotify = activity.name == "Spotify" ? true : false;
  
      if (!isSpotify) return message.channel.send("La personne n'écoute pas spotify!");
      const track = {
        img: `https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`,
        url: `https://open.spotify.com/track/${activity.syncID}`,
        name: activity.details,
        author: activity.state,
        album: activity.assets.largeText,
      };
  
      const card = new canvacord.Spotify()
        .setAuthor(track.author)
        .setAlbum(track.album)
        .setStartTimestamp(activity.timestamps.start)
        .setEndTimestamp(activity.timestamps.end)
        .setImage(track.img)
        .setTitle(track.name);
  
      const attachment = await card.build().then((buffer) => {
        canvacord.write(buffer, "botConfig/assets/images/spotify.png");
  
        return new MessageAttachment(buffer, "botConfig/assets/images/spotify.png");
      });
  
      const embed = new MessageEmbed()
        .setAuthor(
          "Spotify Track Info",
          "https://cdn.discordapp.com/emojis/653135129870336031.png?v=1"
        )
        .setColor("GREEN")
        .addFields(
          { name: "Nom", value: track.name, inline: true },
          { name: "Album", value: track.album, inline: true }
        )
        .addFields(
          { name: "Auteur", value: track.author, inline: true },
          {
            name: "Écouter la piste",
            value: `[__Click here__](${track.url})`,
            inline: true,
          }
        )
        .addField("Lyrics: ", "Click sur 🎶", true)
        .addField("⠀", "⠀", true)
        //.setFooter(user.tag, user.displayAvatarURL())
        .setImage("attachment://spotify.png")

        .setTimestamp();
        

  
      message.channel.send({ embeds: [embed], files:  [attachment] }).then((message) => {
        message.react("🎶").then((r) => {
          const lyricsFilter = (reaction, user) => !user.bot && reaction.emoji.name === "🎶";
            

          const lyrics = message.createReactionCollector({ filter : lyricsFilter, 
            time: 60000,
          });
  
          lyrics.on("collect", async (r) => {
            async function removeAll() {
              userReactions = message.reactions.removeAll();
            }
  
            let letra =
              (await lyricsFinder(track.author, track.name)) || "Non trouvé!";
  
            if (letra == "Non trouvé!") {
              removeAll();
              return message.channel.send("Je ne trouve pas les paroles!");
            }
  
            const lyricsEmbed = new MessageEmbed()
              //.setAuthor(`${track.name} | ${track.author}`)
              .setTitle("Lyrics: ")
              .setColor("GREEN")
              .setTimestamp();
              
  
            if (letra.length > 1024) {
              for (i = 0; letra.length > 1024 * (i + 1); i++) {
                lyricsEmbed.addField(
                  "⠀",
                  letra.slice(i * 1024, 1024 * (i + 1)),
                  false
                );
              }
            } else {
              lyricsEmbed.addField("᲼", letra);
            }
            removeAll();
            return message.channel.send({ embeds: [lyricsEmbed]});
          });
        });
      });
    },
  };