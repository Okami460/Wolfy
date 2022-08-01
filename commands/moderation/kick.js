
module.exports = {
    name: "kick",
    category: "moderation",
    permissions: ['KICK_MEMBERS'],
    usage: "<@membre> [reason]",
    description: "Kick un membre du serveur",

    run: async(client, message, args) => {
        let reason = args.slice(1).join(" ");
        const mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!message.member.permissions.has('KICK_MEMBERS')) return message.channel.send('Vous n\'avais pas les permissions "Kick les membres"')
        //if (mentionMember.user.id === message.author.id) return message.channel.send("Vous ne pouvez pas vous kick vous même")
        if (!reason) reason = "Pas de raison"
        if (!message.guild.me.permissions.has("KICK_MEMBERS")) return message.channel.send("Je n'ai pas les permissions pour bannir")
        if (!args[0]) return message.channel.send("Veuillez mentionner un membre à kick");
        if (!mentionMember) return message.channel.send("Le membre mentionné n'est pas sur le serveur");
        if (!mentionMember.bannable) return message.channel.send("Vous ne pouvez pas kick ce membre");

        try {
            await mentionMember.send(`Vous êtes kick du serveur: ${message.guild.name} pour raison: ${reason}`)
        } catch {
            message.channel.send("Impossible d'envoyer le message de bannissement au membre")
        }

        try {
            await mentionMember.kick().then(() => message.channel.send(`${mentionMember} a été kick du serveur pour raison: ${reason}`))
        } catch {
            message.channel.send("Problème rencontré lors de l'expulsion du membre")
        }
    }
}