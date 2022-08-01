const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: "lb",
    aliases: ["riche"],
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Permet de voir le tableau des riches !",
    run: async (client, message, args) => {
        let money = db.all().filter(data => data.ID.startsWith(`money`)).sort((a, b) => b.data - a.data)
        money.length = 10 // Top 10
        var finalLb = ""
        for (var i in money) {
            finalLb += `**${money.indexOf(money[i]) + 1})** ${client.users.cache.get(money[i].ID.slice(6)).tag} :- \`$${money[i].data.toLocaleString()}\`\n`
        }


        const embed = new MessageEmbed()
            .setAuthor(`Classement Générale`, client.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://www.icone-png.com/png/14/13814.png")
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
${finalLb}
            `)
        message.channel.send({embeds:[embed]})

    }
}