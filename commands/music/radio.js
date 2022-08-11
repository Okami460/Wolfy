  
const Discord = require('discord.js')
const radio = require("../../botConfig/radio2.json")
const radio2 = require("../../botConfig/radio.json")
const pagination = require("../../botConfig/pagination")

module.exports = {
    name: 'radio',
    category: 'music',
    usage: "<radio>",
    permissions: ['SEND_MESSAGES'],
    run: async (client, message, args) => {

        

        if (!message.member.voice.channel) { 
            message.delete().catch(O_o=>{})
                    message.channel.send('Vous n\'êtes pas dans un salon vocale, veuillez rejoindre un salon puis réessayer')
                    .then(msg => { setTimeout(() => { msg.delete() }, 3000) }).catch(e => console.log(e.message))
                return
        } else {

                

                    const searchStation = args.join(" ").toLowerCase()
                    //const connection = await message.member.voice.channel.join()
                    let radiostation
                    let streamurl
                    let channel_id
                    let found=false
                    
                            Object.keys(radio).forEach(function(stn) {
                            if (radio[stn].alias.includes(searchStation)) {
                                    radiostation = radio[stn].name
                                    streamurl = radio[stn].streamurl
                                    channel_id = radio[stn].channel_id
                                    found=true
                            }
                    })

                    
                    if (found) {
    
                            try {
                                
     
                                    const playingEmbed = new Discord.MessageEmbed()
                                            .setColor('#0099ff')
                                            .setTitle('Now playing')
                                            .setTimestamp()
                                            .setDescription(radiostation)                                       
                                            .setFooter(client.user.username, client.user.avatarURL)
                                    message.delete().catch(O_o=>{})
                                    message.channel.send({ embeds: [playingEmbed]})
                                    .then(msg => { setTimeout(() => { msg.delete() }, 3000) }).catch(e => console.log(e.message))

                            //return connection.play(streamurl)
                            return client.distube.play(message, streamurl)
                            
  
                    
            } catch (ex) {
                    console.log(ex.stack);
            }
            } else {
                    const pEmbed = new Discord.MessageEmbed()
                                    .setColor('RED')
                                    .setTitle('Sation de Radio :flag_cp:')
                                    .setTimestamp()
                                    .setDescription("Veuillez choisir une sation!")
                                    .setFooter(client.user.username, client.user.avatarURL)
                            for(var stn = 0; stn < radio2.france.length; stn++) {
                                    radio2.france.values()
                                    stnName = radio2.france[stn].name
                                    cmd = "w!radio " + radio2.france[stn].name
                                    pEmbed.addField('Ecouter ' + stnName, `\`${cmd}\``, true)
                            }
                        
                            const japanEmbed = new Discord.MessageEmbed()
                            .setColor('RED')
                            .setTitle('ラジオ放送局 :flag_jp:')
                            .setTimestamp()
                            .setDescription("駅を選んでください !")
                            .setFooter(client.user.username, client.user.avatarURL)
                    for(var stn = 0; stn < radio2.japon.length; stn++) {
                            radio2.japon.values()
                            stnName = radio2.japon[stn].name
                            cmd = "w!radio " + radio2.japon[stn].name
                            japanEmbed.addField('聞く ' + stnName, `\`${cmd}\``, true)
                    }       


                        const suissEmbed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('Radiosender :flag_ch:')
                        .setTimestamp()
                        .setDescription("Bitte wählen Sie eine Station!")
                        .setFooter(client.user.username, client.user.avatarURL)
                for(var stn = 0; stn < radio2.suisse.length; stn++) {
                        radio2.suisse.values()
                        stnName = radio2.suisse[stn].name
                        cmd = "w!radio " + radio2.suisse[stn].name
                        suissEmbed.addField('Zuhören ' + stnName, `\`${cmd}\``, true)
                }



                        const anglEmbed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('Radio Station :flag_gb:')
                        .setTimestamp()
                        .setDescription("please choose a station!")
                        .setFooter(client.user.username, client.user.avatarURL)
                for(var stn = 0; stn < radio2.angleterre.length; stn++) {
                        radio2.angleterre.values()
                        stnName = radio2.angleterre[stn].name
                        cmd = "w!radio " + radio2.angleterre[stn].name
                        anglEmbed.addField('To listen ' + stnName, `\`${cmd}\``, true)
        }

        
                        const espEmbed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('Estación de Radio :flag_es:')
                        .setTimestamp()
                        .setDescription("¡Elige una estación!")
                        .setFooter(client.user.username, client.user.avatarURL)
                for(var stn = 0; stn < radio2.espagne.length; stn++) {
                        radio2.espagne.values()
                        stnName = radio2.espagne[stn].name
                        cmd = "w!radio " + radio2.espagne[stn].name
                        espEmbed.addField('Escuchar ' + stnName, `\`${cmd}\``, true)
}


                        const allEmbed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('Radiosender :flag_de:')
                        .setTimestamp()
                        .setDescription("Bitte wählen Sie eine Station!")
                        .setFooter(client.user.username, client.user.avatarURL)
                for(var stn = 0; stn < radio2.allemagne.length; stn++) {
                        radio2.allemagne.values()
                        stnName = radio2.allemagne[stn].name
                        cmd = "w!radio " + radio2.allemagne[stn].name
                        allEmbed.addField('Zuhören ' + stnName, `\`${cmd}\``, true)
                }


                        const italEmbed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setTitle('Stazione radio :flag_it:')
                        .setTimestamp()
                        .setDescription("Si prega di scegliere una stazione!")
                        .setFooter(client.user.username, client.user.avatarURL)
                for(var stn = 0; stn < radio2.italie.length; stn++) {
                        radio2.italie.values()
                        stnName = radio2.italie[stn].name
                        cmd = "w!radio " + radio2.italie[stn].name
                        italEmbed.addField('Ascoltare ' + stnName, `\`${cmd}\``, true)
                }

                const PortEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Estação de rádio :flag_pt:')
                .setTimestamp()
                .setDescription("Por favor, escolha uma estação!")
                .setFooter(client.user.username, client.user.avatarURL)
        for(var stn = 0; stn < radio2.portugal.length; stn++) {
                radio2.portugal.values()
                stnName = radio2.portugal[stn].name
                cmd = "w!radio " + radio2.portugal[stn].name
                PortEmbed.addField('Ouvir ' + stnName, `\`${cmd}\``, true)

        }
                const RussEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Радио станция :flag_ru:')
                .setTimestamp()
                .setDescription("Пожалуйста, выберите станцию! ")
                .setFooter(client.user.username, client.user.avatarURL)
        for(var stn = 0; stn < radio2.russie.length; stn++) {
                radio2.russie.values()
                stnName = radio2.russie[stn].name
                cmd = "w!radio " + radio2.russie[stn].name
                RussEmbed.addField('Слышать ' + stnName, `\`${cmd}\``, true)

        }

                const BelgEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Sation de Radio :flag_be:')
                .setTimestamp()
                .setDescription("Veuillez choisir une sation!")
                .setFooter(client.user.username, client.user.avatarURL)
        for(var stn = 0; stn < radio2.belgique.length; stn++) {
                radio2.belgique.values()
                stnName = radio2.belgique[stn].name
                cmd = "w!radio " + radio2.belgique[stn].name
                BelgEmbed.addField('Ecouter ' + stnName, `\`${cmd}\``, true)
        }

                const CanadaEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('Sation de Radio :flag_ca:')
                .setTimestamp()
                .setDescription("Veuillez choisir une sation!")
                .setFooter(client.user.username, client.user.avatarURL)
        for(var stn = 0; stn < radio2.canada.length; stn++) {
                radio2.canada.values()
                stnName = radio2.canada[stn].name
                cmd = "w!radio " + radio2.canada[stn].name
                CanadaEmbed.addField('Ecouter ' + stnName, `\`${cmd}\``, true)
        }    
        
                
                const KoreanEmbed = new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle('라디오 방송국 :flag_kr:')
                .setTimestamp()
                .setDescription("역을 선택해주세요!")
                .setFooter(client.user.username, client.user.avatarURL)
        for(var stn = 0; stn < radio2.korean.length; stn++) {
                radio2.korean.values()
                stnName = radio2.korean[stn].name
                cmd = "w!radio " + radio2.korean[stn].name
                KoreanEmbed.addField('듣다' + stnName, `\`${cmd}\``, true)
        }    


                            const embeds = [pEmbed, japanEmbed, suissEmbed, anglEmbed, espEmbed, allEmbed , italEmbed, PortEmbed, RussEmbed, BelgEmbed, CanadaEmbed, KoreanEmbed]

                            const emoji = ['⏪', '⏩']
                    
                            const time = "90000"
                    
                            pagination(message, embeds, emoji, time)
                            
                    }
            }
    }
}