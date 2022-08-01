const Discord = require("discord.js");
const { Message, Client } = require("discord.js");
const { Database } = require("quickmongo");
const dotenv = require("dotenv")
dotenv.config()
const quickmongo = new Database(process.env.MONGODBURL);

module.exports = {
    name: "setup",
    category: "admin",
    permissions: ['ADMINISTRATOR'],
    usage: "<section_name> [value]",
    description: "Configure les paramêtres du bot",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     * @returns 
     */
    run: async (client, message, args) => {
        let choice = args[0];

        const noChoiceEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setThumbnail('https://www.autocollants-stickers.com/resize/800x800/zc/3/f/0/src/sites/mpadeco/files/products/d280.png')
            .setTitle("  Aucune Option Selectionné  ")
            .setDescription("Veuillez choisir une option à configurer !")
            .addField("\u200B", `(faite \`${client.config.prefix}setup config\` pour voir la configuration du bot)`)
            .addField("Usage", `${client.config.prefix}setup <section> [value]`)
            .addField('\u200B', "__Général__")
            .addField("👋 Salon de Bienvenue", "Section: **welcomeChannel**", true)
            .addField("🚶 Salon d'adieux", "Section: **leaveChannel**", true)
            .addField("💠 AutoRole", "Section: **autoRole**", true)
            .addField("\u200B", "__Modération__")
            .addField("🔨 Salons des Logs", "Section: **logsChannel**", true)
            .addField("👤 Role Membre", "Section: **memberRole**", true)
            .addField("🙊 Role Mute", "Section: **muteRole**", true)
            .addField("\u200B", "__Fonctionnalités__")
            .addField("🤬 Anticurse", "Section: **anticurse-enable/disable**", true)
            .addField("🚀 Levels", "Section: **levels**", true)
            .addField("🌠 Salon Levels", "Section: **levelsChannel**", true)

        if (!choice) return message.channel.send({ embeds: [noChoiceEmbed] })
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('Vous n\'avais pas les permissions "Gérer les messages"')



        /*Vérifie le status du anticurse */
        const anticurseCheck = await quickmongo.fetch(`swear-${message.guild.id}`);
        let anticurseStatus;

        if (anticurseCheck === true) {
            anticurseStatus = "`🟢 (ON)`";
        } else anticurseStatus = "`🔴 (OFF)`";


        /* vérifie le status du salon bienvenue */
        const getwelcomeChannel = await quickmongo.get(`welcome-${message.guild.id}`)
        const welcomeChannelCheck = await quickmongo.fetch(`welcome-${message.guild.id}`)
        let welcomeChannelStatus;

        if (welcomeChannelCheck) {
            welcomeChannelStatus = `<#${getwelcomeChannel}>`
        } else welcomeChannelStatus = "`Pas de salon définit`"

        /* vérifie le status du salon d'adieux */
        const getleaveChannel = await quickmongo.get(`leave-${message.guild.id}`)
        const leaveChannelCheck = await quickmongo.fetch(`leave-${message.guild.id}`)
        let leaveChannelStatus;

        if (leaveChannelCheck) {
            leaveChannelStatus = `<#${getleaveChannel}>`
        } else leaveChannelStatus = "`Pas de salon définit`"


        /*Vérifie le status du Role Membre */
        const getMemberRole = await quickmongo.get(`memberRole-${message.guild.id}`)
        const memberRoleCheck = await quickmongo.fetch(`memberRole-${message.guild.id}`)
        let memberRoleStatus;

        if (memberRoleCheck) {
            memberRoleStatus = `<@&${getMemberRole}>`
        } else memberRoleStatus = "`Pas de role définit`"


        /*Vérifie le status de l'autoRole */
        const autoRoleCheck = await quickmongo.fetch(`autoRole-${message.guild.id}`)
        let autoRoleStatus;

        if (autoRoleCheck) {
            autoRoleStatus = "`🟢 (ON)`";
        } else autoRoleStatus = "`🔴 (OFF)`";


        /*Vérifie le status du role mute */
        const getMuteRole = await quickmongo.get(`muteRole-${message.guild.id}`)
        const muteRoleCheck = await quickmongo.fetch(`muteRole-${message.guild.id}`)
        let muteRoleStatus;

        if (muteRoleCheck) {
            muteRoleStatus = `<@&${getMuteRole}>`
        } else muteRoleStatus = "`Pas de role définit`"


        /* Vérifie le statut du système de levels */
        const levelCheck = await quickmongo.fetch(`levels-${message.guild.id}`)
        let levelStatus;

        if (levelCheck === true) {
            levelStatus = "`🟢 (ON)`"
        } else levelStatus = "`🔴 (OFF)`"


        /* Vérifie le status du salon levels */
        const getLevelsChannel = await quickmongo.get(`levelsChannel-${message.guild.id}`)
        const levelsChannelCheck = await quickmongo.fetch(`levelsChannel-${message.guild.id}`)
        let levelsChannelStatus;

        if (levelsChannelCheck) {
            levelsChannelStatus = `<#${getLevelsChannel}>`
        } else levelsChannelStatus = "`Pas de salon définit`"



        /*Vérifie le status du Salon des Logs */
        const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`)
        const logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`);
        let logsChannelStatus;

        if (logsChannelCheck) {
            logsChannelStatus = `<#${getLogsChannel}>`
        } else logsChannelStatus = "`Pas de Salon définit`"


        if (choice === "welcomeChannel") {
            const welcomeChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            if (!welcomeChannel) return message.channel.send("Veuillez mentionner un salon valide")

            await quickmongo.set(`welcome-${message.guild.id}`, welcomeChannel.id)
            message.channel.send(`Le salon de bienvenue a bien été configuré sur le salon ${welcomeChannel}`)
        }


        if (choice === "leaveChannel") {
            const leaveChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            if (!leaveChannel) return message.channel.send("Veuillez mentionner un salon valide")

            await quickmongo.set(`leave-${message.guild.id}`, leaveChannel.id)
            message.channel.send(`Le salon d'adieux a bien été configuré sur le salon ${leaveChannel}`)
        }


        if (choice === "memberRole") {
            const memberRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

            if (!memberRole) return message.channel.send("Veuillez mentionner un role valide pour terminer la configuration du role membre")

            await quickmongo.set(`memberRole-${message.guild.id}`, memberRole.id);

            message.channel.send(`Le role membre a bien été configuré sur le role ${memberRole}`)
        }


        if (choice === "autoRole") {
            const query = args[1];

            if (!query) return message.channel.send("Veuillez choisir entre **enable** et **disable**")

            if (!memberRoleCheck) return message.channel.send("Veuillez configurer **memberRole** en premier")

            if (query === 'enable') {
                if (await quickmongo.fetch(`autoRole-${message.guild.id}`) === null) {
                    await quickmongo.set(`autoRole-${message.guild.id}`, true);
                    return message.channel.send("L'autoRole a bien été activé !")
                } else if (await quickmongo.fetch(`autoRole-${message.guild.id}`) === false) {
                    await quickmongo.set(`autoRole-${message.guild.id}`, true);
                    return message.channel.send("L'autoRole a bien été activé !")
                } else return message.channel.send("L'autoRole est **déjà activé**")
            }

            if (query === 'disable') {
                if (await quickmongo.fetch(`autoRole-${message.guild.id}`) === true) {
                    await quickmongo.delete(`autoRole-${message.guild.id}`);
                    return message.channel.send("L'autoRole a bien été désactivé")
                } else return message.channel.send("L'autoRole est **déjà désactivé**")
            }
        }

        if (choice === "muteRole") {
            const muteRole = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

            if (!muteRole) return message.channel.send("Veuillez mentionner un role valide pour terminer la configuration du role mute")

            await quickmongo.set(`muteRole-${message.guild.id}`, muteRole.id);

            message.channel.send(`Le role mute a bien été configuré sur le role ${muteRole}`)
        }

        if (choice === "levels") {
            const query = args[1];

            if (!query) return message.channel.send("Veuillez choisir entre **enable** et **disable**")


            if (query === 'enable') {
                if (await quickmongo.fetch(`levels-${message.guild.id}`) === null) {
                    await quickmongo.set(`levels-${message.guild.id}`, true);
                    return message.channel.send("Le système de levels a bien été activé !")
                } else if (await quickmongo.fetch(`levels-${message.guild.id}`) === false) {
                    await quickmongo.set(`levels-${message.guild.id}`, true);
                    return message.channel.send("Le système de levels a bien été activé !")
                } else return message.channel.send("Le système de levels est **déjà activé**")
            }

            if (query === 'disable') {
                if (await quickmongo.fetch(`levels-${message.guild.id}`) === true) {
                    await quickmongo.delete(`levels-${message.guild.id}`);
                    return message.channel.send("Le système de levels a bien été désactivé")
                } else return message.channel.send("Le système de levels est **déjà désactivé**")
            }
        }


        if (choice === "levelsChannel") {
            const levelsChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            if (!levelsChannel) return message.channel.send("Veuillez mentionner un salon valide")

            await quickmongo.set(`levelsChannel-${message.guild.id}`, levelsChannel.id)
            message.channel.send(`Le salon levels a bien été configuré sur le salon ${levelsChannel}`)
        }


        if (choice === "logsChannel") {
            const query = args[1]
            if (query === "delete"){
                await quickmongo.delete(`logs-${message.guild.id}`)
                message.channel.send("le salon des logs a bien été supprimé")
            } else {
                const logsChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

                if (!logsChannel) return message.channel.send("Veuillez mentionner un salon valide pour termniner la configuration du salon des logs ")
                await quickmongo.set(`logs-${message.guild.id}`, logsChannel.id)
    
                message.channel.send(`Le salon des logs a bien été configuré sur le salon ${logsChannel}`)
            }
            
        }

        if (choice === "config") {
            const configEmbed = new Discord.MessageEmbed()
                .setColor("BLUE")
                .setTitle(`⚙️ Configuration du Serveur: ${message.guild.name}`)
                .setDescription(`Vous pouvez faire \`${client.config.prefix}setup\` pour voir les noms des sections`)
                .addField("Usage", `${client.config.prefix}setup <section> [value]`)
                .addField('\u200B', "__Général__")
                .addField("👋 Salon de Bienvenue", `${welcomeChannelStatus}`, true)
                .addField("🚶 Salon d'adieux", `${leaveChannelStatus}`, true)
                .addField("💠 AutoRole", `${autoRoleStatus}`, true)
                .addField("\u200B", "__Modération__")
                .addField("🔨 Salons des Logs", `${logsChannelStatus}`, true)
                .addField("👤 Role Membre", `${memberRoleStatus}`, true)
                .addField("🙊 Role Mute", `${muteRoleStatus}`, true)
                .addField("\u200B", "__Fonctionnalités__")
                .addField("🤬 Anticurse", `\`${anticurseStatus}\``, true)
                .addField("🚀 Levels", `${levelStatus}`, true)
                .addField("🌠 Salon Levels", `${levelsChannelStatus}`, true)

            message.channel.send({ embeds: [configEmbed] })
        }
    },
};