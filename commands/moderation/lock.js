const {Discord, Message, Client } = require('discord.js');
const { Database } = require("quickmongo")
const mongoDBURL = require("../../botConfig/config.json").mongoDBURl
const quickmongo = new Database(mongoDBURL);


module.exports = {
    name: "lock",
    category: "moderation",
    permissions: ['MANAGE_CHANNELS'],
    usage: "<@membre> [reason]",
    description: "verrouille un salon",

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async(client, message, args) => {

        const memberRoleCheck = await quickmongo.fetch(`memberRole-${message.guild.id}`);
        const getMemberRole = await quickmongo.get(`memberRole-${message.guild.id}`);
        let memberRole;

        if (memberRoleCheck) {
            memberRole = message.guild.roles.cache.get(getMemberRole);
        } else return message.channel.send("MemberRole non configuré");

        if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send("vous n'avez pas les permissions");
        if (!args[0]) return message.channel.send("Veuillez mentionner un salon à verouiller");
        if (!message.mentions.channels.first()) return message.channel.send("Vous devez mentionner un salon valide");

        await message.mentions.channels.forEach( async channel => {
            if (channel.name.startsWith("🔒")) return message.channel.send(`<#${channel.id}> est déjà verouiller`);

            await channel.setName(`🔒 ${channel.name}`);
            

            try {
                channel.permissionOverwrites.edit(memberRole, {
                    VIEW_CHANNEL: true,
                    READ_MESSAGE_HISTORY: true,
                    SEND_MESSAGES: false,
                });

                message.channel.send("Salon verouiller avec succès !")
            } catch (err) {
                console.log(err);

                message.channel.send("Problème lors du verouillage du salon")
            }
        })
    }

}