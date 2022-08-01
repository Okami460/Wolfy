const Discord = require('discord.js');
const { Database } = require('quickmongo');
const mongoDBURL = require("../../Botconfig/config.json").mongoDBURl
const quickmongo = new Database(mongoDBURL)
const muteSchema = require('../../models/muted');


module.exports = {
    name: "unmute",
    category: "moderation",
    permissions: ['MUTE_MEMBERS'],
    usage: "<@membre> [reason]",
    description: "Unmute un membre du serveur",

    run: async (client, message, args) => {
        let reason = args.slice(1).join(" ");
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!message.member.permissions.has('MUTE_MEMBERS')) return message.channel.send('Vous n\'avais pas les permissions "Mute les membres"')
        const muteRoleCheck = await quickmongo.fetch(`muteRole-${message.guild.id}`);
        const getMuteRole = await quickmongo.get(`muteRole-${message.guild.id}`);
        let muteRole;

        if (muteRoleCheck) {
            muteRole = message.guild.roles.cache.get(getMuteRole);
        } else return message.channel.send("Impossible de trouvé le role mute")

        if (!reason) reason = 'Pas de raison';

        if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.channel.send("Je n'ai pas les permissions 'gérer les roles'")

        if (!args[0]) return message.channel.send("Veuillez indiqué un membre a mute");
        if (!mentionedMember) return message.channel.send("Le membre mentionné n'est pas dans le serveur");


        if (mentionedMember.user.id == message.author.id) return message.channel.send("Vous ne pouvez pas vous unmute vous même")
        if (mentionedMember.user.id === client.user.id) return ("Vous ne pouvez pas me unmute moi !")
        if (!mentionedMember.roles.cache.has(muteRole.id)) return ("Ce membre n'est pas mute")
        //if (message.member.roles.highest.position <= mentionedMember.roles.highest.position) return message.channel.send("Vous ne pouvez pas unmute un membre qui possède un roles plus élevé que vous !");

        try {
            await mentionedMember.roles.remove(muteRole);
            muteSchema.findOne({ Guild : message.guild.id }, async (err, data) => {
                if (!data) return message.channel.send("Le membre n'est pas mute")

                const user = data.Users.findIndex(props => props === mentionedMember.id);
                if (user == -1) return message.channel.send("Le membre n'est pas mute")
                data.Users.splice(user, 1);
                data.save();
                await mentionedMember.send(`Vous êtes unmute du serveur ${message.guild.name} pour raison: ${reason}`)
                message.channel.send(`${mentionedMember} a bien été unmute pour raison: ${reason}`)
            })
        } catch (err) {
            console.log(err)
            message.channel.send("Une erreur c'est produit en enlevant le role mute au membre")
        }
    }
}