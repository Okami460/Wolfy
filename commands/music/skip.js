const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "skip",
    category: "music",
    permissions: ['SEND_MESSAGES'],
    description: "Permet de skip la music",
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
                );;

                if (client.distube.getQueue(message).songs.length == 1) {

                    message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor("GREEN")
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                            .setTitle("⏭ Il y a plus rien dans la playlist, je quitte le salon vocale")
                        ]
                    }).then(msg => { setTimeout(() => msg.delete()), 3000 })
                    return await client.distube.stop(message)
                } 

            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("GREEN")
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTitle("⏭ Skip la piste actuelle")
                ]
            }).then(msg => { setTimeout(() => { msg.delete() }, 3000) }).catch(e => console.log(e.message))

            await client.distube.skip(message)
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