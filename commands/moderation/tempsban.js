const { Message, Client} = require('discord.js');
const ms = require("ms")

module.exports = {
    name: "tempsban",
    category: "moderation",
    permissions: ['BAN_MEMBERS'],
    usage: "<@membre> <temps(s/m/h/d/y)> [reason]",
    description: "tempsban un membre du serveur",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    run: async (client, message, args) => {
        let reason = args.slice(2).join(" ");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let time = args[1]
        

        if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('Vous n\'avez pas les permissions "Bannir les membres"')
        //if (member.user.id === message.author.id) return message.channel.send("Vous ne pouvez pas vous bannnir vous même")
        if (!reason) reason = "Pas de raison"
        
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send("Je n'ai pas les permissions pour bannir")
        if (!args[0]) return message.channel.send("Veuillez mentionner un membre à ban");
        if (!member) return message.channel.send("Le membre mentionné n'est pas sur le serveur");
        if(!time) return message.channel.send('Veuillez spécifier un temps')
        if (!member.bannable) return message.channel.send("Vous ne pouvez pas bannir ce membre");

        try {
            await member.send(`Vous êtes banni du serveur: ${message.guild.name} pour raison: ${reason} pendant: ${time}`)
        } catch {
            message.channel.send("Impossible d'envoyer le message de bannissement au membre")
        }

        try {
            await member.ban()

            setTimeout(async () => {
                await message.guild.members.unban(member)
                await member.send(`Vous êtes unban du serveur ${message.guild.name} pour raison: ${reason}, après ${time} de ban`).catch(() => {})
                message.channel.send(`<@${member.user.id}> a été unban après ${time} de ban.`)
            }, ms(time))
        } catch {
            message.channel.send("Problème rencontré lors du bannisement du membre")
        }
    }
}