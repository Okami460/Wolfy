const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "succès",
    category: "fun",
    description: "Affiche un succès mc",
    permissions: ['SEND_MESSAGES'],
    usage: "<text>",
    run: async (client, message, args) => {
        let item = Math.floor((Math.random())*39);
		message.channel.send({files:[{attachment:`https://minecraftskinstealer.com/achievement/${item}/${encodeURI(`Nouveau Succès:/${args.join(" ")}`)}`, name:'file.png'}]});


    }
}