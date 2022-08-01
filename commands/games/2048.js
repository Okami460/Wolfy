const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: '2048',
    category: "game",
    permissions: ['SEND_MESSAGES'],
    usage: "<new/continue>",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if (!args.join(" ")) return message.channel.send("Veuillez préciser soit `continue`: pour continuer un partie ou `new` pour commencer une nouvelle game")

        
     }
}

