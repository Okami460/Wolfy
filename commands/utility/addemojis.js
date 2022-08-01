
const { Message, Client, Util} = require("discord.js")

module.exports = {
    name: "addemojis",
    aliases: ["emoji"],
    category: "utility",
    permissions: ["MANAGE_EMOJIS_AND_STICKERS"],
    description: "Ajoute un ou plusieurs emojis animé ou non sur votre serveur!",
    usage: "<emoji> [emoji] [emoji]",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        
        if (!message.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) return message.channel.send("Vous n'avez pas la permissions MANAGE_EMOJIS_AND_STICKERS")
        if (!args.length) return message.channel.send("veuillez inclure un ou plusieurs emojis à ajouter sur votre serveur")

        for (const emojis of args) {
            const getEmojis = Util.parseEmoji(emojis)

            if (getEmojis.id) {
                const emojisExt = getEmojis.animated ? ".gif" : ".png"
                const EmojisURL = `https://cdn.discordapp.com/emojis/${getEmojis.id + emojisExt}`
                message.guild.emojis.create(EmojisURL, getEmojis.name).then(emoji => message.channel.send(`${emoji} (\`${emoji.name}\`) a été ajouté sur le serveur`))
            }
        }
    }
}