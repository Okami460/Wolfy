const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name :'warn',
    category: "moderation",
    usage: "<@member> [reason]",
    permissions: ['MANAGE_CHANNELS'],
    description: "permet d'avertir un utilisateur",
    run : async(client, message, args) => {
        if(!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('Vous n\'avez pas les permissions')
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return message.channel.send('Utilisateur non trouvé')
        let reason = args.slice(1).join(" ")
        if (!reason) reason = "Pas de raison"
        db.findOne({ guildid: message.guild.id, user: user.user.id}, async(err, data) => {
            if(err) throw err;
            if(!data) {
                data = new db({
                    guildid: message.guild.id,
                    user : user.user.id,
                    content : [
                        {
                            moderator : message.author.id,
                            reason : reason
                        }
                    ]
                })
            } else {
                const obj = {
                    moderator: message.author.id,
                    reason : reason
                }
                data.content.push(obj)
                console.log(data.content.length)
            }
            data.save()
        });
        user.send({ embeds: [new MessageEmbed()
            .setDescription(`Vous avez été warn par ${message.author} sur le serveur ${message.guild.name}\nraison: ${reason ? reason : "pas de raison"}`)
            .setColor("RED")
        ]})
        message.channel.send({ embeds: [new MessageEmbed()
            .setDescription(`${user} Avertit pour: ${reason}`).setColor('BLUE')
        ]})
    }
}