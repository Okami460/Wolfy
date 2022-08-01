const db = require('../../models/warns')

module.exports = {
    name: 'remove-warn',
    category: "moderation",
    usage: "<@membre> <nombre>",
    permissions: ['MANAGE_CHANNELS'],
    run : async(client, message, args) => {
        if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas les permissions')
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.channel.send('Utilisateur non trouvé')
        db.findOne({ guildid : message.guild.id, user: user.user.id}, async(err,data) => {
            if(err) throw err;
            if(data) {
                let number = parseInt(args[1]) - 1
                data.content.splice(number, 1)
                message.channel.send('Avertissement supprimé')
                data.save()
            } else {
                message.channel.send('Cette utilisateur n\'a pas reçu d\'avertissement')
            }
        })
    }
}