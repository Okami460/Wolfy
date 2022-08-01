const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const ms = require('ms')

module.exports = {
    name: "fish",
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Permet d'attraper un poisson",
    run: async (client, message, args) => {

        const user = message.member
        const fishrod = db.fetch(`fishrod_${user.id}`)
        const random = (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min
        }

        let options = [
            'Success',
            'Failed'
        ]
        let posted = random(0, parseInt(options.length)) 
        let final = options[posted] 

        const timeout = 120000
        const fishtime = db.fetch(`fishtime_${user.id}`)

        if (fishtime !== null && timeout - (Date.now() - fishtime) > 0) {
            const timeleft = ms(timeout - (Date.now() - fishtime))

            const embed = new MessageEmbed()
                .setAuthor(`${user.user.username} Pêche`, user.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
Vous avez déjà pêcher, repêcher dans **${timeleft}**
Le Cooldown par default est de **2 Minutes**
            `)
            message.channel.send({ embeds: [embed]})
        } else {
            let fishes = [
                `Common Fish`,
                `Rare Fish`,
                `Dolphin`,
                `Shark`
            ]
            const fishoption = random(0, parseInt(fishes.length))
            let fish = fishes[fishoption]

            let places = [
                `étang`,
                `Rivière`,
                `Lac`,
                `Océan`,
            ]
            const place = Math.floor(Math.random() * places.length)

            if (!fishrod || fishrod === null || fishrod === 0) return message.reply(`Vous devez acheter la canne a pêche`)
            else if (fishrod !== null || fishrod !== 0) {
                if (final === 'Success' && fish === 'Common Fish') {
                    const commonfishamt = Math.floor(Math.random() * 5) + 1 
                    const embed = new MessageEmbed()
                        .setAuthor(`${user.user.username} Pêche`, user.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()
                        .setColor('RANDOM')
                        .setDescription(`
<@${user.id}> est aller pêcher en **${places[place]}** Et a Obtenue **${commonfishamt}** poissons communs
                    `)
                    message.channel.send({ embeds: [embed]})
                    db.add(`commonfish_${user.id}`, commonfishamt)
                    db.set(`fishtime_${user.id}`, Date.now())
                } else if (final === 'Success' && fish === 'Rare Fish') {
                    const rarefishamt = Math.floor(Math.random() * 4) + 1
                    const embed = new MessageEmbed()
                        .setAuthor(`${user.user.username} Pêche`, user.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()
                        .setColor('RANDOM')
                        .setDescription(`
<@${user.id}> est aller pêcher en  **${places[place]}** et a Obtenue **${rarefishamt}** Un poisson rare
                    `)
                    message.channel.send({ embeds: [embed]})
                    db.add(`rarefish_${user.id}`, rarefishamt)
                    db.set(`fishtime_${user.id}`, Date.now())
                } else if (final === 'Success' && fish === 'Dolphin') {
                    const dolphinamt = Math.floor(Math.random() * 3) + 1
                    const embed = new MessageEmbed()
                        .setAuthor(`${user.user.username} Pêche`, user.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()
                        .setColor('RANDOM')
                        .setDescription(`
<@${user.id}> est aller pêcher en **${places[place]}** et a Obtenue **${dolphinamt}** Dauphin
                    `)
                    message.channel.send({ embeds: [embed]})
                    db.add(`dolphin_${user.id}`, dolphinamt)
                    db.set(`fishtime_${user.id}`, Date.now())
                } else if (final === 'Success' && fish === 'Shark') {
                    const sharkamt = Math.floor(Math.random() * 3) + 1
                    const embed = new MessageEmbed()
                        .setAuthor(`${user.user.username} Pêche`, user.user.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()
                        .setColor('RANDOM')
                        .setDescription(`
<@${user.id}> est aller pêcher en **${places[place]}** Et a obtenue **${sharkamt}** Requin
                    `)
                    message.channel.send({ embeds: [embed]})
                    db.add(`shark_${user.id}`, sharkamt)
                    db.set(`fishtime_${user.id}`, Date.now())
                } else if (final === 'Failed' && fish === 'Common Fish' || final === 'Failed' && fish === 'Rare Fish' || final === 'Failed' && fish === 'Dolphin' || final === 'Failed' && fish === 'Shark') {
                    message.reply(`Votre ligne c'est brisé`)
                    db.set(`fishtime_${user.id}`, Date.now())
                }
            }
        }
    }
}