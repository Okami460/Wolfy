const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "commentaire",
    aliases: ["comment"],
    category: "fun",
    permissions: ['SEND_MESSAGES'],
    description: "Affiche un faux-commentaire",
    usage: "<text>",
    run: async (client, message, args) => {

        let comment = args.join(" ")

        if (!comment) return message.channel.send("Veuillez inclure un commentaire")

        const data = await axios.get(`https://some-random-api.ml/canvas/youtube-comment?avatar=${message.author.displayAvatarURL().replace(".webp", " ")}&comment=${encodeURIComponent(comment)}&username=${encodeURIComponent(message.author.username)}`)

        const embed = new MessageEmbed()
            .setImage(data.request.res.responseUrl)
        message.channel.send({ embeds: [embed]})

    }
}