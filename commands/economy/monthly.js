const { MessageEmbed } = require('discord.js')
const db = require('quick.db') 
const ms = require('ms') 

module.exports = {
    name: "monthly",
    aliases: ["month", "mois"],
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Récupère de l'argent par mois",
    run: async (client, message, args) => {

        const user = message.member
        const timeout = 2629800000  // 1 mois
        const amount = Math.floor(Math.random() * 20000) + 100000 
        const monthlytime = db.fetch(`monthlytime_${user.id}`) 

        if(monthlytime !== null && timeout - (Date.now() - monthlytime) > 0) { 
            const timeleft = ms(timeout - (Date.now() - monthlytime))

            const embed = new MessageEmbed()
            .setAuthor(`${user.user.username} récompense par mois`, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
Vous avez déjà réclamer votre récompense par mois, veuillez réclamer dans**${timeleft} **
Le cooldown par défault est de **1 mois (30 jours)**
            `)
            message.channel.send({ embeds: [embed]})
        } else {
            const embed = new MessageEmbed()
            .setAuthor(`${user.user.username} Récompense du mois`, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
<@${user.id}> est Obtenue **$${amount.toLocaleString()}** de sa Récompense du mois
            `)
            message.channel.send({ embeds: [embed]})
            db.add(`money_${user.id}`, amount)
            db.set(`monthlytime_${user.id}`, Date.now())
        }
    }
}