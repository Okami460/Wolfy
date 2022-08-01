const afk = require("../../models/afk")
const discord = require("discord.js")
const { Message, Client } = require("discord.js")

module.exports = {
    name: "afk",
    category: "utility",
    permissions: ["SEND_MESSAGES"],
    description: "Définit votre status en AFK",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        const oldNickname = message.member.nickname || message.author.username;
        const nickname = `[AFK] ${oldNickname}`
        const user = message.mentions.users.first()
        if (user) return message.channel.send("Veuillez ne pas mentionner un membre")
        let everyoneping = (args.indexOf("@everyone") >-1 )
        if (everyoneping === true) return message.channel.send("Veuillez ne pas utilier le ping everyone")
        if (args.length > 100) {
            message.channel.send("Raison trop longue")
        }

        const content = args.join(" ") || "AFK"

        const afklist = await afk.findOne({ userID: message.author.id })

        await message.member.setNickname(nickname).catch((e) => { message.channel.send("Une erreur est survenue"); console.log(e)})

        if (!afklist) {
            const newafk = new afk({
                userID: message.author.id,
                serverID: message.guild.id,
                reason: content,
                oldNickname: oldNickname,
                time: new Date()
            })

            const embed = new discord.MessageEmbed()
                .setDescription(`Vous avez été défini comme AFK\n**Raison: ${content}**`)
                .setColor("GREEN")
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic : true })})
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            newafk.save().catch((err) => console.log(err))
        }

    }
}