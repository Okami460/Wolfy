const { MessageEmbed } = require('discord.js')
const moment = require('moment')
moment.locale('FRA')

module.exports = {
    name: "serverinfo",
    aliases: ["server-info"],
    category: "info",
    permissions: ['SEND_MESSAGES'],
    description: "Affiche les informations sur le serveur",
    run: async (client, message, args) => {

        const icon = message.guild.iconURL() 
        const roles = message.guild.roles.cache.map(e => e.toString()) 
        const emojis = message.guild.emojis.cache.map(e => e.toString()) 
        const emojicount = message.guild.emojis.cache
        const members = message.guild.members.cache 
        const create = message.guild.createdAt.toLocaleDateString()

        const status = {
            online: '🟢:- En ligne',
            idle: '🟡:- Inactif',
            dnd: '🔴:- Ne pas déranger',
            offline: '⚫:- Hors-ligne'
        }


        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Informations sur le Serveur')
            .setThumbnail(`${icon}`)
            .addField('Propriétaire:-', `<@${message.guild.ownerId}>`)
            .addField('ID du Serveur:-', `${message.guild.id}`)
            .addField('Date de Création:-', `${create}`)
            .addField('Nombre de boost:-', `${message.guild.premiumSubscriptionCount}`)
            .addField('Boost Level:-', `${message.guild.premiumTier}`)

            .addField('Nombre de Membre:-', `${members.size}\n${members.filter(member => !member.user.bot).size}(Membre)\n${members.filter(member => member.user.bot).size}(BOT)`)
            //.addField('Stats Membre:-', `${message.guild.members.cache.find(member => member.presences.status == 'online').size}:-🟢\n${message.guild.members.cache.find(member => member.presences.status == 'idle').size}:-🟡\n${message.guild.members.cache.find(member => member.presences.status == 'dnd').size}:-🔴\n${message.guild.members.cache.find(member => member.presences.status == 'offline').size}:-⚫\n`)
            .addField('Role le plus élevé:-', `${message.guild.roles.highest}`)
            .addField('Roles:-', `${roles}`, true)
            .addField('Nombre d\'Emojis:-', `${emojicount.size}\n${emojicount.filter(emoji => !emoji.animated).size}(Non animé)\n${emojicount.filter(emoji => emoji.animated).size}(Animé)`)
            //.addField('Emojis:-', `${emojis}`, true)

            .addField('Stats Serveur:-', `${message.guild.channels.cache.filter(channel => channel.type == 'text').size}⌨️\n${message.guild.channels.cache.filter(channel => channel.type == 'voice').size}🔈\n${message.guild.channels.cache.filter(channel => channel.type == 'news').size}📢\n${message.guild.channels.cache.filter(channel => channel.type == 'category').size}📁`)
            .setFooter('Info Serveur', icon)

        message.channel.send({ embeds: [embed]})
    }
}