const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "autoplay",
    category: "Music",
    permissions: ['SEND_MESSAGES'],
    description: "Bascule la lecture automatique",
    run: async (client, message, args, cmduser, text, prefix) => {
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
            message.channel.send({ embeds: [new MessageEmbed()
                .setColor("GREEN")
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setTitle(`✅ Lecture automatique avec succès! C’est maintenant sur: ${client.distube.toggleAutoplay(message) ? "`ON`" : "`OFF`"}`)
            ]}).then(msg => setTimeout(() => { msg.delete() }, 3000)).catch(e => console.log(e.message))
        } catch (e) {
            console.log(String(e.stack).bgRed)
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