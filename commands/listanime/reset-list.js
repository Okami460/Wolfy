const { Client, Message, MessageEmbed } = require('discord.js');
const watchlists = require("../../models/watchlist");

module.exports = {
    name: 'reset-list',
    permissions: ['SEND_MESSAGES'],
    cooldown: 2,
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let data = await watchlists.findOne({
            userID: message.author.id,
        });

        data.watching = [];
        data.completed = [];
        data.onHold = [];
        data.dropped = [];
        data.toWatch = [];

        data.save();

        message.channel.send("La liste d'anime à regarder a été reset");
      
    }
}