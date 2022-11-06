const {
    Message,
    Client,
    MessageEmbed
} = require("discord.js");
const data = require("../../botConfig/config.json").quizz

module.exports = {
    name: "quizz",
    description: "Permet de faire un quizz animé",
    permissions: ["SEND_MESSAGES"],
    usage: "<nombre_question>",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        if (!args[0]) return message.channel.send("Veuillez indiquer un nombre de question")
        if (isNaN(args[0])) return message.channel.send("Cecis n'est pas un nombre")
        if (parseInt(args[0]) > 55) return message.channel.send("Vous avez indiquer un nombre trop important")


        const embed = new MessageEmbed()
            .setTitle("Règle")
            .setColor("GREEN")
            .setDescription("Je t'explique les règles du jeu : \n  |- Tu as 25 secondes par question pour répondre\n  |- Tu as 3 essais\n  |- Tu n'as pas besoin de t'embêter avec les majuscules, tu peux tout écrire en minuscule, pas de problème\n  |- Tu peux passer à la question suivante avec skip\n |- Si tu réussi bien, tu auras des rôles récompenses !\nBonne chance !!")

        await message.channel.send({
            embeds: [embed]
        })
        await delay(5000)

        let bnRep = 0
        let nb = parseInt(args[0])
        quit = true
        let filterMessage = (m) => m.author.id === message.author.id && !m.author.bot


        

        for (let i = 1; i <= nb; i++) {
                let indice = 0
                let prop = 0
                let object = Object.keys(data)
                let question = Math.floor(Math.random() * object.length)
                let affichage = object[question]
                let nomANime = object[question]
                let image = data[affichage]

                for (let cara of affichage) {
                    if (cara !== "." && cara !== "-" && cara !== " ") {
                        affichage = affichage.replace(cara, "❔", 1)

                    }
                }

                delay(3000)
                let embed2 = new MessageEmbed()
                    .setTitle("Question n°" + i)
                    .setImage(image)
                    .setColor("GREEN")
                    .setDescription(`\`${affichage}\``)

                await message.channel.send({
                    embeds: [embed2]
                }).then(async msg => {


                    while (indice !== 3) {
                        a = 0;
                        let rep = "";
                        await msg.channel.awaitMessages({
                            filterMessage,
                            max: 1,
                            time: 25000,
                            errors: ["time"]
                        }).then(collected => {

                            rep = collected.first().content

                        }).catch(() => { return a++  })

                        if (a === 1) {
                            indice = 3
                            embed2.setDescription("Votre est écouler")
                            return msg.edit({ embeds: [embed2] })
                        }


                            
                            if (rep.toLowerCase() !== "skip") {
    
                                if (rep.toLowerCase() !== nomANime.toLowerCase()) {
    
                                    affichage = affichage.replace("❔", nomANime[indice], 1)
                                    indice += 1
                                    prop += 1
    
                                    embed2.setTitle("Indice")
                                    embed2.setDescription(`\`${affichage}\``)
                                    embed2.setImage(image)
                                    msg.edit({
                                        embeds: [embed2]
                                    })
                                    delay(2000)
    
                                    if (prop === 3 && indice === 3) {
    
                                        embed2.setDescription("Tu n'as pas trouvé celui-là mais ce n'est pas grave !")
                                        embed2.setImage(image)
                                        await msg.edit({
                                            embeds: [embed2]
                                        })
                                    }
    
                                } else {
                                    indice = 3
                                    embed2.setDescription("Bravo vous avez trouvé, c'était bien: " + nomANime)
                                    embed2.setImage(image)
                                    await msg.edit({
                                        embeds: [embed2]
                                    })
                                    delay(2000)
                                    bnRep += 1
                                }
                            } else {
                                indice = 3
                                embed2.setDescription("vous avez décider de passer à la question suivante")
                                await msg.edit({
                                    embeds: [embed2]
                                })
    
                            }






                    }
                })

            }

            const embed3 = new MessageEmbed()
                .setTitle(`Terminé ! vous avez obtenue un score de ${bnRep}/${nb}`)

                message.channel.send({ embeds: [embed3] })





    },
};


function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms)
    });
}