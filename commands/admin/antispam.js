const { Client, Message } = require('discord.js');
const db = require("quick.db")

module.exports = {
    name: "antispam",
    description: "active ou désactive l'antispam",
    usage: "<on/off",
    permissions: ['ADMINISTRATOR'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas les permissions")

        if (args[0] === "on") {
            await db.set(`antispam-${message.guild.id}`, true)
            message.channel.send("L'antispam a bien été activé")
        } else if (args[0] === "off") {
            await db.delete(`antispam-${message.guild.id}`)
            message.channel.send("L'antispam a bien été désactivé")
        } else return message.channel.send("Vous devez spécifier soit `on` ou `off`")
    }

}

