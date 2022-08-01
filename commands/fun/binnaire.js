const { Client, Message, MessageEmbed } = require("discord.js"); 
const axios = require("axios");

module.exports = {
    name: "binnaire",
    category: "fun",
    permissions: ['SEND_MESSAGES'],
    description: "Traduis votre message en message Binnaire",
    usage: "<encoder/décoder> <text>",
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send("Veuillez préciser si vous voulez décoder ou encoder")

        const query = args.shift().toLowerCase();

        let word = args.join(" ");

        if (query === "décoder") {
            if (!word) return message.channel.send("Veuillez précisez un mot à traduire")
            const { data } = await axios.get(`https://some-random-api.ml/binary?text=${encodeURIComponent(word)}`)

            try {
                message.channel.send(data.binary)
            } catch (error) {
                message.channel.send("une erreur est survenue")
            }
            
        } else if (query === "encoder") {
            if (!word) return message.channel.send("Veuillez précisez un mot à traduire")
            const { data } = await axios.get(`https://some-random-api.ml/binary?decode=${encodeURIComponent(word)}`)

            try {
                message.channel.send(data.text)
            } catch (error) {
                message.channel.send("une erreur est survenue")
            }
        } else return message.channel.send("L'option choisie est invalide")
    }
}