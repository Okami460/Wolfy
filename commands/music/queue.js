const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "queue",
  category: "music",
  permissions: ['SEND_MESSAGES'],
  description: "Affiche la liste de music de la playlist !",
  run: async (client, message, args) => {

    try {
      const { channel } = message.member.voice;
      if (!channel)
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTitle(`❌ ERREUR | Vous n'êtes pas dans un salon vocale`)]
        }
        );
      if (!client.distube.getQueue(message))
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTitle(`❌ ERREUR | Je ne joue pas de Musique`)
            .setDescription(`La Playliste est vide`)]
        }
        );
      if (client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTitle(`❌ ERREUR | Veuillez rejoindre mon salon vocale`)
            .setDescription(`Salon: \`${message.guild.me.voice.channel.name}\``)
          ]
        }
        );
      let queue = client.distube.getQueue(message);
      if (!queue)
        return message.channel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTitle(`❌ ERREUR | Je ne joue pas de Musique`)
            .setDescription(`La Playliste est vide`)]
        }
        );

      let currentPage = 0
      const embeds = generateQueueEmbed(queue.songs)
      // `Page Actuelle: ${currentPage+1}/${embeds.length}`
      const queueEmbed = await message.channel.send({ content: `Page Actuelle: ${currentPage + 1}/${embeds.length}`, embeds: [embeds[currentPage]] })
      await queueEmbed.react("⬅️")
      await queueEmbed.react("➡️")
      await queueEmbed.react("❌")

      const filter = (reaction, user) => ["⬅️", "➡️", "❌"].includes(reaction.emoji.name) && (message.author.id === user.id)

      const collector = queueEmbed.createReactionCollector({ filter: filter });

      collector.on("collect", (reaction, user) => {
        reaction.users.remove(message.author);
        if (reaction.emoji.name === "➡️") {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit({ content: `Page Actuelle: ${currentPage + 1}/${embeds.length}`, embeds: [embeds[currentPage]] });
          }
        } else if (reaction.emoji.name === "⬅️") {
          if (currentPage !== 0) {
            --currentPage
            queueEmbed.edit({ content: `Page Actuelle: ${currentPage + 1}/${embeds.length}`, embeds: [embeds[currentPage]] });
          }
        } else {
          collector.stop();
          queueEmbed.delete()
        }
      })
      /*
      let embed = new MessageEmbed()
        .setColor(ee.color)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
        .setTitle(`Playliste du Serveur: ${message.guild.name}`)

      let counter = 0;
      for (let i = 0; i < queue.songs.length; i += 20) {
        if (counter >= 10) break;
        let k = queue.songs;
        let songs = k.slice(i, i + 20);
        message.channel.send(embed.setDescription(songs.map((song, index) => `**${index + 1 + counter * 20}** [${song.name}](${song.url}) - ${song.formattedDuration}`)))
        counter++;
      }
*/



    } catch (e) {
      console.log(String(e.stack))
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
          .setTitle(`❌ ERREUR | Une erreur est survenue`)
          .setDescription(`\`\`\`${e.stack}\`\`\``)]
      }
      );
    }
  }
}

function generateQueueEmbed(queue) {
  const embeds = []
  let k = 10;
  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10
    const info = current.map(track => `${++j}) [\`${String(track.name).replace(/\[/igu, "{").replace(/\]/igu, "}").substr(0, 60)}\`](${track.url}) - \`${track.formattedDuration}\``).join("\n")
    const embed = new MessageEmbed()
      .setDescription(`**[Son actuel: ${queue[0].name}](${queue.url})**\n${info}`)
    embeds.push(embed)
  }
  return embeds;
}