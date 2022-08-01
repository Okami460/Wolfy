const discord = require("discord.js");
const db = require("quick.db")
const fs = require("fs")
const { Database } = require('quickmongo');
const mongoDBURL = require("../../botConfig/config.json").mongoDBURl;
const quickmongo = new Database(mongoDBURL);


module.exports = {
    name: "ticket",
    category: "utility",
    permissions: ['SEND_MESSAGES'],
    description: "Systeme de Ticket",
    usage: "<open/close>",
    run: async (client, message, args) => {
        let args1 = args[0]
        let time = 6000

        let logsChannelCheck = await quickmongo.fetch(`logs-${message.guild.id}`)

        let ticketCreate = ["new", "create", "add", "enable", "open"];
        let ticketClose = ["remove", "disable", "close"];
        let embedHelp = new discord.MessageEmbed()
            .setTitle("Ticket Créer")
            .setDescription("Vous venez de créer un ticket, veuillez attendre qu'un helpeur viennent vous aider\nje vous prie de bien vouloir patienter.")
            .setColor("GREEN")
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        message.delete()
        if (!args1) {
            let embed = new discord.MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`Veuillez Utiliser\n${client.config.prefix}ticket create \`(Pour créer un salon)\`\n${client.config.prefix}ticket close \`(Pour fermer votre ticket)\``)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            message.channel.send({ embeds: [embed]})
        }

        //création du ticket
        let ticketName = db.get(`ticketName_${message.author.id}_${message.guild.id}`);
        let ticketID = db.get(`ticketID_${message.author.id}_${message.guild.id}`);

        if (ticketCreate.includes(args1)) {
            if (message.channel.id === ticketID) {
                message.delete();
                message.channel.send(`vous ne pouvez pas créer de ticket dans ce salon - ${message.author}`).then(x => { setTimeout(() => { x.delete()}, time) });
            } else {
                if (!message.guild.channels.cache.find(x => x.name === ticketName)) {
                    let buttonYes = new discord.MessageButton().setStyle("SUCCESS").setCustomId("yes").setLabel("Oui");
                    let buttonNo = new discord.MessageButton().setStyle("DANGER").setCustomId("no").setLabel("Non");
                    let row = new discord.MessageActionRow().addComponents([buttonYes, buttonNo]);

                    let embed = new discord.MessageEmbed()
                        .setColor("RANDOM")
                        .setDescription("Etes vous sur de vouloir créer un ticket ?")
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                    message.channel.send({  embeds: [embed], components: [row] }).then(msg => {
                        let collect = msg.createMessageComponentCollector({ filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id, time: 30000 });

                        collect.on("collect", async (x) => {
                            x.deferUpdate();
                            if (x.customId === "yes") {
                                message.guild.channels.create(`ticket-${message.author.username}`).then(channel => {
                                    db.set(`ticketName_${message.author.id}_${message.guild.id}`, channel.name);
                                    db.set(`ticketID_${message.author.id}_${message.guild.id}`, channel.id);
                                    channel.setParent(message.channel.parentID)
                                    channel.send(`<@${message.author.id}>`)
                                    channel.send({ embeds: [embedHelp]})


                                    channel.permissionOverwrites.edit(message.author, {
                                        SEND_MESSAGES: true,
                                        VIEW_CHANNEL: true
                                    })

                                    channel.permissionOverwrites.edit(message.guild.id, {
                                        SEND_MESSAGES: false,
                                        VIEW_CHANNEL: false
                                    })

                                    let embedYes = new discord.MessageEmbed()
                                        .setColor("GREEN")
                                        .setDescription(`Votre ticket a bien été créer, vérifier le salon ${channel}`)
                                        .setTimestamp()
                                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                                    setTimeout(() => { msg.delete()}, time)
                                    message.channel.send({ embeds: [embedYes]}).then(m => { setTimeout(() => { m.delete()}, time) })
                                })
                            } else if (x.customId === "no") {
                                let embedNo = new discord.MessageEmbed()
                                    .setColor("RED")
                                    .setDescription(`Anulation du ticket...`)
                                    .setTimestamp()
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                                msg.edit({ embeds: [embedNo] }).then(x => { setTimeout(() => { x.delete()}, time) }).catch(() => { return });
                            }
                        })

                        setTimeout(() => {
                            let embedTimeout = new discord.MessageEmbed()
                                .setColor("RED")
                                .setDescription("Vous avez mis trop de temps à répondre..., réessayer plus tard")
                                .setTimestamp()
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                            msg.edit({ embeds: [embedTimeout]}).then(x => { setTimeout(() => { x.delete()}, time) }).catch(() => { return });
                        }, 30000)
                    })
                } else {
                    message.channel.send("Vous avez déjà créer un ticket")
                }
            }
        }
        //close ticket
        if (ticketClose.includes(args1)) {
            if (message.channel.id === ticketID) {

                let buttonClose = new discord.MessageButton().setStyle("SUCCESS").setCustomId("close").setLabel("Close");
                let buttonCancel = new discord.MessageButton().setStyle("DANGER").setCustomId("cancel").setLabel("Annuler");
                let row = new discord.MessageActionRow().addComponents([buttonClose, buttonCancel]);

                let embed = new discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription("Cliquez sur le bouton pour fermer votre ticket")
                    .setTimestamp()
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                message.channel.send({ embeds: [embed],  components: [row] }).then(msg => {
                    let collect1 = msg.createMessageComponentCollector({ filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id, time: 30000 })

                    collect1.on("collect", async (x) => {
                        x.deferUpdate();

                        if (x.customId === "close") {

                            x.message.edit({ content: "Suppression du Salon dans **3** secondes"}).then(() => {
                                setTimeout(() => {

                                    db.delete(`ticketName_${message.author.id}_${message.guild.id}`);
                                    db.delete(`ticketID_${message.author.id}_${message.guild.id}`);
                                    x.message.channel.delete().catch(() => { return }).then(async ch => {
                                        client.ticketTranscript.findOne({ Channel : ch.id }, async(err, data) => {
                                            if(err) throw err;
                                            if(data) {
                                                
                                                fs.writeFileSync(`./ticketLogs/${ch.id}.txt`, data.Content.join("\n\n"))

                                                if (logsChannelCheck) {

                                                    const getLogsChannel = await quickmongo.get(`logs-${message.guild.id}`)
                                                    const logsChannel = message.guild.channels.cache.get(getLogsChannel);
                                                    await logsChannel.send({ files: [new discord.MessageAttachment(fs.createReadStream(`./ticketLogs/${ch.id}.txt`))]});
                                                } else return
                                                
                                            }
                                        })
                                    });    

                                }, 3000)
                            })
                        } else if (x.customId === "cancel") {
                            let embedCancel = new discord.MessageEmbed()
                                .setColor("RED")
                                .setDescription("Annulation de la Suppression du Ticket...")
                                .setTimestamp()
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                            msg.edit({ embeds: [embedCancel]}).then(x => { setTimeout(() => { x.delete()}, time) }).catch(() => { return })
                        }
                        

                        setTimeout(() => {
                            let embedTimeout = new discord.MessageEmbed()
                                .setColor("RED")
                                .setDescription("Vous avez mis trop de temps à répondre..., réessayer plus tard")
                                .setTimestamp()
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                            msg.edit({embeds: [embedTimeout]}).then(x => { setTimeout(() => { x.delete()}, time) }).catch(() => { return });
                        }, 30000)
                    })
                })
            } else {
                message.delete().catch(() => { return });
                message.channel.send("Vous devez utiliser cette commande sur un salon Ticket !").then(x => { setTimeout(() => { x.delete()}, time) }).catch(() => { return })
            }
        }
    }
}
