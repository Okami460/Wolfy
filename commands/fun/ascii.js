const Discord = require("discord.js");
const figlet = require("figlet");

module.exports = {
    name: "ascii",
    category: "fun",
    permissions: ['SEND_MESSAGES'],
    description: "Modifie votre texte en texte ascii",
    usage: "<text>",
    run: async (client, message, args) => {
        figlet.text(args.join(" "), {
            font: "Ghost",
        }, async(err, data) => {
            message.channel.send(`\`\`\`${data}\`\`\``)
        })
    }
};