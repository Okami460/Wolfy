const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'retire',
    category: "economy",
    usage: " <nombre à retirer> ou <tout>",
    permissions: ['SEND_MESSAGES'],
    description: 'Transfère votre argent dans votre porte-monnaie',

    run: async (client, message, args) => {
        const user = message.member
        const totalCashInBank = db.fetch(`bank_${user.id}`)
        if(totalCashInBank === null || totalCashInBank === 0) return message.reply('Vous n\'avez pas d\'argent dans votre banque')
        if(args[0] === 'tout') { 
        const embed = new MessageEmbed()
        .setAuthor(`${user.user.username} retire`, user.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor('RANDOM')
        .setDescription(`
<@${user.user.id}> à retirer **$${totalCashInBank}** de la Banque
        `)
        message.channel.send({ embeds: [embed]})
        db.subtract(`bank_${user.id}`, totalCashInBank)
        db.add(`money_${user.id}`, totalCashInBank) 
        } else {
            const amount = args[0]
            if(!amount) return message.reply('Combien d’argent voulez-vous retirer?')
            else if(amount % 1 != 0 || amount <= 0) return message.reply('Vous ne pouvez pas retirer de l’argent fractionnaire')
            else if(amount > totalCashInBank) return message.reply('Vous n’avez pas autant d’argent en banque')
            else {
                const embed = new MessageEmbed()
        .setAuthor(`${user.user.username} Retire`, user.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor('RANDOM')
        .setDescription(`
<@${user.user.id}> a retirer **$${amount}** a la Banque
        `)
        message.channel.send({ embeds: [embed]})
        db.subtract(`bank_${user.id}`, amount)
        db.add(`money_${user.id}`, amount)
            }
        }
    }
}