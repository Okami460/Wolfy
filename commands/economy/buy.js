const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: "buy",
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Permet d'acheter un Objet !",
    run: async (client, message, args) => {

        if (args[0].toLowerCase() === 'laptop') {
            const user = message.member
            const amount = 10000
            const bal = db.fetch(`money_${user.id}`)

            if (bal < amount) {
                return message.reply(`Vous n’avez pas assez d’argent ('$10,000') dans le portefeuille pour acheter l’ordinateur portable`)
            } else {
                const embed = new MessageEmbed()
                    .setAuthor(`${user.user.username} achetées`, user.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setDescription(`
<@${user.id}> à achetées **1** *Un ordinateur portable* pour \`$10,000\`
                `)
                    .setFooter('Shop')
                message.channel.send({ embeds: [embed] })
                db.add(`laptop_${user.id}`, 1)
                db.subtract(`money_${user.id}`, amount)
            }
        }

        else if (args[0].toLowerCase() === 'fish' && args[1].toLowerCase() === 'rod') {
            const user = message.member
            const amount = 15000
            const bal = db.fetch(`money_${user.id}`)

            if (bal < amount) {
                return message.reply(`Vous n’avez pas assez d’argent ('$15,000') dans le portefeuille pour acheter la canne à pêche`)
            } else {
                const embed = new MessageEmbed()
                    .setAuthor(`${user.user.username} achat`, user.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setDescription(`
<@${user.id}> à achetée  **1** *canne à pêche* pour \`$15,000\`
                `)
                    .setFooter('Shop')
                message.channel.send({ embeds: [embed] })
                db.add(`fishrod_${user.id}`, 1)
                db.subtract(`money_${user.id}`, amount)
            }
        }
    }
}