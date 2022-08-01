const { Discord, Message, Client } = require('discord.js');

module.exports = {
    name: "prune",
    category: "moderation",
    permissions: ['MANAGE_MESSAGES'],
    usage: "<@member> <nombre>",
    description: "Supprime un nombre spécifique de message d'un utilisateur",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async (client, message, args) => {
        if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send("Vous n'avez pas les permissions")

        const mention = message.mentions.members.first()
        const deleCount = parseInt(args[1], 10);

        if (!mention) return message.channel.send("Veuillez mentionner un membre")
        if (!deleCount || deleCount < 2 || deleCount > 100) return message.channel.send("Le nombre de message à supprimer doit être compris entre 2 et 100")

        const messages = [...(await message.channel.messages.fetch()).values()].filter(m => m.author.id === mention.id).slice(0, deleCount)

        message.channel.bulkDelete(messages)

    }
}