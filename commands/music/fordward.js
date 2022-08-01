const { MessageEmbed } = require("discord.js");
const { format } = require("../../handlers/function")

module.exports = {
    name: "fordward",
    category: "music",
    permissions: ['SEND_MESSAGES'],
    usage: "<nb>",
    description: "Ajoute un temps de la Musique",
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

                let newQueue = client.distube.getQueue(message);
				let seekNumber = Number(args[0])
				let seektime = newQueue.currentTime + seekNumber;
				if (seektime >= newQueue.songs[0].duration) seektime = newQueue.songs[0].duration - 1;




            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("GREEN")
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTitle(`⏩ Avancé de \`${args[0]} Secondes\``)
                ]
            }).then(msg => { setTimeout(() => { msg.delete() }, 3000) }).catch(e => console.log(e.message))


            newQueue.seek(seektime);
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