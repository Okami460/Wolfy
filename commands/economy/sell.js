const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const Levels = require('discord-xp');

module.exports = {
    name: "sell",
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Permet de vendre un Objet !",
    run: async (client, message, args) => {
        if (args[0].toLowerCase() === 'laptop') {
            const user = message.member
            const amount = 6000
            const laptop = db.fetch(`laptop_${user.id}`)
            if (laptop === null || laptop === 0) {
                return message.reply(`Vous n’avez pas d’ordinateur portable à vendre`)
            } else if (laptop !== null || laptop !== 0) {
                const embed = new MessageEmbed()
                    .setAuthor(`${user.user.username} Sold`, user.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setDescription(`
<@${user.id}>  à vendu **1** *ordinateur portable* pour \`$6,000\`
                `)
                    .setFooter('Shop')
                    message.channel.send({ embeds: [embed]})
                    db.subtract(`laptop_${user.id}`, 1)
                db.add(`money_${user.id}`, amount)
            }
        }
        else if(args[0].toLowerCase() === 'fish' && args[1].toLowerCase() === 'rod') {
            const user = message.member
            const amount = 6000
            const laptop = db.fetch(`fishrod_${user.id}`)
            if (laptop === null || laptop === 0) {
                return message.reply(`Vous n’avez pas de canne à pêche à vendre`)
            } else if (laptop !== null || laptop !== 0) {
                const embed = new MessageEmbed()
                    .setAuthor(`${user.user.username} Sold`, user.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setDescription(`
<@${user.id}>  à vendu **1** *canne à pêche* pour \`$7,000\`
                `)
                    .setFooter('Shop')
                    message.channel.send({ embeds: [embed]})
                    db.subtract(`fishrod_${user.id}`, 1)
                db.add(`money_${user.id}`, amount)
            }
        }
    }
}