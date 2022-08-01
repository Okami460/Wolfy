const { Message, Client } = require('discord.js');


module.exports = {
    name: "multiplebans",
    category: "moderation",
    permissions: ['BAN_MEMBERS'],
    usage: "<@membre> <@membre> <@membre>",
    description: "Ban un ou plusieurs membres du serveur",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    run: async(client, message, args) => {

        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send("Je n'ai pas les permissions pour bannir")
        if (!args[0]) return message.channel.send("Veuillez mentionner un  ou plusieurs membres à ban");
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.channel.send('Vous n\'avez pas les permissions "Bannir les membres"')
        
        args.forEach(async id => {

            const memberID = await getMemberID(String(id))
            const user = await client.users.fetch(memberID);
            const member = message.guild.members.cache.get(user.id);
            if (!member) return message.channel.send(`<@${memberID}> n'est pas sur le serveur`);
            if (!member.bannable) return message.channel.send(`Vous ne pouvez pas bannir <@${memberID}>`);
            try {
                await user.send(`Vous êtes banni du serveur: ${message.guild.name}`)
            } catch {
                message.channel.send(`Impossible d'envoyer le message de bannissement a <@${memberID}>`)
            }

            try {
                await member.ban({days: 7}).then(() => message.channel.send(`<@${memberID}> a été banni du serveur`))
            } catch {
                message.channel.send(`Problème rencontré lors du bannisement de <@${memberID}>`)
            }
          })
          
    }
}

function getMemberID(mention) {
	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) return;
	return matches[1]
}

