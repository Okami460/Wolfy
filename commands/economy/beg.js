const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const ms = require('ms')

module.exports = {
    name: "beg",
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Supplie de l'argent",
    run: async (client, message, args) => {

        const user = message.member
        const random = (min, max) => {
            return Math.floor(Math.random() * (max - min) ) + min
        }

        const timeout = 6000 // 1 Min en MiliSecondes
        const amount = Math.floor(Math.random() * 900) + 100 // Min c'est 100 et le max 900(100+900)
        
        let names = [
            'Sir Cole Jerkin',
            'Kim Kardashian',
            'Logan Paul',
            'Mr.Clean',
            'Ryan Gosling',
            'Ariana Grande',
            'Default Jonesy',
            'Cardi B',
            'Dwight Shrute',
            'Jesus',
            'Taylor Swift',
            'Beyoncé',
            'Bill Clinton',
            'Bob Ross',
            'The Rock:',
            'The Rock',
            'Mike Hoochie',
            'Doot Skelly',
            'Ayylien',
            'Spoopy Skelo'
        ]

        const name = Math.floor(Math.random() * names.length)

        let options = [
            'Success',
            'Failed'
        ]
        let begged = random(0, parseInt(options.length))
        let final = options[begged]
        const begtime = db.fetch(`beg-time_${user.id}`)

        if(begtime !== null && timeout - (Date.now() - begtime) > 0) {
            const timeleft = ms(timeout - (Date.now() - begtime))

            const embed = new MessageEmbed()
            .setAuthor(`${user.user.username} Suppli(e)`, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
Déjà supplié, supplier de l'argent à nouveau dans **${timeleft}**
Le temps de recharge par défaut est de **1 minutes**
            `)
            message.channel.send({ embeds: [embed]})
        } else {
            if(final === 'Success') {
                let gave = [
                    'Donne',
                    'offre'
                ]
                const give = Math.floor(Math.random() * gave.length)

                db.add(`money_${user.id}`, amount)
                const embed1 = new MessageEmbed()
                .setAuthor(`${user.user.username} Suppli(e)`, user.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
**${names[name]}**: ${gave[give]} **$${amount}** à <@${user.user.id}>
                `)
                message.channel.send({ embeds: [embed1]})
                db.set(`beg-time_${user.id}`, Date.now())
            } else if(final === 'Failed') {

                let notgave = [
                    `Je n’ai pas d’argent`,
                    `Je suis aussi pauvre`,
                    `J’ai déjà donné de l’argent au dernier suppliant`,
                    `Arrêtez de supplier`,
                    `Partez`
                ]
                const notgive = Math.floor(Math.random() * notgave.length)

                const embed2 = new MessageEmbed()
                .setAuthor(`${user.user.username} Supplie`, user.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
**${names[name]}**: ${notgave[notgive]}
                `)
                message.channel.send({ embeds: [embed2]})
                db.set(`beg-time_${user.id}`, Date.now())
            }
        }
    }
}