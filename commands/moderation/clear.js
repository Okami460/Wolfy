const { Discord, Message, Client } = require('discord.js');

module.exports = {
    name: "clear",
    category: "moderation",
    permissions: ['MANAGE_MESSAGES'],
    usage: "<nombre>",
    description: "Supprime un nombre spécifique de message",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async(client, message, args) => {
        if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send("Vous n'avez pas les permissions")

        const deleCount = parseInt(args[0], 10);

        if (!deleCount || deleCount < 2 || deleCount > 100) return message.channel.send("Le nombre de message à supprimer doit être compris entre 2 et 100")

        const fetched = await message.channel.messages.fetch({ limit: deleCount});

        message.channel.bulkDelete(fetched).catch(err => console.log(`impossible de supprimer les messages: ${err}`));
        message.channel.send(`${deleCount} messages ont été supprimé`).then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 3000)
        });

    }
}