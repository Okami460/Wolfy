const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "loop",
    category: "music",
    permissions: ['SEND_MESSAGES'],
    usage: "<0/1/2>",
    description: "Répéte la Musique ou la Playlist",
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

            if (!args[0])
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor("RED")
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`❌ ERREUR | Vous n’avez pas fourni de méthode Loop`)
                        .setDescription(`Usage: \`${client.config.prefix}loop <0/1/2>\``)
                    ]
                });

            let loopstate = args[0].toString();
            if (loopstate.toLowerCase() === "song") loopstate = "1";
            if (loopstate.toLowerCase() === "queue") loopstate = "2";
            if (loopstate.toLowerCase() === "off") loopstate = "0";
            if (loopstate.toLowerCase() === "track") loopstate = "1";
            if (loopstate.toLowerCase() === "q") loopstate = "2";
            if (loopstate.toLowerCase() === "qu") loopstate = "2";
            if (loopstate.toLowerCase() === "disable") loopstate = "0";


            loopstate = Number(loopstate);
            loopstates = {
                "0": "off",
                "1": "song",
                "2": "queue"
            }


            if( 0 <= loopstate && loopstate <= 2){
                client.distube.getQueue(message).setRepeatMode(parseInt(loopstate));
                message.channel.send({ embeds: [new MessageEmbed()
                  .setColor("RED")
                  .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                  .setTitle(`🔁 Mode Loop changé sur: \`${loopstates[loopstate]}\``)
                ]}).then(msg => { setTimeout(() => { msg.delete() }, 3000) }).catch(e => console.log(e.message))
              }
              else{
                return message.channel.send({ embeds: [new MessageEmbed()
                  .setColor("RED")
                  .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                  .setTitle(`❌ ERREUR | Vous n’avez pas fourni de méthode Loop`)
                  .setDescription(`Usage: \`${client.config.prefix}loop <0/1/2>\``)
                ]});
              }
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