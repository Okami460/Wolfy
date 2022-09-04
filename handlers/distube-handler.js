const Distube = require("distube").default;
const { MessageEmbed, MessageButton, MessageSelectMenu, MessageActionRow } = require("discord.js");
const { SpotifyPlugin } = require("@distube/spotify");

module.exports = (client) => {


    client.distube = new Distube(client, {
        emitNewSongOnly: false,
        leaveOnEmpty: true,
        leaveOnFinish: false,
        leaveOnStop: true,
        savePreviousSongs: true,
        emitAddSongWhenCreatingQueue: false,
        //emitAddListWhenCreatingQueue: false,
        searchSongs: 0,
        youtubeCookie: "YSC",
        nsfw: false, 
        emptyCooldown: 25,
        ytdlOptions: {
            highWaterMark: 1024 * 1024 * 64,
            quality: "highestaudio",
            format: "audioonly",
            liveBuffer: 60000,
            dlChunkSize: 1024 * 1024 * 4,
        },
        youtubeDL: true,
        updateYouTubeDL: true,
        customFilters: { 
             "clear": "dynaudnorm=f=200",
             "bassboost": "bass=g=20,dynaudnorm=f=200",
             "8D": "apulsator=hz=0.08",
             "9D": "apulsator=hz=0.09",
             "vaporwave": "aresample=48000,asetrate=48000*0.8",
             "nightcore": "aresample=48000,asetrate=48000*1.25",
             "antinightcore": "aresample=48000,asetrate=48000*0.8",
             "sway": "apulsator=hz=0.08",
             "fade": "afade=t=in:ss=0:d=10",
             "phaser": "aphaser=in_gain=0.4",
             "tremolo": "tremolo",
             "vibrato": "vibrato=f=6.5",
             "reverse": "areverse",
             "treble": "treble=g=5",
             "normalizer": "dynaudnorm=f=200",
             "surrounding": "surround",
             "pulsator": "apulsator=hz=1",
             "subboost": "asubboost",
             "karaoke": "stereotools=mlev=0.03",
             "flanger": "flanger",
             "gate": "agate",
             "haas": "haas",
             "mcompand": "mcompand",
             "cursed": "vibrato=f=6.5,tremolo,aresample=48000,asetrate=48000*1.25",
             "rickroll": "bass=g=33,apulsator=hz=0.06,vibrato=f=2.5,tremolo,asetrate=48000*0.8",
             "crystalizer": "crystalizer=i=4",
             "earrape": "earwax,bass=f=100,equalizer=f=1000:t=q:w=1:g=48",
             "echo": "aecho=0.8:0.9:1000:0.3",
             "double": "aecho=0.8:0.88:60:0.4",
             "fullaudio": "bass=g=7,dynaudnorm=f=200,apulsator=hz=0.08",
             "pitch": "asetrate=48000*1.25,aresample=48000,atempo=0.7"
        },
        plugins: [
            new SpotifyPlugin({
                api: {
                    clientId: process.env.CLIENTID,
                    clientSecret: process.env.CLIENTSECRET,
                    
                },
                emitEventsAfterFetching: true
            }),
        ]
    })






    const status = (queue) => `Volume: \`${Math.floor(queue.volume)}%\` | Filtre: \`${queue.filters.map(f => `\`${f}\``).join(`, `) || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;


    client.distube
        .on("playSong", async (queue, song) => {


            const filters = [
                "clear",
                "bassboost",
                "purebass",
                "8D",
                "vaporwave",
                "nightcore",
                "antinightcore",
                "sway",
                "fade",
                "phaser",
                "vibrato",
                "surrounding",
                "pulsator",
                "subboost",
                "gate",
                "haas",
                "mcompand",
                "cursed",
                "rickroll",
                "crystalizer",
                "earrape",
                "echo",
                "double",
                "fullaudio",
                "pitch"
            ]


            let filterMenu = new MessageSelectMenu().setCustomId("filters").setPlaceholder("Veuillez choisir un filtre")

            // for (const filtre of Object.getOwnPropertyNames(filters.filter)) {
            //     filterMenu.addOptions({ label: filtre, value: filtre })
            // }

            for (const filter of filters) {
                filterMenu.addOptions({ label: filter, value: filter })
            }

            const rowMenue = new MessageActionRow().addComponents([filterMenu])


            let volumeP = new MessageButton().setStyle("SUCCESS").setCustomId("vp").setLabel("➕")
            let loop = new MessageButton().setStyle("SUCCESS").setCustomId("loop").setLabel("🔁 loop")
            let seekP = new MessageButton().setStyle("SUCCESS").setCustomId("sp").setLabel("➕")
            let autoplay = new MessageButton().setStyle("SUCCESS").setCustomId("autoplay").setLabel("↩️ Autoplay")

            let volume = new MessageButton().setStyle("SUCCESS").setCustomId("volume").setLabel("🔊").setDisabled(true)
            let skip = new MessageButton().setStyle("SUCCESS").setCustomId("skip").setLabel("⏭️ Skip")
            let seek = new MessageButton().setStyle("SUCCESS").setCustomId("seek").setLabel("⏩").setDisabled(true)
            let shuffle = new MessageButton().setStyle("SUCCESS").setCustomId("shuffle").setLabel("🔀 Shuffle")

            let volumeM = new MessageButton().setStyle("SUCCESS").setCustomId("vm").setLabel("➖")
            let stop = new MessageButton().setStyle("DANGER").setCustomId("stop").setLabel("🛑 Stop")
            let seekM = new MessageButton().setStyle("SUCCESS").setCustomId("sm").setLabel("➖")
            let play = new MessageButton().setStyle("SUCCESS").setCustomId("play").setLabel("▶️ play")

            let row = new MessageActionRow().addComponents([volumeP, loop, seekP, autoplay])
            let row2 = new MessageActionRow().addComponents([volume, skip, seek, shuffle])
            let row3 = new MessageActionRow().addComponents([volumeM, stop, seekM, play])

            let embed = new MessageEmbed()
                .setTitle("Joue :notes: " + song.name)
                .setURL(song.url)
                .setColor("GREEN")
                .addField("Durée", `\`${song.formattedDuration}\``)
                .addField("Liste Status", status(queue))
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Demander par: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })

            queue.textChannel.send({ embeds: [embed], components: [rowMenue, row, row2, row3] }).then(message => {
                let collector = message.createMessageComponentCollector({ filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id, time: song.duration > 0 ? song.duration * 1000 : 600000 })

                let MenuCollector = message.createMessageComponentCollector({ filter: (i) => i.isSelectMenu() && i.user && i.message.author.id == client.user.id, time: song.duration > 0 ? song.duration * 1000 : 600000 })

                MenuCollector.on("collect", interraction => {
                    interraction.deferUpdate()

                    client.distube.getQueue(message).setFilter(false)
                    client.distube.getQueue(message).setFilter(interraction.values[0])

                    let embed = new MessageEmbed()
                        .setTitle("Joue :notes: " + song.name)
                        .setURL(song.url)
                        .setColor("GREEN")
                        .addField("Durée", `\`${song.formattedDuration}\``)
                        .addField("Liste Status", status(queue))
                        .setThumbnail(song.thumbnail)
                        .setFooter({ text: `Demander par: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })

                    message.edit({ embeds: [embed], components: [rowMenue, row, row2, row3]})
                    })



                collector.on("collect", async (x) => {
                    x.deferUpdate()
                    switch (x.customId) {

                        case "vp":
                            if (queue.volume >= 150) {
                                await client.distube.getQueue(message).setVolume(150)
                                message.edit({ embeds: [embed], components: [rowMenue, row, row2, row3]})
                            } else {
                                await client.distube.getQueue(message).setVolume(queue.volume + 10)

                            }

                            let embed2 = new MessageEmbed()
                                .setTitle("Joue :notes: " + song.name)
                                .setURL(song.url)
                                .setColor("GREEN")
                                .addField("Durée", `\`${song.formattedDuration}\``)
                                .addField("Liste Status", status(queue))
                                .setThumbnail(song.thumbnail)
                                .setFooter({ text: `Demander par: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })

                            message.edit({ embeds: [embed2], components: [rowMenue, row, row2, row3] })
                            break;

                        case "vm":
                            if (queue.volume <= 10) {
                                await client.distube.getQueue(message).setVolume(10)
                                message.edit({ embeds: [embed], components: [rowMenue, row, row2, row3]})
                            } else {
                                await client.distube.getQueue(message).setVolume(queue.volume - 10)

                            }

                            let embed3 = new MessageEmbed()
                                .setTitle("Joue :notes: " + song.name)
                                .setURL(song.url)
                                .setColor("GREEN")
                                .addField("Durée", `\`${song.formattedDuration}\``)
                                .addField("Liste Status", status(queue))
                                .setThumbnail(song.thumbnail)
                                .setFooter({ text: `Demander par: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })

                            message.edit({ embeds: [embed3], components: [rowMenue, row, row2, row3] })
                            break;

                        case "sp":
                            let seektime = queue.currentTime + 10
                            if (seektime >= queue.songs[0].duration) seektime = queue.songs[0].duration - 1;

                            await client.distube.getQueue(message).seek(seektime)
                            break;

                        case "sm":
                            let seektimeM = queue.currentTime - 10;
                            if (seektimeM < 0) seektimeM = 0;
                            if (seektimeM >= queue.songs[0].duration - queue.currentTime) seektimeM = 0;
                            await client.distube.getQueue(message).seek(seektimeM);
                            break;

                        case "loop":

                            if (queue.repeatMode === 0) {
                                client.distube.setRepeatMode(message, 1)
                            } else if (queue.repeatMode === 1) {
                                client.distube.setRepeatMode(message, 2)
                            } else if (queue.repeatMode === 2) {
                                client.distube.setRepeatMode(message, 0)
                            }

                            let embed4 = new MessageEmbed()
                                .setTitle("Joue :notes: " + song.name)
                                .setURL(song.url)
                                .setColor("GREEN")
                                .addField("Durée", `\`${song.formattedDuration}\``)
                                .addField("Liste Status", status(queue))
                                .setThumbnail(song.thumbnail)
                                .setFooter({ text: `Demander par: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })

                            message.edit({ embeds: [embed4], components: [rowMenue, row, row2, row3] })

                            break;

                        case "stop":
                            client.distube.stop(x.message)
                            break;
                        case "skip":
                            if (client.distube.getQueue(message).songs.length == 1) {

                                message.channel.send({
                                    embeds: [new MessageEmbed()
                                        .setColor("GREEN")
                                        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                                        .setTitle("⏭ Il y a plus rien dans la playlist, je quitte le salon vocale")
                                    ]
                                }).then(msg => { setTimeout(() => msg.delete()), 3000 })
                                return await client.distube.stop(message)
                            } await client.distube.skip(message)

                            break;
                        case "play":
                            if (queue.paused) {

                                client.distube.resume(x.message)
                                play = play.setStyle("SUCCESS").setLabel("▶️ play")
                                let embed6 = new MessageEmbed()
                                .setTitle("Joue :notes: " + song.name)
                                .setURL(song.url)
                                .setColor("GREEN")
                                .addField("Durée", `\`${song.formattedDuration}\``)
                                .addField("Liste Status", status(queue))
                                .setThumbnail(song.thumbnail)
                                .setFooter({ text: `Demander par: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })

                            message.edit({ embeds: [embed6], components: [rowMenue, row, row2, row3] })

                            } else {
                                client.distube.pause(x.message)
                                play = play.setLabel("⏹️ Pause").setStyle("SUCCESS")
                                let embed7 = new MessageEmbed()
                                .setTitle("Joue :notes: " + song.name)
                                .setURL(song.url)
                                .setColor("GREEN")
                                .addField("Durée", `\`${song.formattedDuration}\``)
                                .addField("Liste Status", status(queue))
                                .setThumbnail(song.thumbnail)
                                .setFooter({ text: `Demander par: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })

                            message.edit({ embeds: [embed7], components: [rowMenue, row, row2, row3] })
                            }
                            break;
                        case "autoplay":
                            await client.distube.getQueue(message).toggleAutoplay()
                            let embed5 = new MessageEmbed()
                                .setTitle("Joue :notes: " + song.name)
                                .setURL(song.url)
                                .setColor("GREEN")
                                .addField("Durée", `\`${song.formattedDuration}\``)
                                .addField("Liste Status", status(queue))
                                .setThumbnail(song.thumbnail)
                                .setFooter({ text: `Demander par: ${song.user.tag}`, iconURL: song.user.displayAvatarURL({ dynamic: true }) })

                            message.edit({ embeds: [embed5], components: [rowMenue, row, row2, row3] })
                            break;
                        case "shuffle":
                            client.distube.shuffle(message)
                            message.channel.send({
                                embeds: [new MessageEmbed()
                                    .setColor("GREEN")
                                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                                    .setTitle("🔀 Playliste Mélanger")
                                ]
                            }).then(msg => { setTimeout(() => { msg.delete() }, 2000) }).catch(e => console.log(e.message))
                            break;


                    }
                })
            })
        }
        )

        .on("addSong", (queue, song) => queue.textChannel.send({
            embeds: [new MessageEmbed()
                .setTitle("Ajouté :thumbsup: " + song.name)
                .setColor("GREEN")
                .setThumbnail(song.thumbnail)
            ]
        }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(e => console.log(e))
        )


        .on("addList", (queue, playlist) => queue.textChannel.send({
            embeds: [new MessageEmbed()
                .setTitle("Ajouter a la Playliste :thumbsup: " + playlist.name + ` - \`[${playlist.songs.length} songs]\``)
                .setURL(playlist.url)
                .setColor("GREEN")
                .addField("Durée", `\`${playlist.formattedDuration}\``)
                .addField(`${playlist.songs.length} Musique dans la Playliste`, `Durée: \`${format(playlist.duration * 1000)}\``)
                .setThumbnail(playlist.thumbnail.url)
                .setFooter({ text: `Demander par: ${playlist.user.tag}`, iconURL: playlist.user.displayAvatarURL({ dynamic: true }) })
            ]
        })
        )
        .on("searchResult", (message, result) =>
            message.textChannel.send({
                embeds: [new MessageEmbed()
                    .setTitle("**Choisissez entre **")
                    .setURL(song.url)
                    .setColor("GREEN")
                    .setDescription(`${result.map((song, i) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n\n*Si vous n'avez rien entrer pendant les prochaines 60sec, la recherche sera annulé*`)
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

                ]
            })
        )
        .on("searchCancel", (message) => message.textChannel.send({
            embeds: [new MessageEmbed()
                .setColor("RED")
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

                .setTitle(`❌ ERREUR | Recherche Annulé`)
            ]
        })
        )
        .on("error", (message, e) => {
            console.log(String(e.stack))
            message.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTitle(`❌ ERREUR | Une erreur est survenue`)
                    .setDescription(`\`\`\`${e.stack}\`\`\``)
                ]
            })
        })
        .on("initQueue", queue => {
            queue.autoplay = false;
            queue.volume = 100;
            queue.filter = "clear";
        }
        )

}


function format(millis) {
    try{
        var h = Math.floor(millis / 3600000),
          m = Math.floor(millis / 60000),
          s = ((millis % 60000) / 1000).toFixed(0);
        if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
        else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
      }catch (e){
        console.log(String(e.stack).bgRed)
      }
}