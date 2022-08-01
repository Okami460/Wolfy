const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const ms = require('ms') 


module.exports = {
    name: "recherche",
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Permet de faire une recherche !",
    run: async (client, message, args) => {

        const user = message.member

        const timeout = 120000 
        const seacrtime = db.fetch(`seacrtime_${user.id}`)
        if (seacrtime !== null && timeout - (Date.now() - seacrtime) > 0) {
            const timeleft = ms(timeout - (Date.now() - seacrtime))

            const embed = new MessageEmbed()
                .setAuthor(`${user.user.username} Cherche`, user.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
Vous avez déjà effetcuer une recherche, refaite une recherche dans **${timeleft}**
Le cooldown par defaut est de  **2 Minutes**
            `)
            message.channel.send({embeds:[embed]})
        } else {
            const locations = [
                "voiture",
                "chaussette",
                "porte-monnaie",
                "boxe",
                "poche",
                "bus",
                "parc",
                "train",
                "salon",
                "clavier",
                "salle de Bains",
                "lit",
                "canapé",
                "sac à dos",
                "ordinateur",
                "égout",
                "garde-manger",
                "chaussure",
                "arbre",
                "air",
                "rue",
                "grenier",
                "terre",
            ]
            let location = locations.sort(() =>
                Math.random() - Math.random()
            ).slice(0, 3)

            const amount = Math.floor(Math.random() * 1500) + 500 

            message.channel.send(`<@${user.id}> Où voulez-vous rechercher?\n\`${location.join("` `")}\``)

            const filter = (m) => {
                return m.author.id === user.id 
            }
            const collector = message.channel.createMessageCollector({filter, 
                max: 1,
                time: 40000,
            })

            collector.on('collect', async (m) => {
            
                const searched = Capitalize({
                    Capital: m.content
                })

                const embed = new MessageEmbed()
                    .setAuthor(`${user.user.username} Cherche`, user.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setDescription(`
  Vous avez cherché de l’argent dans **${searched}** et trouvé **$${amount.toLocaleString()}**
                `)
                message.channel.send({embeds:[embed]})
                db.add(`money_${user.id}`, amount)
                db.set(`seacrtime_${user.id}`, Date.now())
                collector.stop()
            })
            collector.on('end', collected => {
                if(collected.size === 0) {
                    message.channel.send(`<@${user.id}> Votre temps terminé, vous avez obtenue **$${amount.toLocaleString()}** `)
                    db.set(`seacrtime_${user.id}`, Date.now())
                    collector.stop()
                }
            })
        }
    }
}

function Capitalize(options = {}) {

    const capital = options.Capital.charAt(0).toUpperCase() + options.Capital.slice(1);

    return capital;
}