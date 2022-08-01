const Discord = require("discord.js");
const ms = require("ms");


module.exports = {
    name: "rappel",
    category: "utility",
    permissions: ["SEND_MESSAGES"],
    usage: "<time> <rappel>",
    description: "définit un rappel",

    run: async (client, message, args) => {
        let time = args.shift()
        let reminder = args.join(" ")

        const noDurationEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("ERROR")
            .setDescription("Veuillez définir un temps pour votre rappel (ex: 1s / 1m / 1h / 1d / 1y )")
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
            .setTimestamp();

        if (!time) return message.channel.send({ embeds: [noDurationEmbed] })
        if (!time.includes('s') && !time.includes('m') && !time.includes('h') && !time.includes('d') && !time.includes('y')) return message.channel.send({ embeds: [noDurationEmbed] })

        const noRemindEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setTitle("ERROR")
            .setDescription("Veuillez définir un rappel")
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
            .setTimestamp();

        if (!reminder) return message.channel.send({ embeds: [noRemindEmbed] })

        const reminderEmbed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle("Votre rappel à été définit avec succès !")
            .addField("Rappel", `${reminder}`)
            .addField("Rappel dans", `${time}`)
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
            .setTimestamp();
        //var args = message.content.replace('d!giveaway ', '').split(/ +/)
        message.channel.send({ embeds: [reminderEmbed] }).then(msg => {
            var seconds = 0
            if (time.includes('y')) seconds = Number.parseInt(time.replace('y', '')) * 31536000
            else if (time.includes('d')) seconds = Number.parseInt(time.replace('d', '')) * 86400
            else if (time.includes('h')) seconds = Number.parseInt(time.replace('h', '')) * 3600
            else if (time.includes('m')) seconds = Number.parseInt(time.replace('m', '')) * 60
            else if (time.includes('s')) seconds = Number.parseInt(time.replace('s', ''))

            const reminderAlertEmbed = new Discord.MessageEmbed()
                .setColor("BLUE")
                //.setAuthor(`Fin du Rappel !!`, client.user.displayAvatarURL())
                .addField("Rappel", `${reminder}`)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})
                .setTimestamp()

            setTimeout(() => {
                reminderAlertEmbed.setDescription(`${message.author} voici votre rappel !`)
                reminderAlertEmbed.setTitle("RAPPEL TERMINER")
                msg.edit({
                    embeds: [reminderAlertEmbed]
                })
            }, seconds * 1000);
        })
    }
}