const { MessageEmbed } = require("discord.js");



module.exports = {
    name: "play",
    category: "music",
    permissions: ['SEND_MESSAGES'],
    usage: "<url/ titre>",
    description: "Permet de jouer de la music de Youtube ou de Spotify",
    run: async (client, message, args) => {

      const text = args.join(" ")
        try{
            const { channel } = message.member.voice;
            if(!channel)
              return message.channel.send({ embeds: [new MessageEmbed()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setTitle(`❌ ERREUR | Vous n'êtes pas dans un salon vocale`)
              ]});
              
            if(client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
              return message.channel.send({ embeds: [new MessageEmbed()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setTitle(`❌ ERREUR | Veuillez rejoindre mon salon vocale`)
                .setDescription(`Salon: \`${message.guild.me.voice.channel.name}\``)
              ]});
            if(!args[0])
              return message.channel.send({ embeds: [new MessageEmbed()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setTitle(`❌ ERREUR | Vous n’avez pas fourni de recherche`)
                .setDescription(`Usage: \`${client.config.prefix}play <URL / TITLE>\``)
              ]});
            message.channel.send({ embeds: [new MessageEmbed()
              .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
              .setTitle("Recherche..")
              .setDescription(`\`\`\`fix\n${text}\n\`\`\``)
            ]}).then(msg=> { setTimeout(() => { msg.delete() }, 3000 )}).catch(e=>console.log(e.message))

               client.distube.play(message, text);
             
          } catch (e) {
              console.log(String(e.stack).bgRed)
              return message.channel.send({ embeds: [new MessageEmbed()
                  .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                  .setTitle(`❌ ERREUR | Une erreur est survenue`)
                  .setDescription(`\`\`\`${e.stack}\`\`\``)
              ]});
          }
    }
}