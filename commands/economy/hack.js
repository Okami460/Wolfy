const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const ms = require('ms')

module.exports = {
    name: "hack",
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    usage: "<@membre>",
    description: "Permet de hack quelqu'un",
    run: async (client, message, args) => {

        const user = message.member
        const mention = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(" ").toLowerCase())
        if (!mention) return message.reply(`Veuillez mentionner la personne à Hack`)

        const timeout = 120000
        const hacktime = db.fetch(`hacktime_${user.id}`)

        if (hacktime !== null && timeout - (Date.now() - hacktime) > 0) {
            const timeleft = ms(timeout - (Date.now() - hacktime))

            const embed = new MessageEmbed()
                .setAuthor(`${user.user.username} Hacked`, user.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
Vous avez déjà Hack, Hacker une persoone dans ${timeleft}**
Le cooldown par default est de **2 Minutes**
            `)
            message.channel.send({embeds:[embed]})
        } else {
            
            const domain = ["gmail.com", "outlook.com", "gamil.fr", "outlook.fr", "yahoo.com"]
            const disemail = Math.floor(Math.random() * domain.length)
            
            const dispassword = randomPassword(12)

            const password = randomPassword(12)
 
            const ip = ipAddress()

            const age = await randomNumber({ 
                Minimum: 8,
                Maximum: 62,
            })

            message.channel.send(`Commencement du hack de ${mention.user.username}`).then(message => {
                setTimeout(function () {
                    message.edit(`Connection a son compte Discord...`)
                }, 2000)
                setTimeout(function () {
                    message.edit(`Connection a son compte Discord. 2FA Passé`)
                }, 5000)
                setTimeout(function () {
                    message.edit(`Connecté à Discord de ${mention.user.username}\nEmail: ${mention.user.username}@${domain[disemail]}\nPassword: ${dispassword}`)
                }, 8000)
                setTimeout(function () {
                    message.edit(`Injection d'un virus #${mention.user.discriminator}`)
                }, 11000)
                setTimeout(function () {
                    message.edit(`Virus injecté avec succès #${mention.user.discriminator}`)
                }, 15000)
                setTimeout(function () {
                    message.edit(`Hack du compte Gmail...`)
                }, 18000)
                setTimeout(function () {
                    message.edit(`Hack du compte Gmail... Obtention du mot de passe`)
                }, 22000)
                setTimeout(function () {
                    message.edit(`Obtention de l'addresse IP...`)
                }, 26000)
                setTimeout(function () {
                    message.edit(`Addresse IP de ${mention.user.username} trouvé\nIP: ${ip}`)
                }, 30000)
                setTimeout(function () {
                    message.edit(`Obtention de son age...`)
                }, 35000)
                setTimeout(function () {
                    message.edit(`Age de ${mention.user.username} trouvé\nAge: ${age}`)
                }, 37000)
                setTimeout(function () {
                    message.edit(` ${mention.user.username} a bien été hack <a:YesA:1001974253081595904>`)
                }, 40000)
            })
            db.set(`hacktime_${user.id}`, Date.now())
        }
    }
}


function ipAddress() {
    var ip = (Math.floor(Math.random() * 43) + 256) + "." + (Math.floor(Math.random() * 43)) + "." + (Math.floor(Math.random() * 43)) + "." + (Math.floor(Math.random() * 43));
    return ip;
}

async function randomNumber(options = {}) {

    const minnum = parseInt(options.Minimum)
    const maxnum = parseInt(options.Maximum)

    var number = Math.floor(Math.random() * maxnum) + minnum

    return number;
};

function randomPassword(Length) {
    var length = Length,
        res = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        value = "";
    for (var i = 0, n = res.length; i < length; ++i) {
        value += res.charAt(Math.floor(Math.random() * n));
    }
    return value;
}