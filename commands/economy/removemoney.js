const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'removemoney',
    category: "economy",
    usage: "<user_mention> <nombre a enlever>",
    permissions: ['MANAGE_MESSAGES'],
    description: 'Enlève de l\'argent a un Utilisateur',

    run: async (client, message, args) => {

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas les permissions")

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.reply('A qui vous voulez enlevez de l\'argent ?')

        const money = args[1]
        if (!money) return message.reply('Combien d\'argent voulez vous enlever ?')
        if (isNaN(parseInt(args[1]))) return message.reply(`**${money}** n'est pas un nombre`)

        db.subtract(`money_${user.id}`, money)

        const embed = new MessageEmbed()
            .setAuthor(`${user.user.username} Remove `, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
Remove **$${money}** à <@${user.id}>
        `)
            .addField('Enlever par:-', `<@${message.author.id}>`)
        message.channel.send({ embeds: [embed]})
    }
}