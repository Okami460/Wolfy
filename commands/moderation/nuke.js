const { Message } = require("discord.js");

module.exports = {
    name: "nuke",
    permissions: ["MANAGE_CHANNELS"],
    description: "Permet de supprimer tout les messages d'un salon",
    category: "moderation",
    /**
     * 
     * @param {*} client 
     * @param {Message} message 
     * @param {*} args 
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MANAGE_CHANNELS")) return;
        if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) return message.channel.send("je n'ai pas les permissions")

        message.channel.clone().then((ch) => {
            ch.setParent(message.channel.parentID)
            ch.setPosition(message.channel.position)
            message.channel.delete()

            ch.send("le channel a bien été nuke !")
        })
    }
}