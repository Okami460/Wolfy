const { MessageEmbed } = require("discord.js");


module.exports = {
    name: "search",
    category: "music",
    permissions: ['SEND_MESSAGES'],
    usage: "<titre>",
    description: "Recherche 10 musiques youtube",
    run: async (client, message, args) => {

        const text = args.join(" ")
        try {

            const { channel } = message.member.voice;
            if (!channel)
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor("RED")
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`❌ ERREUR | Vous n'êtes pas dans un salon vocale`)
                    ]
                });
            if (client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id)
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor("RED")
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`❌ ERREUR | Veuillez rejoindre mon salon vocale`)
                        .setDescription(`Salon: \`${message.guild.me.voice.channel.name}\``)
                    ]
                });
            if (!args[0])
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor("RED")
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`❌ ERREUR | Vous n’avez pas fourni de recherche`)
                        .setDescription(`Usage: \`${client.config.prefix}search <URL / TITLE>\``)
                    ]
                });

            let result = await client.distube.search(args.join(" "));
            let searchresult = "";
            for (let i = 0; i < 10; i++) {
                try {
                    searchresult += `**${i + 1}** [${result[i].name}](${result[i].url}) - ${result[i].formattedDuration}\n`
                } catch {
                    searchresult = "\n";
                }
            }
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("GREEN")
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

                    .setTitle(`Recherche pour : ${args.join(" ")}`.substr(0, 256))
                    .setDescription(searchresult.substr(0, 2048))
                ]
            }).then(msg => {
                msg.channel.awaitMessages({ filter: m => m.author.id === message.author.id,  max: 1, time: 60000, errors: ["time"] }).then(collected => {
                    let userinput = collected.first().content;
                    if (Number(userinput) <= 0 && Number(userinput) > 10) {
                        return message.channel.send("Nombre invalide, veuillez spécifier un nombre entre **1** et **10**")
                    }
                    client.distube.play(message, result[userinput - 1].url);
                }).catch(e => {
                    console.log(String(e.stack))
                    return message.channel.send({
                        embeds: [new MessageEmbed()
                            .setColor("RED")
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                            .setTitle(`❌ ERREUR | Le temps s’est épuisé`)
                            .setDescription(`\`\`\`${e.message}\`\`\``)
                        ]
                    });
                })
            })
        } catch (e) {
            console.log(String(e.stack))
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTitle(`❌ ERREUR | Une erreur est survenue`)
                    .setDescription(`\`\`\`${e.stack}\`\`\``)
                ]
            });
        }
    }
}