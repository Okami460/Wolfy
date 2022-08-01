const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const db = require('quick.db')
const ms = require('ms')

module.exports = {
    name: "postmeme",
    aliases: ["pm"],
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Postez des mêmes pour gagner des $",
    run: async (client, message, args) => {

        const user = message.member
        const laptop = db.fetch(`laptop_${user.id}`)
        const random = (min, max) => {
            return Math.floor(Math.random() * (max - min)) + min
        }

        const timeout = 120000
        let options = [
            'Success',
            'Failed'
        ]
        let posted = random(0, parseInt(options.length))
        let final = options[posted]

        const memetime = db.fetch(`postmemetime_${user.id}`)

        if (memetime !== null && timeout - (Date.now() - memetime) > 0) {
            const timeleft = ms(timeout - (Date.now() - memetime))

            const embed = new MessageEmbed()
                .setAuthor(`${user.user.username} Meme Poster`, user.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
Déjà posté un même, poster un même à nouveau dans **${timeleft} **
Le Cooldown par défault est de **2 Minutes**
            `)
            message.channel.send({ embeds: [embed]})
        } else {
            if (!laptop || laptop === null || laptop === 0) return message.channel.send(`Veuillez acheter le laptop (ordinateur portable)`)
            else if (laptop !== null || laptop !== 0) {
                if (final === 'Success') {
                    let socailmedias = [
                        `Twitter`,
                        `Instagram`,
                        `Pinterest`,
                        `Facebook`,
                        `Tik Tok`,
                        `Reddit`,
                        `Twitch`,
                        `LinkedIn`,
                        `Snapchat`,
                        `Telegram`
                    ]
                    const socailmedia = Math.floor(Math.random() * socailmedias.length)

                    let virals = [ // For Viral Options
                      `Meme Poster sur **${socailmedias[socailmedia]}** ce qui  __**EXPLOSE**__`,
                        `Meme Poster sur **${socailmedias[socailmedia]}** ce qui  **haï** tout le monde`,
                        `Meme Poster sur **${socailmedias[socailmedia]}** Qui a obtenu une **Réponse Décente** `,
                    ]
                    const viral = Math.floor(Math.random() * virals.length)

                    const amount = Math.floor(Math.random() * 1600) + 400

                    // Buttons For Message
                    const button1 = new MessageButton()
                        .setStyle('SUCCESS')
                        .setLabel('Fresh Meme')
                        .setCustomId('fresh')

                    const button2 = new MessageButton()
                        .setStyle('DANGER')
                        .setLabel('Copie le meme')
                        .setCustomId('copy')

                    const button3 = new MessageButton()
                        .setStyle('SECONDARY')
                        .setLabel('Générer automatiquement un meme')
                        .setCustomId('auto')

                    const row = new MessageActionRow().addComponents([button1, button2, button3])

                    message.channel.send({ content:`**Quel type de meme souhaitez publier ?**\n40 secondes`, 
                        components: [row]
                    }).then(msg => {
                        const filter = (i) => i.isButton() && i.user && i.message.author.id == client.user.id;
                        const collector = msg.createMessageComponentCollector({filter,  time: 40000 });

                        collector.on('collect', (b) => {
                            b.deferUpdate()
                            if (b.customId === 'fresh') {
                                const embed = new MessageEmbed()
                                    .setAuthor(`${user.user.username} Poste un meme tout frais`, user.user.displayAvatarURL({ dynamic: true }))
                                    .setTimestamp()
                                    .setColor('RANDOM')
                                    .setDescription(`
<@${user.id}> ${virals[viral]}, Et il a eu **$${parseInt(amount).toLocaleString()}**
                            `)
                                b.channel.send({ embeds: [embed]})
                                db.add(`money_${user.id}`, amount)
                                db.set(`postmemetime_${user.id}`, Date.now())
                                collector.stop()
                            } else if (b.customId === 'copy') {
                                const embed = new MessageEmbed()
                                    .setAuthor(`${user.user.username} Poste un meme copié`, user.user.displayAvatarURL({ dynamic: true }))
                                    .setTimestamp()
                                    .setColor('RANDOM')
                                    .setDescription(`
<@${user.id}> ${virals[viral]}, Et il a obtenue **$${parseInt(amount).toLocaleString()}**
                        `)
                                b.channel.send({ embeds: [embed]})
                                db.add(`money_${user.id}`, amount)
                                db.set(`postmemetime_${user.id}`, Date.now())
                                collector.stop()
                            } else if (b.customId === 'auto') {
                                const embed = new MessageEmbed()
                                    .setAuthor(`${user.user.username} Poste un meme automatique`, user.user.displayAvatarURL({ dynamic: true }))
                                    .setTimestamp()
                                    .setColor('RANDOM')
                                    .setDescription(`
<@${user.id}> ${virals[viral]}, Et il a obtenue **$${parseInt(amount).toLocaleString()}**
                            `)
                                b.channel.send({ embeds: [embed]})
                                db.add(`money_${user.id}`, amount)
                                db.set(`postmemetime_${user.id}`, Date.now())
                                collector.stop()
                            } else {
                                b.channel.send(`${user.id} Vous n’avez pas choisi à temps`)
                            }
                        })
                    })
                } else if (final === 'Failed') {
                    message.channel.send(`Votre Ordinateur portable à crash lors de la publication du meme`)
                    db.set(`postmemetime_${user.id}`, Date.now())
                }
            }
        }
    }
}