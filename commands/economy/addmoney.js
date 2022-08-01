const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'addmoney',
    category: "economy",
    permissions: ['MANAGE_MESSAGES'],
    usage: "<user_mention> <nombre a give>",
    description: 'Ajoute de l\'argent a un Utilisateur',

    run : async (client, message, args) => {

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("Vous n'avez pas les permissions")

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return message.channel.send('Qui vous voulez ajouter de l’argent?')
         
        const money = args[1]
        if(!money) return message.channel.send('Combien de d\'argent voulez vous give?')
        if(isNaN(parseInt(args[1]))) return message.channel.send(`**${money}** n'est pas un nombre`)

        db.add(`money_${user.id}`, money)

        const embed = new MessageEmbed()
        .setAuthor(`${user.user.username}`, user.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor('RANDOM')
        .setDescription(`
Ajout de **$${money}** à <@${user.id}>
        `)
        .addField('Ajouter par:-', `<@${message.author.id}>`)
        message.channel.send({embeds: [embed]})
    }
}