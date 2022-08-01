const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "volume",
    category: "music",
    permissions: ['SEND_MESSAGES'],
    usage: "<nombre entre 0 a 150>",
    description: "Définit le volume du bot",
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

                if(!args[0])
                return message.channel.send({ embeds: [new MessageEmbed()
                  .setColor("RED")
                  .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                  .setTitle(`❌ ERREUR | Vous n’avez pas fourni de méthode Loop`)
                  .setDescription(`Volume actuel: \`${client.distube.getQueue(message).volume}%\`\nUsage: \`${client.config.prefix}volume <0-150>\``)
                ]});
        
              if(!(0 <= Number(args[0]) && Number(args[0]) <= 150))
                return message.channel.send({ embeds: [new MessageEmbed()
                .setColor("RED")
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                  .setTitle(`❌ ERREUR | Volume hors limites`)
                  .setDescription(`Usage: \`${client.config.prefix}volume <0-150>\``)
                ]});



            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("GREEN")
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTitle(`🔊 Volume changé sur: \`${args[0]}%\``)
                ]
            }).then(msg => { setTimeout(() => { msg.delete() }, 3000) }).catch(e => console.log(e.message))


            client.distube.getQueue(message).setVolume(Number(args[0]));
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