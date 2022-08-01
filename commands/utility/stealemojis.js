const { Message, Client } = require("discord.js")

module.exports = {
    name: "stealemoji",
    category: "utility",
    permissions: ["MANAGE_EMOJIS_AND_STICKERS"],
    description: "Ajoute un emojis grâce a une image google",
    usage: "<lien de l'image> <nom de l'emoji>",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        
        if (!message.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) return message.channel.send("Vous n'avez pas la permissions MANAGE_EMOJIS_AND_STICKERS")

        const link = args[0]
        const name = args[1]

        if (!link) return message.channel.send("Veuillez inclure le lien de l'image")
        if (!name) return message.channel.send("Veuillez inclure le nom de l'emoji")

        message.guild.emojis.create(link, name).then(emoji => {
            message.channel.send(`Nouvel emoji créer: \nFormat: ${emoji.toString()}\nNom: ${emoji.name}\nID: ${emoji.id}\nAnime: ${emoji.animated}`)
        }).catch(() => {})
    }
}