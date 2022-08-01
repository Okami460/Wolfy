const { MessageEmbed } = require('discord.js')
const db = require('quick.db') 
const ms = require('ms')

module.exports = {
    name: "weekly",
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Récupère de l'argent par semaine",
    run: async (client, message, args) => {

        const user = message.member
        const timeout = 604800000 // 1semaine
        const amount = Math.floor(Math.random() * 20000) + 10000 
        const weeklytime = db.fetch(`weeklytime_${user.id}`)

        if(weeklytime !== null && timeout - (Date.now() - weeklytime) > 0) { 
            const timeleft = ms(timeout - (Date.now() - weeklytime))

            const embed = new MessageEmbed()
            .setAuthor(`${user.user.username} Récompense Hebdomadaire`, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
Argent hebdomadaires déjà réclamées, réclamer à nouveau dans **${timeleft}**
Le cooldown par défaut est de  **1 semaine (7 jours)**
            `)
            message.channel.send({ embeds: [embed]})
        } else {
            const embed = new MessageEmbed()
            .setAuthor(`${user.user.username} Récompense hebdomadaire`, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
<@${user.id}> réclame **$${amount.toLocaleString()}** de sa récompense Hebdomadaire
            `)
            message.channel.send({ embeds: [embed]})
            db.add(`money_${user.id}`, amount)
            db.set(`weeklytime_${user.id}`, Date.now())
        }
    }
}