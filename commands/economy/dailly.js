const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const ms = require('ms')


module.exports = {
    name: "daily",
    aliases: ["claim"],
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Récupère de l'argent par jour",
    run: async (client, message, args) => {
        const user = message.member
        const timeout = 86400000 // 1 jour
        const amount = Math.floor(Math.random() * 8000) + 2000
        const dailytime = db.fetch(`dailytime_${user.id}`)

        if(dailytime !== null && timeout - (Date.now() - dailytime) > 0) {
            const timeleft = ms(timeout - (Date.now() - dailytime))

            const embed = new MessageEmbed()
            .setAuthor(`${user.user.username} Récompense quotidienne`, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
Vous avez déjà eu votre récompense Quotidienne, Veuillez le réclamer à nouveau dans **${timeleft}**
Le Cooldown par default est de **24 Heures(1 jour)**
            `)
            message.channel.send({ embeds: [embed]})
        } else {
            const embed = new MessageEmbed()
            .setAuthor(`${user.user.username} Récompense quotidienne`, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
<@${user.id}> récupère **$${amount.toLocaleString()}** Sur sa récompense quotidienne
            `)
            message.channel.send({ embeds: [embed]})
            db.add(`money_${user.id}`, amount)
            db.set(`dailytime_${user.id}`, Date.now())
        }
    }
}
    

