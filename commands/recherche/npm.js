const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports =  {
    name: "npm",
    category: "info",
    description: "Obtient des infomations sur un Package",
    permissions: ['SEND_MESSAGES'],
    usage: "<nom>",
    run: async (client, message, args) => {

        const npm = args[0]
        if(!npm) return message.channel.send('Veuillez entrez une recherche')

        let response
        try {
            response = await fetch('https://api.npms.io/v2/search?q=' + args[0]).then(res => res.json())
        }
        catch (e) {
            return message.channel.send('Une erreur est survenue, veuillez réessayer plus tard')    
        }
        try {
        const pkg = response.results[0].package
        const embed = new MessageEmbed()
        .setTitle(pkg.name)
        .setColor('RANDOM')
        .setURL(pkg.links.npm)
        .setThumbnail('https://images-ext-1.discordapp.net/external/JsiJqfRfsvrh5IsOkIF_WmOd0_qSnf8lY9Wu9mRUJYI/https/images-ext-2.discordapp.net/external/ouvh4fn7V9pphARfI-8nQdcfnYgjHZdXWlEg2sNowyw/https/cdn.auth0.com/blog/npm-package-development/logo.png')
        .setDescription(pkg.description)
        .addField('Auteur:-', pkg.author ? pkg.author.name : 'None') 
        .addField('Version:-', pkg.version)
        .addField('Dépôt:-', pkg.links.repository ? pkg.links.repository : 'None')
        .addField('Maintainers:-', pkg.maintainers ? pkg.maintainers.map(e => e.username).join(', ') : 'None') 
        .addField('Mots-clés:-', pkg.keywords ? pkg.keywords.join(', ') : 'None') 
        .setTimestamp()
        message.channel.send({ embeds: [embed] })
        }
        catch (e) {
            message.channel.send('Package invalide')
        }
    }
}