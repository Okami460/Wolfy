const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "lyrics",
    aliases: ["parole"],
    category: "music",
    permissions: ['SEND_MESSAGES'],
    description: "Affiche les paroles d'une musique ",
    usage: "<nom_musiquae>",
    run: async (client, message, args) => {
        try {
            title = args.join(" ")
        if(!title) return message.channel.send("Veuillez entrer le titre de la musique")

        const { data } = await axios.get(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(title)}`)

        const embed = new MessageEmbed()
        .setTitle(data.title)
        .setColor("RANDOM")
        .setAuthor(data.author)
        .setDescription(data.lyrics ? data.lyrics : "une erreur est survenue")
        .setTimestamp()
        .setFooter({text: client.user.username, iconURL: client.user.displayAvatarURL()})

        message.channel.send({ embeds: [embed]})
        } catch {
            message.channel.send("Impossible de trouvé les Paroles")
        }
    }
}