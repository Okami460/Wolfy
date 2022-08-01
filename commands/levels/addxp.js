const Discord = require("discord.js");
const Levels = require('discord-xp');


module.exports = {
    name: "addxp",
    category: "levels",
    permissions: ['MANAGE_MESSAGES'],
    description: "Ajoute de l'xp!",
    usage: "<@member> <nombre_exp>",
    run: async (client, message, args) => {
        const target = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(" ").toLowerCase()) || message.member
        const level = await Levels.fetch(target.id, message.guild.id, true);
        const XPneeded = level * 2 * 250 + 250 // Level 1 = 250, Level 2 = 750, Level 3 = 1750, Level 4.....

        const addxp = args[1]

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas les permissions d'administrateur")
        else if (!addxp) return message.reply(`Combien d'xp veut tu te give ?`) 
        else if (isNaN(parseInt(args[1]))) return message.reply('XP n\'est pas un nombre') 
        else if (addxp > XPneeded) return message.reply(`Vous ne pouvez pas ajouter autant`)
        else {
            Levels.appendXp(target.id, message.guild.id, addxp)
            message.channel.send(`Ajout de **${addxp}** xp a ${target.user.username}`)
        }
    }
}