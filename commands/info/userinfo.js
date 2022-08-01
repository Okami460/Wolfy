const { MessageEmbed } = require('discord.js')
const moment = require('moment')
moment.locale('FRA')

module.exports = {
    name: "userinfo",
    aliases: ["user-info"],
    category: "info",
    permissions: ['SEND_MESSAGES'],
    description: "Affiche les informations d'un utilisateur ou de vous même",
    run: async (client, message, args) => {

        const member = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.displayName.toLowerCase() === args.join(" ").toLowerCase()) || message.member

        const status = {
            online: '🟢:- En ligne',
            idle: '🟡:- Inactif',
            dnd: '🔴:- Ne pas déranger',
            offline: '⚫:- Hors-ligne'
        }

        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`Information sur ${member.user.username}`, member.user.displayAvatarURL())
        .setThumbnail(member.user.displayAvatarURL({dynamic: true, size: 512}))
        .addField('<a:RightA:1002344751099564134> **Nom Utilisateur**', `${member.user.username}#${member.user.discriminator}`)
        .addField('<a:RightA:1002344751099564134> **ID de l\'Utilisateur**', `${member.id}`)
        .addField('<a:RightA:1002344751099564134> **Status**', `${status[member.presence.status]}`)
        .addField('<a:RightA:1002344751099564134> **Compte créé**', `${moment.utc(member.user.createdAt).format('DD/MM/YYYY')}`)
        .addField('<a:RightA:1002344751099564134> **A Rejoint le Serveur**', `${moment.utc(member.joinedAt).format('DD/MM/YYYY')}`)
        .addField('<a:RightA:1002344751099564134> **Salon Vocale**', member.voice.channel ? member.voice.channel.name + `(${member.voice.channel.id})` : 'N\'est pas dans un salon vocale')
        .addField('<a:RightA:1002344751099564134> **Roles**', `${member.roles.cache.map(role => role.toString())}`, true)

        message.channel.send({embeds: [embed]})
    }
}