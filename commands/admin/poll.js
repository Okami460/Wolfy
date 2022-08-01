const { MessageEmbed } = require('discord.js')


module.exports = {
    name: "poll",
    aliases: ["annonce"],
    category: "admin",
    permissions: ['ADMINISTRATOR'],
    usage: '"<annonce>" ou "<annonce>" rep 1 | rep 2 | rep 3....',
    description: "Pemret d'envoyer une annonce",

    run: async(client, message, args) => {

        let pollreactions = {
            1: '🇦',
            2: '🇧',
            3: '🇨',
            4: '🇩',
            5: '🇪',
            6: '🇫',
            7: '🇬',
            8: '🇭',
            9: '🇮',
            10: '🇯',
            11: '🇰',
            12: '🇱',
            13: '🇲',
            14: '🇳',
            15: '🇴',
            16: '🇵',
            17: '🇶',
            18: '🇷',
            19: '🇸',
            20: '🇹',
        }

        var questionRegex = /"(.*)"/gmi
        const questionOriginal = args.join(' ').match(questionRegex)
        const questionEdited = questionOriginal[0].replace("`", "").replace("`", "")
        if (!questionOriginal || !questionEdited) return message.channel.send(`Aucune question fournie`)

        let options = args.join(' ').slice(questionOriginal[0].length).split(' | ')
        let result = ''

        if (options.length <= 1) {
            result += '<a:YesA:1001974253081595904>: Oui\n'
            result += '<a:No:1001974250950893698>: Non'
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
**${questionEdited.replace('"', " ").replace('"', " ")}**
<a:YesA:1001974253081595904>: Oui
<a:No:1001974250950893698>: Non
            `)
            message.channel.send({ embeds: [embed]}).then(msg => {
                msg.react('<a:YesA:1001974253081595904>') 
                msg.react('<a:No:1001974250950893698>') 
            })
        } else {
            if (options.length > 20) return message.channel.send(`Vous ne pouvez pas avoir plus de 20 options`)
            result = options.map((c, i) => {
                return `${pollreactions[i + 1]} ${c}` 
            })

            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor('RANDOM')
                .setDescription(`
**${questionEdited.replace('"', " ").replace('"', " ")}**
${result.join('\n')}
            `)
            message.channel.send({ embeds: [embed]}).then(msg => {
                options.map(async (c, x) => {
                    msg.react(pollreactions[x + 1]) 
                })
            })
        }
    }
}