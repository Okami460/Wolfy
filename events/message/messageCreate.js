const client = require("../../index")
const discord = require("discord.js")
const prefix = client.config.prefix
const afk = require("../../models/afk")
const badwords = require("../../botConfig/assets/badwords.json").badwords
const moment = require("moment")
const mongoose = require("mongoose")
const { Database } = require("quickmongo");
const dotenv = require("dotenv")
dotenv.config()
const quickmongo = new Database(process.env.MONGODBURL);
const Levels = require("discord-xp")
Levels.setURL(process.env.MONGODBURL)
const db = require("quick.db")
const  translate  = require("@vitalets/google-translate-api")
const fetch = require("node-fetch")
const customCommands = require("../../models/custom-commands")
const fs = require("fs")


client.on("messageCreate", async message => {

    if (message.author.bot) return;
    if (message.channel.type === "DM") return;
    if (!message.guild) return


    /* système de levels */
    if (await quickmongo.fetch(`levels-${message.guild.id}`) === true) {
        const randomAmoutXP = Math.floor(Math.random() * 29) + 1 // Min: 1 Max: 30
        const hasLevelUP = await Levels.appendXp(message.author.id, message.guild.id, randomAmoutXP)
        if (hasLevelUP) {
            const user = await Levels.fetch(message.author.id, message.guild.id)

            const levelsEmbed = new discord.MessageEmbed()
                .setColor("GREEN")
                .setTitle("🚀 LEVEL UP !")
                .setDescription(`Félicitations ${message.author}, tu es passé au Level **${user.level}**`)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

            const levelsChannelCheck = await quickmongo.fetch(`levelsChannel-${message.guild.id}`)

            if (levelsChannelCheck) {
                const getLevelsChannel = await quickmongo.get(`levelsChannel-${message.guild.id}`)
                const levelsChannel = message.guild.channels.cache.get(getLevelsChannel)
                levelsChannel.send({ embeds: [levelsEmbed] })
            } else {
                message.channel.send({ embeds: [levelsEmbed] })
            }
        }
    }

    /*système anticurse */

    if (await quickmongo.fetch(`swear-${message.guild.id}`) === true) {
        for (let i = 0; i < badwords.length; i++) {
            if (message.content.includes(badwords[i])) {
                message.delete()
                message.channel.send("Vous avez utiliser un mot innaproprier").then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000)
                })
            }
        }
    }


    /* systeme AFK */
    if (message.mentions.members.first()) {
        const afklist = await afk.findOne({ userID: message.mentions.members.first().id, serverID: message.guild.id })
        if (afklist) {
            await message.guild.members.fetch(afklist.userID).then(member => {
                let user_tag = member.user.tag
                return message.channel.send(`**${afklist.oldNickname || user_tag || member.user.username}** est actuellement AFK: ${afklist.reason} - **${moment(afklist.time)}** `).catch(() => { })
            })
        }
    }


    const afklis = await afk.findOne({ userID: message.author.id, serverID: message.guild.id })

    if (afklis) {
        let nickname = `${afklis.oldNickname}`
        message.member.setNickname(nickname).catch(() => { })
        await afk.deleteOne({ userID: message.author.id })

        const afkEmbed = new discord.MessageEmbed()
            .setColor("GREEN")
            .setDescription(`Il semble que tu sois revenue! J'ai supprimé votre status AFK\n\n**Raison AFK: ${afklis.reason}**`)
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp()
        return message.channel.send({ embeds: [afkEmbed] }).then(m => {
            setTimeout(() => {
                m.delete().catch(() => { })
            }, 3000)
        })
    }



    if (!message.content.startsWith(prefix)) return;
    if (!message.guild) return;


    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const cmd = args.shift().toLowerCase()
    if (cmd.length == 0) return;
    let command = client.commands.get(cmd)
    if (!command) command = client.commands.get(client.aliases.get(cmd))



    const data = await customCommands.findOne({ Guild: message.guild.id, Command: cmd })
    if (data) return message.channel.send(data.Response)


    const PermissionsFlags = [
        'ADMINISTRATOR',
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS_AND_STICKERS',
        'USE_APPLICATION_COMMANDS',
        'REQUEST_TO_SPEAK',
        'MANAGE_EVENTS',
        'MANAGE_THREADS',
        'USE_PUBLIC_THREADS',
        'CREATE_PUBLIC_THREADS',
        'USE_PRIVATE_THREADS',
        'CREATE_PRIVATE_THREADS',
        'USE_EXTERNAL_STICKERS',
        'SEND_MESSAGES_IN_THREADS',
        'START_EMBEDDED_ACTIVITIES',
        'MODERATE_MEMBERS'
    ];

    if (command.permissions.length) {
        let invalidPermissionsFlags = []
        for (const permission of command.permissions) {
            if (!PermissionsFlags.includes(permission)) {
                return console.log(`Permissions Invalide : ${permission}`)
            }

            if (!message.member.permissions.has(permission)) {
                invalidPermissionsFlags.push(permission)
            }
        }

        if (invalidPermissionsFlags.length) {
            const noPermissionEmbed = new discord.MessageEmbed()
                .setColor("RED")
                .setTitle("PERMISSION INVALIDE")
                .setDescription("vous n'avez pas les permissions")
                .addField("Permission(s) requise", `\`${invalidPermissionsFlags}\``)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setTimestamp()

            return message.channel.send({ embeds: [noPermissionEmbed] })

        }
    }

    if (command) {
        let commandFetch = db.fetch(`commandToggle_${message.guild.id}`)
        if (commandFetch == null) commandFetch = []
        if (commandFetch.includes(command.name)) return message.channel.send("Cette commande est désactiver")
        command.run(client, message, args)
    }
})


