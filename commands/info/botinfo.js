
const { MessageEmbed } = require('discord.js')
const os = require('os')
const ms = require('ms')
const moment = require('moment')
const cpuStat = require('cpu-stat')


module.exports = {
    name: "botinfo",
    aliases: ["bot-info"],
    category: "info",
    permissions: ['SEND_MESSAGES'],
    description: "Affiche les informations sur le Bot",
    run: async (client, message, args) => {

        const status = {
            online: '🟢:- En ligne',
            idle: '🟡:- Inactif',
            dnd: '🔴:- Ne pas Déranger',
            offline: '⚫:- Hors-ligne'
        }

        const days = Math.floor(client.uptime / 86400000)
        const hours = Math.floor(client.uptime / 3600000) % 24
        const minutes = Math.floor(client.uptime / 60000) % 60
        const seconds = Math.floor(client.uptime / 1000) % 60

        

        cpuStat.usagePercent(function (error, percent) {
            if (error) return message.reply(error)
            const memoryusage = formatBytes(process.memoryUsage().heapUsed)
            const node = process.version
            const CPU = percent.toFixed(2)
            const CPUModel = os.cpus()[0].model
            const cores = os.cpus().length

            const embed = new MessageEmbed()
                .setAuthor(client.user.username, client.user.displayAvatarURL())
                .setTimestamp()
                .setColor('RANDOM')
                .addField('Nom', client.user.username, true)
                .addField('ID', client.user.id, true)
                .addField('Status', `${status[client.presence.status]}`)
                .addField('Créer le', moment.utc(client.user.createdAt).format('DD/MM/YYYY'))
                .addField('Ajouter au Serveur le', moment.utc(client.joinedAt).format('DD/MM/YYYY'))
                .addField("Nombre de Commande", `${client.commands.size}`, true)
                .addField('Je suis sur ', client.guilds.cache.size + ' serveurs', true)
                .addField('Nombres de Membres totale: ', `${client.users.cache.size}`, true)
                .addField('Nombres de Salons totale ', client.channels.cache.size.toLocaleString())
                .addField('Dernière Connexion il y a', `\`${days}\` Jour \`${hours}\` Heures \`${minutes}\` Minutes \`${seconds}\` Secondes`)
                .addField('Node Version', node, true)
                .addField('Utilisation de la Mémoire', memoryusage, true)
                .addField('Utilisation Processeur', `${CPU}%`, true)
                .addField('Modèle de Processeur', CPUModel)
            message.channel.send({embeds: [embed]})
            

        })


        function formatBytes(a, b) {
            let c = 1024 // 1 GB = 1024 MB
            d = b || 2
            e = ['B', 'KO', 'MO', 'GO', 'TO']
            f = Math.floor(Math.log(a) / Math.log(c))

            return parseFloat((a / Math.pow(c, f)).toFixed(d)) + '' + e[f]
        }
    }
}
