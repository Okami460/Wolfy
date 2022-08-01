const discord = require("discord.js");

module.exports = {
    name: "rps",
    category: "game",
    aliases: ["pfs"],
    permissions: ['SEND_MESSAGES'],
    description: "permet de jouer au jeu du pierre feuille cisceaux contre le bot !",
    run: async (client, message, args) => {

        let botPicks;
        let botEmoji;
        let botChoose;
        let playerScore = 0;
        let botScore = 0;
        let rock = "✊ Pierre";
        let paper = "✋ Feuille";
        let cissor = "✌️ cisceaux";

        let rockButton = new discord.MessageButton().setCustomId("rock").setStyle("SUCCESS").setEmoji("✊").setLabel("Pierre")
        let paperButton = new discord.MessageButton().setCustomId("paper").setStyle("SUCCESS").setEmoji("✋").setLabel("Feuille")
        let cissorButton = new discord.MessageButton().setCustomId("cissor").setStyle("SUCCESS").setEmoji("✌️").setLabel("Cisceaux")
        let row = new discord.MessageActionRow().addComponents([rockButton, paperButton, cissorButton]);


        let embed = new discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription("Gagnant: **-**")
            .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)

        message.channel.send({ embeds: [embed],  components: [row] }).then((msg) => {
            const filter = (buttons) => buttons.isButton() && buttons.user && buttons.message.author.id === client.user.id
            const collector = msg.createMessageComponentCollector({filter: filter,  time: 120000 })

            collector.on("collect", async (button) => {
                button.deferUpdate();

                botPicks = Math.floor(Math.random() * 3) + 1;

                if (botPicks === 1) {
                    botChoose = "rock";
                }

                if (botPicks === 2) {
                    botChoose = "paper";
                }

                if (botPicks === 3) {
                    botChoose = "cissor";
                }

                let embed1 = new discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription("Gagnant: **-**")
                    .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)


                //pierre
                if (button.customId === "rock") {
                    botPicks = Math.floor(Math.random() * 3) + 1;

                    if (botChoose === "paper") {
                        botScore++;

                        let embed2 = new discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setDescription("Gagnant: **-**")
                            .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)
                        return msg.edit({ content: `J'ai choisi **${paper}**\nVous avez choisi **${rock}**\n**Résultat**: Vous perdez`, embeds: [embed2], components: [row] })
                    }

                    if (botChoose === "rock") {
                        return msg.edit({ content: `J'ai choisi **${rock}**\nVous avez choisi **${rock}**\n**Résultat**: Egalité`, embeds: [embed1], components: [row] })
                    }

                    if (botChoose === "cissor") {
                        playerScore++;

                        let embed2 = new discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setDescription("Gagnant: **-**")
                            .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)
                        return msg.edit({ content: `J'ai choisi **${cissor}**\nVous avez choisi **${rock}**\n**Résultat**: Vous gagnez`, embeds: [embed2], components: [row] })
                    }
                }


                //feuille
                if (button.customId === "paper") {
                    botPicks = Math.floor(Math.random() * 3) + 1;

                    if (botChoose === "cissor") {
                        botScore++;

                        let embed2 = new discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setDescription("Gagnant: **-**")
                            .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)
                        return msg.edit({ content: `J'ai choisi **${cissor}**\nVous avez choisi **${paper}**\n**Résultat**: Vous perdez`, embeds: [embed2], components: [row] })
                    }

                    if (botChoose === "paper") {
                        return msg.edit({ content: `J'ai choisi **${paper}**\nVous avez choisi **${paper}**\n**Résultat**: Egalité`, embeds: [embed1], components: [row] })
                    }

                    if (botChoose === "rock") {
                        playerScore++;

                        let embed2 = new discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setDescription("Gagnant: **-**")
                            .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)
                        return msg.edit({ content: `J'ai choisi **${rock}**\nVous avez choisi **${paper}**\n**Résultat**: Vous gagnez`, embeds: [embed2], components: [row] })
                    }
                }


                //cisceaux
                if (button.customId === "cissor") {
                    botPicks = Math.floor(Math.random() * 3) + 1;

                    if (botChoose === "rock") {
                        botScore++;

                        let embed2 = new discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setDescription("Gagnant: **-**")
                            .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)
                        return msg.edit({ content: `J'ai choisi **${rock}**\nVous avez choisi **${cissor}**\n**Résultat**: Vous perdez`, embeds: [embed2], components: [row] })
                    }

                    if (botChoose === "cissor") {
                        return msg.edit({ content: `J'ai choisi **${cissor}**\nVous avez choisi **${cissor}**\n**Résultat**: Egalité`,embeds: [embed2], components: [row] })
                    }

                    if (botChoose === "paper") {
                        playerScore++;

                        let embed2 = new discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setDescription("Gagnant: **-**")
                            .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)
                        return msg.edit({ content: `J'ai choisi **${paper}**\nVous avez choisi **${cissor}**\n**Résultat**: Vous gagnez`, embeds: [embed2], components: [row] })
                    }
                }
            })

            collector.on("end", async(x) => {
                if (x.size === 0) {
                    msg.edit(`personne ne veut VS avec moi`, null)
                } else if (x.size > 0) {
                    if (playerScore === botScore) {
                        let embed2 = new discord.MessageEmbed()
                            .setColor("BLACK")
                            .setDescription("Gagnant: Egalité")
                            .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)
                        msg.edit({ embeds: [embed2] })

                    } else if (playerScore > botScore) {
                        let embed2 = new discord.MessageEmbed()
                            .setColor("GREEN")
                            .setDescription(`Gagnant: ${message.author}`)
                            .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)
                        msg.edit({ embeds: [embed2] })
                        
                    } else if (playerScore < botScore) {
                        let embed2 = new discord.MessageEmbed()
                            .setColor("RED")
                            .setDescription(`Gagnant: ${client.user}`)
                            .addField(`Score PFC`, `\`->\` ${message.author}: **${playerScore} Points**\n\`->\` ${client.user}: **${botScore} Points**`)
                        msg.edit({ embeds: [embed2] })
                    }
                }
            })
        })
    }
}