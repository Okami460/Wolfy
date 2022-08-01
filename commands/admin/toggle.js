const { Client, Message, MessageEmbed, MessageAttachment } = require('discord.js');
const db = require("quick.db")

module.exports = {
    name: "toggle",
    description: "active ou désactive une commande",
    usage: "<on/off> <cmd_name>",
    permissions: ['ADMINISTRATOR'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas les permissions")

        function cmdName(x) {
            let a = false
            client.commands.forEach(y => {
                if (y.name === x) a = y.name
            });
            return a


        }

        if (!args[1])  return message.channel.send("Vous devez spécifier une commande valide")
        if (args[1] === "toggle") return message.channel.send("Impossible de désactiver cette commande")

        if (args[0] === "on") {
            if (!await cmdName(args[1])) return message.channel.send("Commande non trouvé")
            let commandFetch = db.fetch(`commandToggle_${message.guild.id}`)
            if (commandFetch == null) commandFetch = [] 
            if (!commandFetch.includes(await cmdName(args[1]))) return message.channel.send("Cette commande est déjà en `on`")
            const Filtered = commandFetch.filter(x => x !== args[1])
            db.set(`commandToggle_${message.guild.id}`, Filtered)
            return message.channel.send("La commande a bien été activer") 

        } else if (args[0] === "off") {
            if (!await cmdName(args[1])) return message.channel.send("Commande non trouvé")
            let commandFetch = db.fetch(`commandToggle_${message.guild.id}`)
            if (commandFetch == null) commandFetch = [] 
            if (commandFetch.includes(await cmdName(args[1]))) return message.channel.send("Cette commande est déjà `off`")
            db.push(`commandToggle_${message.guild.id}`, cmdName(args[1]))
                        return message.channel.send("La commande a bien été désactiver") 

        } else return message.channel.send("Vous devez spécifier soit `on` ou `off`")
    }

}

