const Discord = require('discord.js');

module.exports = {
    name: "suggest",
    category: "moderation",
    permissions: ['SEND_MESSAGES'],
    usage: "<#salon> <message>",
    description: "Créer une suggestion",

    run: async(client, message, args) => { 

        let channel = message.mentions.channels.first()
        if (!channel) return message.channel.send("Veuiller préciser un salon")

        const suggest = args.slice(1).join(" ")
        if (!suggest) return message.channel.send(" Veuillez préciser votre suggestion")

        

        let embed = new Discord.MessageEmbed()
        .setAuthor("SUGGESTION" + message.author.tag, message.author.avatarURL())
        .setThumbnail(message.author.avatarURL())
        .setColor("GREEN")
        .setDescription(suggest)
        .setTimestamp()
        .setFooter(client.user.username, client.user.displayAvatarURL())

        channel.send({ embeds: [embed]}).then(m => {
            m.react("<a:YesA:1001974253081595904>")
            m.react("<a:No:1001974250950893698>")
        })
    }
}