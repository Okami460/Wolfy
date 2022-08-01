const { Client, Message, MessageEmbed } = require('discord.js');
const watchlists = require("../../models/watchlist");

module.exports = {
    name: 'cwl',
    permissions: ['SEND_MESSAGES'],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let data = await watchlists.findOne({
            userID: message.author.id,
        });
        if(data) return message.channel.send("Vous avez déjà créer une liste d'anime à regarder");

        const newWatchList = new watchlists({
            userID: message.author.id,
            nickname: message.author.username,
            watching: [],
            completed: [],
            onHold: [],
            dropped: [],
            toWatch: [],
        })

        newWatchList.save().catch((err) => console.log(err));

        return message.channel.send("votre liste d'anime est créer")
    }
}