const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const ms = require('ms') 

module.exports = {
    name: "coinflip",
    aliases: ["coin", "pièce"],
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Récupère de l'argent par mois",
    run: async (client, message, args) => {

        const user = message.member
        const ht = args[0] 
        if(!ht) return message.channel.send(`veuillez indiqué votre choix pile ou face ?`)
        const amount = args[1]
        if(!amount) return message.channel.send(`Veuillez fournir le montant de votre parie`)
        const bal = db.fetch(`money_${user.id}`)
        
        const coin = ['pile', 'face']

        const timeout = 120000 
        const coinfliptime = db.fetch(`coinfliptime_${user.id}`)
        if(coinfliptime !== null && timeout - (Date.now() - coinfliptime) > 0) {
            const timeleft = ms(timeout - (Date.now() - coinfliptime))

            const embed = new MessageEmbed()
            .setAuthor(`${user.user.username} Pièce retournée`, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor('RANDOM')
            .setDescription(`
Déjà retourné, retournez à nouveau dans **${timeleft}**
Le cooldown par défaut est de **2 Minutes**
            `)
            message.channel.send({embeds:[embed]})
        } else {
            if(!coin.includes(ht)) return message.channel.send(`Vous devez choisir **pile** ou **face**`)
            if(isNaN(amount)) return message.channel.send(`Le montant n’est pas un nombre`)
            if(amount > bal) return message.channel.send(`Vous n’avez pas autant d’argent dans le portefeuille`) 
            if(amount < 500) return message.channel.send(`Vous avez besoin de parier au moins 500 $`) 

            const flip = coin[Math.floor(Math.random() * coin.length)]

            const fliped = Capitalize({
                Capital: flip
            })

            if(flip === ht) {
                const embed = new MessageEmbed()
                .setAuthor(`${user.user.username} Pièce retourné`, user.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
<@${user.id}> Pièce retournée qui a atterri sur **${fliped}** et a Obtenue ${amount}
                `)
                message.channel.send({embeds:[embed]})
                db.add(`money_${user.id}`, amount)
                db.set(`coinfliptime_${user.id}`, Date.now())
            } else {
                const embed = new MessageEmbed()
                .setAuthor(`${user.user.username} Pièce retourné`, user.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
<@${user.id}> Pièce retournée qui a atterri sur **${fliped}** et à perdu ${amount}
                `)
                message.channel.send({embeds:[embed]})
                db.subtract(`money_${user.id}`, amount)
                db.set(`coinfliptime_${user.id}`, Date.now())
            }
        }
    }
}

function Capitalize(options = {}) {

    const capital = options.Capital.charAt(0).toUpperCase() + options.Capital.slice(1);

    return capital;
}