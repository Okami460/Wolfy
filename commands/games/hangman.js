const hangman = require("discord-hangman")

module.exports = {
    name: "hangman",
    aliases: ["pendu"],
    category: "game",
    permissions: ['SEND_MESSAGES'],
    description: "permet de jouer au pendu",
    run: async(client, message, args) => {

        const mot = ["discord", "minecraft", "okami", "wolfy"]

        
        await hangman.create(message.channel, 'random', { word: mot[Math.floor(Math.random() * mot.length)], joueurs: message.author})

    } 
}