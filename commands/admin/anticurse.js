const { Database } = require("quickmongo");
const dotenv = require("dotenv")
dotenv.config()
const quickmongo = new Database(process.env.MONGODBURL);
const { Message, Client } = require("discord.js");

module.exports = {
    name: "anticurse",
    category: "admin",
    permissions: ["ADMINISTRATOR"],
    description: "Active ou Désactive la fonction anti-insultes",
    usage: "<enable/disable>",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas les permissions d'Administrateur")
        if (!args[0]) return message.channel.send("Veuillez choisir entre **enable** ou **disable**")

        if (args[0] === "enable") {

            if (await quickmongo.fetch(`swear-${message.guild.id}`) === null) {
                await quickmongo.set(`swear-${message.guild.id}`, true)
                message.channel.send("L'anticurse a bien été activer, les membres ne pourront plus insulter ")

            } else if (await quickmongo.fetch(`swear-${message.guild.id}`) === false) {
                await quickmongo.set(`swear-${message.guild.id}`, true)
                message.channel.send("L'anticurse a bien été activer, les membres ne pourront plus insulter ")
            } else return message.channel.send("L'anticurse est **déjà activé**")
        }

       else if (args[0] === "disable") {
            if (await quickmongo.fetch(`swear-${message.guild.id}`) === true) {
                await quickmongo.delete(`swear-${message.guild.id}`)
                message.channel.send("L'anticurse a bien été désactiver, les membres pourront insulter ")

            } else return message.channel.send("L'anticurse est **déjà désactivé**")
        } else return message.channel.send("Veuillez choisir entre **enable** ou **disable**")
    }
}