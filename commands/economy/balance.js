const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: "balance",
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Vérifie votre porte monnaie",
    run: async (client, message, args) => {

        const user = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(" ").toLowerCase()) || message.member

        let bal = db.fetch(`money_${user.id}`)
        if(bal === null) bal = '0'

        let bank = db.fetch(`bank_${user.id}`)
        if(bank === null) bank = '0'

        const embed = new MessageEmbed()
        .setAuthor(`${user.user.username} Balance`, user.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor('RANDOM')
        .setDescription(`
💸 Argent:- **$${bal}**
🏦 Banque:- **$${bank}**
        `)
        message.channel.send({ embeds: [embed]})
    }
}