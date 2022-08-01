const Discord = require('discord.js');
const { emojify } = require("discord-texts")

module.exports = {
    name: "emojify",
    category: "fun",
    description: "transforme votre texte en emoji",
    permissions: ['SEND_MESSAGES'],
    usage: "<text>",
    run: async (client, message, args) => {

        const text = args.join(" ")

        if (!text) return message.channel.send("Veuillez spécifier un texte")
        message.channel.send(emojify(text))
    }

}