const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const ms = require("ms")

module.exports = {
    name: 'vole',
    category: "economy",
    usage: "<user_mention> <nombre d'argent a voler>",
    permissions: ['SEND_MESSAGES'],
    description: 'Ajoute de l\'argent a un Utilisateur',

    run : async (client, message, args) => {
        const user = message.member
        const mention = message.mentions.members.first()
        if(!mention) return message.reply('Qui voulez vous voler?')
        const usermoney = db.fetch(`money_${user.id}`) 
        const mentionmoney = db.fetch(`money_${mention.id}`) 

        const random = (min, max) => {
            return Math.floor(Math.random() * (max - min) ) + min
        }
        const timeout = 60000 

        let options = [
            'Success',
            'Failed',
            'Paid'
        ]
        let robbed = random(0, parseInt(options.length))
        let final = options[robbed]
        const robtime = db.fetch(`robtime_${user.id}`)

        if(robtime !== null && timeout - (Date.now() - robtime) > 0) { 
            const timeleft = ms(timeout - (Date.now() - robtime))

            const embed = new MessageEmbed()
            .setAuthor(`${user.user.username} Vole`, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
Déjà volé, Vole à nouveau dans **${timeleft}**
Le cooldowns par défaut est d' **1 Minute**
            `)
            message.channel.send({embeds:[embed]})
        } else {
            if(usermoney < 2000) return message.reply(`Vous avez besoin d’au moins 2000 $ dans votre portefeuille pour voler quelqu'un`)
            else if(mentionmoney < 0) return message.reply(`L’utilisateur mentionné n’a pas d’argent dans le portefeuille`) 
            else if(mentionmoney < 2000) return message.reply(`L’utilisateur mentionné devrait avoir au moins 2000 $ en portefeuille à voler`)
            else {
                if(final === 'Success') {
                    const amount = Math.floor(Math.random() * 1400) + 100 // Min: 100 And Max: 1500(100+1400)
                    const embed = new MessageEmbed()
                    .setAuthor(`${user.user.username} Vole`, user.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setDescription(`
<@${user.id}> vole <@${mention.id}> Et s’en est sorti avec **$${amount}**
                    `)
                    message.channel.send({embeds:[embed]})
                    db.add(`money_${user.id}`, amount)
                    db.subtract(`money_${mention.id}`, amount)
                    db.set(`robtime_${user.id}`, Date.now())
                } else if(final === 'Failed') {
                    const embed1 = new MessageEmbed()
                    .setAuthor(`${user.user.username} vole`, user.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setDescription(`
<@${user.id}> Essaye de voler à <@${mention.id}> Mais il a échoué
                    `)
                    message.channel.send({embeds:[embed1]})
                    db.set(`robtime_${user.id}`, Date.now())
                } else if(final === 'Paid') {
                    const amount = Math.floor(Math.random() * 1400) + 100 // Min: 100 And Max: 1500(100+1400)
                    const embed2 = new MessageEmbed()
                    .setAuthor(`${user.user.username} vole`, user.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setDescription(`
<@${user.id}> vole à  <@${mention.id}> Mais a été pris et a dû payer **$${amount}** à <@${mention.id}>
                    `)
                    message.channel.send({embeds:[embed2]})
                    db.add(`money_${mention.id}`, amount)
                    db.subtract(`money_${user.id}`, amount) 
                    db.set(`robtime_${user.id}`, Date.now())
                }
            }
        }
    }
}