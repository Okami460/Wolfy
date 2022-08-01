const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "changemymind",
    category: "fun",
    permissions: ['SEND_MESSAGES'],
    usage: "<text>",
    description: "Changer d’avis !",
    run: async (client, message, args) => {
        let text = args.slice(0).join(" ")
        if (!text) return message.channel.send("changer d’avis sur quoi ?")
        let load = message.channel.send(`Chargement de l'image...`)

        fetch(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`)
        .then(res => res.json())
        .then(data => {
            load

            let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Changer d'Avis`)
            .setImage(data.message)
            .setURL(data.message)
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL())

            message.channel.send({embeds:[embed]})
            message.delete(load)
        })
    }
}