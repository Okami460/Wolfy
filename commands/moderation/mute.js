const { Message, Client } = require("discord.js");
const { Database } = require('quickmongo');
const mongoDBURL = require("../../Botconfig/config.json").mongoDBURl
const quickmongo = new Database(mongoDBURL);
const muteSchema = require('../../models/muted');

module.exports = {
    name: "mute",
    category: "moderation",
    permissions: ['MUTE_MEMBERS'],
    usage: "<@membre> [reason]",
    description: "Mute un membre du serveur",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        let reason = args.slice(1).join(" ");
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!message.member.permissions.has('MUTE_MEMBERS')) return message.channel.send('Vous n\'avais pas les permissions "Mute les membres"')
        const muteRoleCheck = await quickmongo.fetch(`muteRole-${message.guild.id}`);
        const getMuteRole = await quickmongo.get(`muteRole-${message.guild.id}`);
        let muteRole;

        if (!reason) reason = 'Pas de raison';

        if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.channel.send("Je n'ai pas les permissions 'gérer les roles'")

        if (!args[0]) return message.channel.send("Veuillez indiqué un membre a mute");
        if (!mentionedMember) return message.channel.send("Le membre mentionné n'est pas dans le serveur");

        if (muteRoleCheck) {
            muteRole = message.guild.roles.cache.get(getMuteRole);
        } else return message.channel.send("Impossible de trouvé le role mute, veuillez le configurer")

        if (mentionedMember.user.id == message.author.id) return message.channel.send("Vous ne pouvez pas vous mute vous même")
        if (mentionedMember.user.id === client.user.id) return ("Vous ne pouvez pas me mute moi !")
        if (mentionedMember.roles.cache.has(muteRole.id)) return ("Ce membre est déjà mute")
        //if (message.member.roles.highest.position <= mentionedMember.roles.highest.position) return message.channel.send("Vous ne pouvez pas mute un membre qui possède un roles plus élevé que vous !");
        try {
            await mentionedMember.roles.add(muteRole);
            muteSchema.findOne({ Guild : message.guild.id }, async (err, data) => {
                if (!data) {
                    new muteSchema({
                        Guild: message.guild.id,
                        Users: mentionedMember.id,
                    }).save();
                } else {
                    data.Users.push(mentionedMember.id);
                    data.save();
                }
            })

            await mentionedMember.send(`Vous êtes mute du serveur ${message.guild.name} pour raison: ${reason}`)
            message.channel.send(`${mentionedMember} a bien été mute pour raison: ${reason}`)
        } catch (err) {
            console.log(err)
            message.channel.send("Une erreur c'est produit en mettant le role mute au membre")
        }
    }
}