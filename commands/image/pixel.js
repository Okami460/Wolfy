const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "pixel",
    category: "fun",
    description: "Affiche votre pdp pixelisé",
    permissions: ['SEND_MESSAGES'],
    usage: "<[@membre]>",
    run: async (client, message, args) => {

        const user = message.mentions.users.first() || message.author

        const data = await axios.get(`https://some-random-api.ml/canvas/pixelate?avatar=${user.displayAvatarURL().replace('.webp', ' ')}`)
        const embed = new MessageEmbed()
            .setImage(data.request.res.responseUrl)
        message.channel.send({ embeds: [embed]})

    }
}