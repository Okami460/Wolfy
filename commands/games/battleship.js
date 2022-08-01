const { Client, Message, MessageEmbed } = require('discord.js');

const  { DiscordBattleShip }  = require("../../botConfig/assets/battle-ship");

module.exports = {
    name: 'battleship',
    category: "game",
    permissions: ['SEND_MESSAGES'],
    usage: "<@membre>",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        prefix = "w!"
        let user = message.mentions.members.first();
        if (!user || user.id === message.member.id || user.user.bot)
          return message.channel.send(
            "Veuillez mentionner votre adversaire"
          );

        const BattleShip = new DiscordBattleShip({
          prefix: client.config.prefix,
          embedColor: "GREEN"
        })
        
        await BattleShip.createGame(message);
    }
}