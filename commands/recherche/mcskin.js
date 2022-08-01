const Discord = require("discord.js");
const fetch = require("node-fetch");
const mcapi = require("mcapi");

module.exports = {
    name: "mcskin",
    aliases: ["skin"],
    category: "recherche",
    permissions: ['SEND_MESSAGES'],
    usage: "<nom_du_joueur_minecraft>",
    description: "recherche le skin minecraft d'un joueur !",
    run: async (client, message, args) => {
        try {
            let uuid = await mcapi.usernameToUUID(`${args.join(" ")}`)
            let embed = new Discord.MessageEmbed()
                .setTitle(`Skin du joueur ${args.join(" ")}`)
                .addField("Nom", `${args.join(" ")}`)
                .addField("UUID", uuid)
                .addField("Download", `[Download](https://minotar.net/download/${args.join(" ")})`)
                .addField("NomMc", `[Click moi](https://mine.ly/${args.join(" ")}.1)`)
                .setImage(`https://minecraftskinstealer.com/api/v1/skin/render/fullbody/${args.join(" ")}/700`)
                .setColor("RANDOM")
                .setThumbnail(`https://minotar.net/cube/${args.join(" ")}/100.png`)
            message.channel.send({ embeds: [embed] })
        } catch (e) {
            message.channel.send("Skin non trouvé")
        }
    }
}