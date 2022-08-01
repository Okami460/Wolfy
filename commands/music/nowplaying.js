const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "nowplaying",
    aliases: ["np", "now-playing"],
    category: "music",
    permissions: ['SEND_MESSAGES'],
    description: "Affiche la description de la musique que vous écouter actuellement",
    run: async (client, message, args) => {

        try{
            const { channel } = message.member.voice; // { message: { member: { voice: { channel: { name: "Allgemein", members: [{user: {"username"}, {user: {"username"}] }}}}}
            if(!channel)
            return message.channel.send({ embeds: [new MessageEmbed()
                .setColor("RED")
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
                .setTitle(`❌ ERREUR | Vous n'êtes pas dans un salon vocale`)]}
            );
            if(!client.distube.getQueue(message))
            return message.channel.send({ embeds: [new MessageEmbed()
                .setColor("RED")
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
                .setTitle(`❌ ERREUR | Je ne joue pas de Musique`)
                .setDescription(`La Playliste est vide`)]}
            );
            if(client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
            return message.channel.send({ embeds: [new MessageEmbed()
                .setColor("RED")
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
                .setTitle(`❌ ERREUR | Veuillez rejoindre mon salon vocale`)
                .setDescription(`Salon: \`${message.guild.me.voice.channel.name}\``)
            ]}
            );
            let queue = client.distube.getQueue(message);
            if (!queue)
              return message.channel.send({ embeds: [new MessageEmbed()
                  .setColor("RED")
                  .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
                  .setTitle(`❌ ERREUR | Je ne joue pas de Musique`)
                  .setDescription(`La Playliste est vide`)]}
              );
             

            let track = queue.songs[0];
            let time = track.duration * 1000
            let currenttime = queue.currentTime
            const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 10)
            const remaining = (time - currenttime) < 0 ? "◉ LIVE" : time - currenttime

            message.channel.send({ embeds: [new MessageEmbed()
              .setColor("GREEN")
              .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
              .setTitle(`Ecoute.. :notes: ${track.name}`.substr(0, 256))
              .setURL(track.url)
              .setThumbnail(track.thumbnail)
              .addField("Vues", `▶ ${track.views}`,true)
              .addField("Dislikes", `:thumbsdown: ${track.dislikes}`,true)
              .addField("Likes", `:thumbsup: ${track.likes}`,true)
              .addField("Durée: ", `${queue.paused === true ? ":pause_button:" : ":arrow_forward:"} ${'▬'.repeat(part) + "🔶" + '▬'.repeat(10 - part)} [${queue.formattedCurrentTime}/${track.formattedDuration}]`)
            ]}).then(msg=>{ setTimeout(() => { msg.delete()}, 5000) }).catch(e=>console.log(e.message))
          } catch (e) {
            console.log(String(e.stack))
            return message.channel.send({ embeds: [new MessageEmbed()
              .setColor("RED")
              .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
              .setTitle(`❌ ERREUR | Une erreur est survenue`)
              .setDescription(`\`\`\`${e.stack}\`\`\``)]}
            );
          }

    }
}