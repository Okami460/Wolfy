const discord = require("discord.js")

module.exports = {
    name: "ping",
    aliases: ["p", "checkping"],
    category: "info",
    permissions: ["SEND_MESSAGES"],
    description: "Bot ping !",
    run: async (client, message, args) => {
        
        const msg = await message.channel.send("Ping en cours...");
        const PingEmbed = new discord.MessageEmbed()
            .setTitle("Pong !")
            .setColor("RANDOM")
            .setDescription(`La latence du bot est de: \`${client.ws.ping}\` ms\n La latence de l'api est de: \`${Date.now() - message.createdTimestamp}\` ms`)
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        await message.channel.send({ embeds: [PingEmbed] })
        msg.delete()
    }
}