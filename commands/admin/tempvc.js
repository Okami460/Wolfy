const { MessageEmbed} = require("discord.js")
const mongoose = require("mongoose")
const { voice } = require("../..")
const Vc = require("../../models/tempvc")

module.exports = {
    name: "tempvc",
    category: "admin",
    permissions: ["MANAGE_CHANNELS"],
    usage: "<enable/disable>",
    run: async (client, message, args) => {
        let vcDB = await Vc.findOne({ guildID: message.guild.id }, async (error, data) => {
            if (!data) {
                new Vc({
                    guildID: message.guild.id,
                    channelId: null,
                    categoryId: null
                }).save()
            }
        })

        let properUsage = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`__**Utilisation correcte**__\n1- ${client.config.prefix}tempvc enable \n2- ${client.config.prefix}tempvc disable\n\n__**Exemples:**__\n1- ${client.config.prefix} tempvc enable\n2- ${client.config.prefix}tempvc disable`)

        if (!args[0]) return message.channel.send({ embeds: [properUsage] })

        if (args[0] === "disable") {

            if (!vcDB.channelID || !vcDB.categoryID || !vcDB.guildID || !vcDB.channelID === null) return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`Temp Vc est déjà désactivé!`)
                ]
            });
            await Vc.findOne({
                guildID: message.guild.id
            }, async (err, guild) => {

                let voiceID = guild.channelID
                let categoryID = guild.categoryID

                let voice = message.client.channels.cache.get(voiceID)
                if (voice) voice.delete().catch(() => { })

                let category = message.client.channels.cache.get(categoryID)
                if (category) category.delete().catch(() => { })

                if (!guild) {
                    Vc.create({
                        guildID: message.guild.id,
                        channelID: voiceID,
                        categoryID: categoryID
                    })

                    return;
                } else {
                    guild.updateOne({
                        channelID: voiceID,
                        categoryID: categoryID
                    }).catch(err => console.error(err));
                }


                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`J'ai désactivé le chat vocal temporaire`)
                    ]
                });
            });
            return;
        } else if (args[0] === "enable") {

            try {

                const embed = new MessageEmbed()
                    .setAuthor(`Chargement...`, `https://www.creeda.co.in/Images/loader.gif`)
                    .setDescription(`\`Mise en place...\``)
                    .setColor("GREEN");
                const msg = await message.channel.send({ embeds: [embed] });



                let category = message.guild.channels.cache.find(c => c.name.toLowerCase() == "join to create" && c.type == "GUILD_CATEGORY");
                setTimeout(async () => {
                    if (!category) {
                        await embed
                            .setDescription(`**Catégorie créée**`)

                            .setTimestamp();
                        msg.edit({ embeds: [embed] }) + message.guild.channels.create(`Join to Create`, {
                            type: 'GUILD_CATEGORY', permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    allow: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: message.author.id,
                                    allow: ['VIEW_CHANNEL'],
                                },
                            ]
                        })
                        return;
                    } else {
                        embed
                            .setDescription(`**Catégorie trouvé**\n\nID: ${category.id}`)

                            .setTimestamp();
                        msg.edit({ embeds: [embed] });

                    }
                }, 2000)

                let voice = message.guild.channels.cache.find(c => c.name.toLowerCase() == "🐺 - rejoindre  pour créer" && c.type == "GUILD_VOICE");


                setTimeout(async () => {
                    if (!voice) {

                        await embed
                            .setDescription(`**Salon vocale créer**`)

                            .setTimestamp();
                        msg.edit({ embeds: [embed] });
                        + message.guild.channels.create('🐺 - rejoindre  pour créer', {
                            type: 'GUILD_VOICE', permissionOverwrites: [
                                {
                                    id: message.guild.id,
                                    deny: ['VIEW_CHANNEL'],
                                },
                                {
                                    id: message.author.id,
                                    allow: ['VIEW_CHANNEL'],
                                },
                            ]
                        }).then((s) => {
                            if (!category) return
                            s.setParent(category.id).catch(() => { })
                        })

                        return;
                    } else {
                        embed
                            .setDescription(`**salon vocale trouvé**\n\nID: ${voice.id}`)

                            .setTimestamp();
                        msg.edit({ embeds: [embed] })

                    };
                }, 2000)

                setTimeout(async () => {

                    if (!voice || !category) {
                        embed
                            .setAuthor(`Setup Fail`)
                            .setDescription(`Veuillez exécuter à nouveau ${client.config.prefix}tempvc on`)

                            .setTimestamp();
                        msg.edit({ embeds: [embed] });
                        await Vc.findOne({
                            guildID: message.guild.id
                        }, async (err, guild) => {
                            if (!guild) {
                                Vc.create({
                                    guildID: message.guild.id,
                                    channelID: guild.channelID,
                                    categoryID: guild.categoryID
                                })

                                return;
                            } else {
                                guild.updateOne({
                                    channelID: guild.channelID,
                                    categoryID: guild.categoryID
                                }).catch(err => console.error(err));
                            }


                        })

                        return;
                    } else {
                        let channelVoice = message.client.channels.cache.get(voice.id)
                        let channelInv = await channelVoice.createInvite({
                            maxAge: 0,
                            maxUses: 0
                        }).catch(() => { })
                        voice.setParent(category.id);
                        embed
                            .setAuthor(`Set Up Done!`, `${channelInv}`)
                            .setDescription(`**Catégorie** ${category.name}\n**Catégorie ID:** ${category.id}\n\n**Salon vocale** Configuration terminée, vous pouvez continuer et modifier les chaînes!\n\nPour désactiver, vous pouvez utiliser ${client.config.prefix}tempvc off\` `)

                            .setTimestamp();
                        msg.edit({ embeds: [embed] });
                        if (channelInv && channelVoice) message.channel.send(`${channelInv}`)
                        await Vc.findOne({
                            guildID: message.guild.id
                        }, async (err, guild) => {
                            if (!guild) {
                                Vc.create({
                                    guildID: message.guild.id,
                                    channelID: voice.id,
                                    categoryID: category.id
                                })

                                return;
                            } else {
                                guild.updateOne({
                                    channelID: voice.id,
                                    categoryID: category.id
                                }).catch(err => console.error(err));
                            }

                        })
                    }
                }, 2000)
            } catch {

                message.channel.send({embeds:[new MessageEmbed().setDescription(`La configuration a échoué, veuillez réexécuter la commande, si cela continue à se produire, assurez-vous que le channel vocal et la catégorie appelés **rejoindre pour créer** sont supprimés`).setColor(`RED`)]});
                await Vc.findOne({
                    guildID: message.guild.id
                }, async (err, guild) => {

                    if (!guild) {
                        Vc.create({
                            guildID: message.guild.id,
                            channelID: guild.channelID,
                            categoryID: guild.categoryID
                        })

                        return;
                    } else {

                        guild.updateOne({
                            channelID: guild.channelID,
                            categoryID: guild.categoryID
                        }).catch(err => console.error(err));
                    }

                })
            }
        } else return message.channel.send({ embeds: [properUsage]})
    }
}