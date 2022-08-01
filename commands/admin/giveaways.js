const { Client, Message, MessageEmbed } = require('discord.js');
const config = require("../../botConfig/config.json")
const ms = require("ms");

module.exports = {
    name: "giveaway",
    category: "admin",
    usage: "<#salon> <temps(s/m/h/d)> <nb_de_gagnants> <prix>",
    description: "Créer un giveaway",
    permissions: ['ADMINISTRATOR'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas les permissions")

        let giveawayChannel = message.mentions.channels.first();
        if (!giveawayChannel) {
            return message.channel.send('Vous n\'avez pas précisé le salon');
        }

        let giveawayDuration = args[1];
        if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
            return message.channel.send('Vous n\'avez pas précisé la durée');
        }

        let giveawayNumberWinners = args[2];
        if (isNaN(giveawayNumberWinners) || (parseInt(giveawayNumberWinners) <= 0)) {
            return message.channel.send('Vous n\'avez pas précisé le nombre de gagant');
        }

        let giveawayPrize = args.slice(3).join(' ');
        if (!giveawayPrize) {
            return message.channel.send('Vous n\'avez pas précisé un prix');
        }


        client.giveaways.start(giveawayChannel, {
            duration: ms(giveawayDuration),
            winnerCount: parseInt(giveawayNumberWinners),
            prize: giveawayPrize,
            hostedBy: `<@${message.author.id}>`
        })

        message.channel.send(`:tada: Fait! Le cadeau pour le \`${giveawayPrize}\` a démarrer dans le salon: ${giveawayChannel}!`);
    }
}