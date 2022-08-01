const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'warnlist',
    usage: "<@member>",
    permissions: ['MANAGE_CHANNELS'],
    description: "permet de voir le nombre d'avertissements d'un utilisateur",
    run : async(client, message, args) => {
        if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas les permissions')
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return message.channel.send('Utilisateur non trouvé')
        db.findOne({ guildid: message.guild.id, user: user.user.id}, async(err, data) => {
            if(err) throw err;
            if(data) {
                message.channel.send({ embeds: [new MessageEmbed()
                    .setTitle(`${user.user.tag} Avertissements`)
                    .setDescription(
                        data.content.map(
                            (w, i) => 
                            `\`${i + 1}\` | Modérateur : ${message.guild.members.cache.get(w.moderator).user.tag}\nRaison : ${w.reason}`
                        ).join('\n')
                    )
                    .setColor("BLUE")
                ]})
            } else {
                message.channel.send('L\'utilisateur n\' a pas reçu d\'avertissement')
            }

        })
    }
}