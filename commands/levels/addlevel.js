const Discord = require("discord.js");
const Levels = require('discord-xp');


module.exports = {
    name: "addlevel",
    category: "levels",
    permissions: ['MANAGE_MESSAGES'],
    description: "Ajoute de l'xp!",
    usage: "<@member> <nombre_level>",
    run: async (client, message, args) => {
        const target = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(" ").toLowerCase()) || message.member

        const addlevel = args[1]

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas les permissions d'administrateur")
        if (!addlevel) return message.reply(`Combien de level veut tu te give ?`) 
        else if (isNaN(parseInt(args[1]))) return message.reply('XP n\'est pas un nombre') 
        else {
            Levels.appendLevel(target.id, message.guild.id, addlevel)
            message.channel.send(`Ajout de **${addlevel}** level a ${target.user.username}`)
        }
    }
}