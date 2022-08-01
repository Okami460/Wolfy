const { Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "message-lb",
    permissions: ["SEND_MESSAGES"],
    run: async (client, message, args) => {
        const messages = require(`../../messageLeaderboard/${message.guild.id}.json`);

        var messageArray = Object.entries(messages)
        .map(v => `${v[1].messages} - ${v[1].ping}`)
        .sort((a, b) => b.split(" - ")[0] - a.split(" - ")[0]).join("\n")


        const embed = new MessageEmbed()
            .setTitle("Leaderboard")
            .setDescription("message leaderboard")
            .setAuthor(message.member.displayName)
            .setColor("GREEN")
            .addField("Messages", messageArray)
            .setTimestamp()


        message.delete()
        message.channel.send({embeds: [embed]})
    }
}