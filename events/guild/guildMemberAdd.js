const client = require('../../index');
const Discord = require('discord.js');
const Canvas = require('canvas');
const { Database } = require('quickmongo');
const mongoDBURL = require("../../botConfig/config.json").mongoDBURl;
const quickmongo = new Database(mongoDBURL);
const muteSchema = require('../../models/muted');


client.on("guildMemberAdd", async member => {
    const autoRoleCheck = await quickmongo.fetch(`autoRole-${member.guild.id}`);
    const getMemberRole = await quickmongo.get(`memberRole-${member.guild.id}`);
    const getMuteRole = await quickmongo.get(`muteRole-${member.guild.id}`);
    const memberRole = member.guild.roles.cache.get(getMemberRole);
    const muteRole = member.guild.roles.cache.get(getMuteRole);
    const welcomeChannelCheck = await quickmongo.fetch(`welcome-${member.guild.id}`);


    if (autoRoleCheck) {
        member.roles.add(memberRole)
         const muteSchemaData = await muteSchema.findOne({ Guild: member.guild.id })
         if (!muteSchemaData) return;

         const user = muteSchemaData.Users.findIndex(props => props === member.id)
         if (user == -1 ) {
             member.roles.add(memberRole)
         } else {
             member.roles.add(memberRole)
             member.roles.add(muteRole)
         }
    }


    var welcomeCanva = {}
    welcomeCanva.create = Canvas.createCanvas(1024, 500)
    welcomeCanva.context = welcomeCanva.create.getContext("2d")
    welcomeCanva.context.font = "72px sans-serif"
    welcomeCanva.context.fillStyle = "#ffffff"

    await Canvas.loadImage("botConfig/assets/images/welcome.png").then(img => {
        welcomeCanva.context.drawImage(img, 0, 0, 1024, 500)
        welcomeCanva.context.fillText("Bienvenue !", 360, 360)
        welcomeCanva.context.beginPath()
        welcomeCanva.context.arc(512, 166, 128, 0, Math.PI *2, true)
        welcomeCanva.context.stroke()
        welcomeCanva.context.fill()
    })

    let canvas = welcomeCanva
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


    if (welcomeChannelCheck) {

        const getWelcomeChannel = await quickmongo.get(`welcome-${member.guild.id}`)
        const welcomeChannel = member.guild.channels.cache.get(getWelcomeChannel);


            const attachment = new Discord.MessageAttachment(canvas.create.toBuffer(), 'welcome.png')
            welcomeChannel.send({ files: [attachment] })
        
    } else return;

})
