const TTT = require("discord-tictactoe")

module.exports = {
    name: "morpion",
    aliases: ["ttt", "tictactoe"],
    category: "games",
    permissions: ["SEND_MESSAGES"],
    description: "Permet de jouer au morpion",
    run: async (client, message, args) => {
        
        new TTT({ language: "fr"}).handleMessage(message)
 
    }
}