const { Message, Client } = require('discord.js');

module.exports = {
    name: "unban",
    category: "moderation",
    permissions: ['BAN_MEMBERS'],
    usage: "<membre_id> [reason]",
    description: "Unban un membre du serveur",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */

    run: async(client, message, args) => {
        let reason = args.slice(1).join(" ")

        const userID = args[0]

        if (!reason) reason = "Pas de raison"

        if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('Vous n\'avais pas les permissions "Bannir les membres"')
        if(!message.guild.me.permissions.has("BAN_MEMBERQ"))
        return message.channel.send("Je n'ai pas les permisions 'bannir'")

        if (!args[0]) return message.channel.send("Veuillez spécifier l'id du membre")
        if (isNaN(args[0])) return message.channel.send("L'id définit n'est pas un nombre")

        message.guild.bans.fetch().then(async (bans) => {
            if (bans.size == 0) return message.channel.send("aucun membre n'a été banni sur ce serveur")
            let banUser = bans.find(b => b.user.id == userID);

            if (!banUser) return message.channel.send("L'id du membre n'a pas été banni")

            await message.guild.members.unban(banUser.user, reason).catch(err => {
                console.log(err)
                message.channel.send("L'id du membre n'est pas unban")
            }).then(message.channel.send("L'id du membre a été unban"))
        })
    }
}
