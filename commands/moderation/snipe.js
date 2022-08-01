const { Message, Client, MessageEmbed } = require('discord.js');
const moment = require("moment")


module.exports = {
    name: "snipe",
    category: "moderation",
    permissions: ['MANAGE_MESSAGES'],
    description: "Affiche les derniers message supprimés",

    run: async(client, message, args) => {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send("Vous n'avez pas les permissions");

        const snipes = client.snipes.get(message.channel.id);
        if (!snipes) return message.channel.send("Aucun message supprimé dans ce salon")

        const embed = new MessageEmbed()
            .setDescription(`Snipe dans <#${message.channel.id}>\n\nMessage de: <@${snipes.author}> Contenu: ${snipes.content}`)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

        if (snipes.image) embed.setImage(snipes.image)

        return message.channel.send({ embeds: [embed]})
    }
}