/* ChatBot */
client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (message.channel.type === "DM") return;
    if (!message.guild) return

    const channel = db.fetch(`chatbotchannel_${message.guild.id}`)
    if (message.author.bot) return
    if (message.channel.type === 'dm') return
    if (message.channel.id === channel) {
        if (message.attachments.size > 0) return message.reply('Je ne peux pas lire les images')
        else {
            translate(message.content, { to: "en" }).then(msg => {
                fetch(`http://api.brainshop.ai/get?bid=158772&key=9mvRFoPQfcj4YA4R&uid=[uid]&msg=${encodeURIComponent(msg.text)}`).then(res => res.json())
                    .then(data => {
                        translate(data.cnt, { to: "fr" }).then(trad => {
                            message.channel.send(`> ${message}\n${trad.text}`)

                        })
                    })
            })

        }
    } else if (channel === null) return
})



/* Antispam */
const  userMap = new Map();
const LIMIT = 5;
const TIMER = 7000;
const DIFF = 3000;
client.on("messageCreate", async (message) => {

    if (message.author.bot) return;
    if (message.channel.type === "DM") return;
    if (!message.guild) return

    if (db.has(`antispam-${message.guild.id}`) === false) return
    if (userMap.has(message.author.id)) {
        const userData = userMap.get(message.author.id);
        const { lastMessage, timer } = userData
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = userData.msgCount;

        if (difference > DIFF) {
            clearTimeout(timer);
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => {
                userMap.delete(message.author.id);
            }, TIMER)
            userMap.set(message.author.id, userData)
        }
        else {
            ++msgCount;
            if (parseInt(msgCount) === LIMIT) {
                const getMuteRole = await quickmongo.get(`muteRole-${message.guild.id}`);
                let muteRole = message.guild.roles.cache.get(getMuteRole);
                if (!muteRole) return message.channel.send("Veuillez configurer le muteRole")
                message.member.roles.add(muteRole)
                message.channel.send("vous avez été mute")
                setTimeout(() => {
                    message.member.roles.remove(muteRole);
                    message.channel.send("vous êtes unmute")
                }, TIMER)

            }else {
                userData.msgCount = msgCount
                userMap.set(message.author.id, userData)
            }
        }
    } else {
        let fn = setTimeout(() => {
            userMap.delete(message.author.id);

        }, TIMER)
        userMap.set(message.author.id, {
            msgCount: 1,
            lastMessage: message,
            timer: fn
        });
    }
})


/*Transcript Ticket */


client.ticketTranscript = mongoose.model('transcripts', 
    new mongoose.Schema({
        Channel : String,
        Content : Array
    })
)

client.on('messageCreate', async(message) => {
    client.ticketTranscript.findOne({ Channel : message.channel.id }, async(err, data) => {
        if(err) throw err;
        if(data) {
           data.Content.push(`${message.author.tag} : ${message.content}`) 
        } else {
            data = new client.ticketTranscript({ Channel : message.channel.id, Content: `${message.author.tag} : ${message.content}`})
        }
        await data.save()
            .catch(err =>  console.log(err))
    })

})


client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (message.channel.type === "DM") return
    if (!message.guild) return
    if (!fs.existsSync(`./messageLeaderboard/${message.guild.id}.json`))  {
        fs.writeFileSync(`./messageLeaderboard/${message.guild.id}.json`, JSON.stringify({}), err => {
        if (err) {
            console.log(err);

        }
    })
}    else {

        const messages = require(`../../messageLeaderboard/${message.guild.id}.json`);
        if (!messages[message.author.id]) {
            messages[message.author.id]= {
                messages: 0,
                ping: message.author.toString()
            }
        }

        messages[message.author.id] = {
            messages: parseFloat(messages[message.author.id].messages) + 1,
            ping: message.author.toString()
        }

        fs.writeFileSync(`./messageLeaderboard/${message.author.id}.json`, JSON.stringify(messages), err  => {
            if (err) {
                console.log(err)
            }
        })
    }
})



