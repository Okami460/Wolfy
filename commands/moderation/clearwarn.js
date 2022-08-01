const db = require('../../models/warns')

module.exports = {
    name : 'clear-warns',
    usage: "<@membre>",
    permissions: ['MANAGE_CHANNELS'],
    description: "Supprime les avertissements d'un utilisateur",
    run : async(client, message, args) => {
        if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas les permissions')
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.channel.send('Utilisateur non trouvé')
        db.findOne({ guildid : message.guild.id, user: user.user.id}, async(err,data) => {
            if(err) throw err;
            if(data) {
                await db.findOneAndDelete({ user : user.user.id, guildid: message.guild.id})
                message.channel.send(`Suppression de tout les avertissements de ${user.user.tag} `)
            } else {
                message.channel.send('Cette utilisateur n\'a pas reçu d\'avertissements')
            }
        })
    }
}