const Discord = require('discord.js');
const Levels = require('discord-xp');
const Canvas = require("canvas")

module.exports = {
    name: "rank",
    category: "levels",
    permissions: ['SEND_MESSAGES'],
    usage: "[@membre/nom_membre]",
    description: "Afficher le rang de l’utilisateur",

    run: async (client, message, args) => {
        let target = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").toLowerCase());
        if (!target) target = message.member;

        const user = await Levels.fetch(target.user.id, message.guild.id, true);

        const neededXp = Levels.xpFor(parseInt(user.level) + 1);

        if (!user) return message.channel.send("Il semble que cet utilisateur n’a pas gagné d’xp jusqu’à présent");



            const canvas = Canvas.createCanvas(1000, 333) // Canvas Size
            const ctx = canvas.getContext('2d') // Making 2D
            let backgroundimage = await Canvas.loadImage("botConfig/assets/images/rank.png")
            
            ctx.drawImage(backgroundimage, 0, 0, canvas.width, canvas.height) // For Making Image

            // Box For Name And Level
            ctx.beginPath()
            ctx.lineWidth = 4
            ctx.strokeStyle = '#90EE90'
            ctx.globalAlpha = 0.2
            ctx.fillStyle = '#0390c8'
            ctx.fillRect(180, 216, 775, 65)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.strokeRect(180, 216, 775, 65)
            ctx.stroke

            // XP Bar With Fill
            ctx.fillStyle = '00FFFF'
            ctx.globalAlpha = 0.6
            ctx.fillRect(200, 216, ((100 / Levels.xpFor(parseInt(user.level) + 1)) * user.xp) * 7.5, 65) // Filling According To Users Level, Number Same As `const XPneeded`
            ctx.fill()
            ctx.globalAlpha = 1

            // Box For XP Bar
            ctx.beginPath()
            ctx.lineWidth = 4
            ctx.fillStyle = '#00a9ec'
            ctx.strokeStyle = '#90EE90'
            ctx.globalAlpha = 0.2
            ctx.fillRect(300, 75, 650, 120)
            ctx.fill()
            ctx.globalAlpha = 1
            ctx.strokeRect(300, 75, 650, 120)
            ctx.stroke()

            // XP/XP Needed
            ctx.font = '35px sans-serif'
            ctx.textAlign = 'left'
            ctx.fillStyle = '#FF0000'
            ctx.fillText(`${user.xp} / ${neededXp}`, 470, 260)

            // UserName
            ctx.font = '40px sans-serif'
            ctx.textAlign = 'left'
            ctx.fillStyle = '#000066'
            ctx.fillText(target.user.username, 325, 155)

            // Level
            ctx.font = '40px sans-serif'
            ctx.fillStyle = '#ffa500'
            ctx.fillText('Level: ', 760, 150)
            ctx.fillText(`${user.level}`, 875, 150)

            ctx.arc(170, 160, 120, 0, Math.PI * 2, true)
            ctx.lineWidth = 6
            ctx.strokeStyle = '00FFFF'
            ctx.stroke()
            ctx.closePath()
            ctx.clip()

            const avatar = await Canvas.loadImage(target.user.displayAvatarURL({ format: 'jpg' }))
            ctx.drawImage(avatar, 40, 40, 250, 250)

            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'rank.png')

            // Just Image
            message.channel.send({ files: [attachment] })

    },
};