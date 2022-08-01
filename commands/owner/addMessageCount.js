const { Message } = require("discord.js")
const fs = require("fs")

module.exports = {
name: "addmessagelb",
category: "admin",
permissions: ['SEND_MESSAGES'],

/**
 * 
 * @param {*} client 
 * @param {Message} message 
 * @param {*} args 
 * @returns 
 */
run: async (client, message, args) => {

        const messages = require(`../../messageLeaderboard/${message.guild.id}.json`);
        if (!messages[message.author.id]) {
            messages[message.author.id]= {
                messages: 0,
                ping: message.author.toString()
            }
        }

        messages[message.author.id] = {
            messages: parseFloat(messages[message.author.id].messages) + 1,
            ping: message.author.toString()
        }

        fs.writeFileSync(`./messageLeaderboard/${message.author.id}.json`, JSON.stringify(messages), err  => {
            if (err) {
                console.log(err)
            }
        })

    }
}