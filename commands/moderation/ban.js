const { Message, Client } = require('discord.js');

module.exports = {
    name: "ban",
    category: "moderation",
    permissions: ['BAN_MEMBERS'],
    usage: "<@membre> [reason]",
    description: "Ban un membre du serveur",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    run: async(client, message, args) => {
        let reason = args.slice(1).join(" ");
        const mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('Vous n\'avez pas les permissions "Bannir les membres"')
        //if (mentionMember.user.id === message.author.id) return message.channel.send("Vous ne pouvez pas vous bannnir vous même")
        if (!reason) reason = "Pas de raison"
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send("Je n'ai pas les permissions pour bannir")
        if (!args[0]) return message.channel.send("Veuillez mentionner un membre à ban");
        if (!mentionMember) return message.channel.send("Le membre mentionné n'est pas sur le serveur");
        if (!mentionMember.bannable) return message.channel.send("Vous ne pouvez pas bannir ce membre");

        try {
            await mentionMember.send(`Vous êtes banni du serveur: ${message.guild.name} pour raison: ${reason}`)
        } catch {
            message.channel.send("Impossible d'envoyer le message de bannissement au membre")
        }

        try {
            await mentionMember.ban({
                reason: reason,
            }).then(() => message.channel.send(`${mentionMember} a été banni du serveur pour raison: ${reason}`))
            
        } catch {
            message.channel.send("Problème rencontré lors du bannisement du membre")
        }
    }
}