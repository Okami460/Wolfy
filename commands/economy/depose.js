const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'depose',
    category: "economy",
    usage: "<nombre a deposer> ou <tout>",
    permissions: ['SEND_MESSAGES'],
    description: 'Transfère votre argent a la banque',

    run: async (client, message, args) => {
        const user = message.member
        const totalCashInWallet = db.fetch(`money_${user.id}`)
        if (totalCashInWallet === null || totalCashInWallet === 0) return message.reply('Vous n\'avez pas d\'argent dans le portefeuille')
        if (args[0] === 'tout') {
            const embed = new MessageEmbed()
                .setAuthor(`${user.user.username} Dépose`, user.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
<@${user.user.id}> a déposer **$${totalCashInWallet}** a la banque
        `)
            message.channel.send({ embeds: [embed]})
            db.subtract(`money_${user.id}`, totalCashInWallet)
            db.add(`bank_${user.id}`, totalCashInWallet) 
        } else { 
            const amount = args[0]
            if (!amount) return message.reply('Combien d\'argent veut déposer?')
            else if (amount % 1 != 0 || amount <= 0) return message.reply('Vous ne pouvez pas déposer l’argent fractionné')
            else if (amount > totalCashInWallet) return message.reply('Vous n’avez pas autant d’argent dans le portefeuille')
            else {
                const embed = new MessageEmbed()
                    .setAuthor(`${user.user.username} Dépose`, user.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setDescription(`
<@${user.user.id}> a déposer **$${amount}** à la banque
        `)
                message.channel.send({ embeds: [embed]})
                db.subtract(`money_${user.id}`, amount)
                db.add(`bank_${user.id}`, amount)
            }
        }
    }
}