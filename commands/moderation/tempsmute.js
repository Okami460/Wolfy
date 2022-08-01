const Discord = require('discord.js');
const { Database } = require('quickmongo');
const mongoDBURL = require("../../Botconfig/config.json").mongoDBURl
const quickmongo = new Database(mongoDBURL);
const muteSchema = require('../../models/muted');
const ms = require("ms")

module.exports = {
    name: "tempsmute",
    category: "moderation",
    permissions: ['MUTE_MEMBERS'],
    usage: "<@membre> <temps(s/m/h/d/y)> [reason]",
    description: "tempsmute un membre du serveur",

    run: async (client, message, args) => {
        let time = args[1];
        let reason = args.slice(2).join(" ");
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!message.member.permissions.has('MUTE_MEMBERS')) return message.channel.send('Vous n\'avais pas les permissions "Mute les membres"')
        const muteRoleCheck = await quickmongo.fetch(`muteRole-${message.guild.id}`);
        const getMuteRole = await quickmongo.get(`muteRole-${message.guild.id}`);
        let muteRole;

        if (!reason) reason = 'Pas de raison';

        if (!message.guild.me.permissions.has('MANAGE_ROLES')) return message.channel.send("Je n'ai pas les permissions 'gérer les roles'")

        if (!args[0]) return message.channel.send("Veuillez indiqué un membre a tempsmute");
        if (!mentionedMember) return message.channel.send("Le membre mentionné n'est pas dans le serveur");

        if (muteRoleCheck) {
            muteRole = message.guild.roles.cache.get(getMuteRole);
        } else return message.channel.send("Impossible de trouvé le role mute")

        if (mentionedMember.user.id == message.author.id) return message.channel.send("Vous ne pouvez pas vous tempsmute vous même")
        if (mentionedMember.user.id === client.user.id) return ("Vous ne pouvez pas me tempsmute moi !")
        if (mentionedMember.roles.cache.has(muteRole.id)) return ("Ce membre est déjà tempsmute")
        //if (message.member.roles.highest.position <= mentionedMember.roles.highest.position) return message.channel.send("Vous ne pouvez pas tempsmute un membre qui possède un roles plus élevé que vous !");


        try {
            await mentionedMember.roles.add(muteRole)
            muteSchema.findOne({ Guild: message.guild.id }, async (err, data) => {
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
            mentionedMember.send(`Vous avez été tempsmute du serveur ${message.guild.name} pendant ${time} pour raison: ${reason}`)

            setTimeout(async function () {
                muteSchema.findOne({ Guild: message.guild.id }, async (err, data) => {
                    const user = data.Users.findIndex(props => props === mentionedMember.id);
                    if (user == -1) return message.channel.send("Le membre n'est pas mute")
                    data.Users.splice(user, 1);
                    data.save();

                    await mentionedMember.roles.remove(muteRole)
                    mentionedMember.send(`Vous n'êtes plus tempsmute du serveur ${message.guild.name} pour raison: ${reason}, vous été mute pendant pendant ${time} `)
                });
            }, ms(time));
        } catch (err) {
            console.log(err)
            message.channel.send("Une erreur c'est produit en mettant le role mute au membre")
        }
    }
}