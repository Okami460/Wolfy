const Discord = require("discord.js");
const ytsr = require("ytsr")

module.exports = {
    name: "ytsearch",
    aliases: ["youtube"],
    category: "recherche",
    permissions: ['SEND_MESSAGES'],
    usage: "<votre_recherche>",
    description: "Faite une recherche youtube",
    run: async (client, message, args) => {
        const query = args.join(" ");
        if (!query) return message.channel.send("veuillez entrer une recherche");

        const res = await ytsr(query).catch(e => {
            return message.channel.send("Aucun résultats")
        });

        const video = res.items.filter(i => i.type === "video")[0];
        if (!video) return message.channel.send("Aucun résultats");

        const embed = new Discord.MessageEmbed()
            .setTitle(video.title)
            .setThumbnail(video.thumbnails[0].url)
            .setColor("RED")
            .setDescription(`**[${video.url}](${video.url})**`)
            .addField("Vues", video.views.toLocaleString(), true)
            .addField("Durée", video.duration, true)
            .addField("Poster le", video.uploadedAt, true)
            .addField("Autheur", video.author.name, true)

        return message.channel.send({ embeds: [embed] })


    }
}