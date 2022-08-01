const client = require('../../index');
const Discord = require('discord.js');
const Canvas = require('canvas');
const { Database } = require("quickmongo");
const dotenv = require("dotenv")
dotenv.config()
const quickmongo = new Database(process.env.MONGODBURL);



client.on("guildMemberRemove", async member => {
    const leaveChannelCheck = await quickmongo.fetch(`leave-${member.guild.id}`);


    var leaveCanva = {}
    leaveCanva.create = Canvas.createCanvas(1024, 500)
    leaveCanva.context = leaveCanva.create.getContext("2d")
    leaveCanva.context.font = "72px sans-serif"
    leaveCanva.context.fillStyle = "#ffffff"

    await Canvas.loadImage("botConfig/assets/images/welcome.png").then(img => {
        leaveCanva.context.drawImage(img, 0, 0, 1024, 500)
        leaveCanva.context.fillText("Au revoir !", 360, 360)
        leaveCanva.context.beginPath()
        leaveCanva.context.arc(512, 166, 128, 0, Math.PI *2, true)
        leaveCanva.context.stroke()
        leaveCanva.context.fill()
    })

    let canvas = leaveCanva
    canvas.context.font = "42px sans-serif"
    canvas.context.textAlign = "center"
    canvas.context.fillText(member.user.tag.toUpperCase(), 520, 410)
    canvas.context.font = "32px sans-serif"
    canvas.context.beginPath()
    canvas.context.arc(512, 166, 119, 0, Math.PI *2, true)
    canvas.context.closePath()
    canvas.context.clip()
    await Canvas.loadImage(member.user.displayAvatarURL({ format: "png", size: 1024})).then(img => {
        canvas.context.drawImage(img, 393, 47, 238, 238)
    })


    if (leaveChannelCheck) {

        const getLeaveChannel = await quickmongo.get(`leave-${member.guild.id}`)
        const leaveChannel = member.guild.channels.cache.get(getLeaveChannel);


            const attachment = new Discord.MessageAttachment(canvas.create.toBuffer(), 'leave.png')
            leaveChannel.send({ files: [attachment] })
        
    } else return;

})
