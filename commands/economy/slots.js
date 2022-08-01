const { Client, Message, MessageEmbed } = require('discord.js')
const db = require('quick.db')
const ms = require("ms")

module.exports = {
    name: "slot",
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    aliases: ["slots"],
    description: "Permet de jouer a la machine à sous !",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        let topEmojis = [":grapes: :grapes: :grapes:", ":apple: :apple: :apple:"]
        let top = topEmojis[Math.floor(Math.random() * topEmojis.length)]
        let midemojis = [':grapes: :grapes: :apple:', ':apple: :apple: :grapes:']
        let mid = midemojis[Math.floor(Math.random() * midemojis.length)]
        let bottomemoji = [':tangerine: :apple: :grapes', ':grapes: :apple: :tangerine:']
        let bottom = bottomemoji[Math.floor(Math.random() * bottomemoji.length)]
        
        
        let slotsTimeout = 60000
        let slot = db.fetch(`slots_${message.member.user.id}`)

        if (slot !=null && slotsTimeout - (Date.now() - slot) > 0) {
            let time = ms(slotsTimeout - (Date.now() - slot))
            const embed = new MessageEmbed()
            .setAuthor(`${message.member.user.username} Suppli(e)`, message.member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
Déjà joué, rejouer à nouveau dans **${time}**
Le temps de recharge par défaut est de **1 minutes**
            `)
            message.channel.send({embeds:[embed]})
        } else {
            let emojis;
            let color;
            let amount = Math.floor(Math.random() * 1200) + 100
            if (amount > 500) emojis = top
            if (amount < 501 && amount >0) emojis = mid
            if (amount < 1) emojis = bottom
            if (amount > 0) color = "GREEN"
            if (amount < 0) color = "RED"


            const embed = new MessageEmbed()
            .setAuthor(`${message.member.user.username} Récompense quotidienne`, message.member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
<@${message.member.user.id}> récupère **$${amount.toLocaleString()}** en jouant a la machine à sous
            `)
            .addField("Votre score", emojis)

            message.channel.send({embeds:[embed]})
            db.add(`money_${message.member.user.id}`, amount)
            db.set(`slots_${message.member.user.id}`, Date.now())
        }
    }
}