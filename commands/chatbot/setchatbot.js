const db = require('quick.db')

module.exports = {
    name: "setchatbot",
    category: "chatbot",
    permissions: ['MANAGE_CHANNELS'],
    usage: "<salon_id>",
    description: "Définit le salon de l'A.I",
    run: async (client, message, args) => {
        const channel = args[0]
        if(!channel) return message.channel.send('veuillez préciser l\'id du salon')
        if(isNaN(parseInt(args[0]))) return message.channel.send('L’ID du salon n\'est pas un nombre')
        const chatbotchannel = db.fetch(`chatbotchannel_${message.guild.id}`)
        if(chatbotchannel !== null) return message.channel.send(`Le salon de chat bot est déjà défini. Le salon actuel est <#${chatbotchannel}>. Réinitialiser le canal pour le définir à nouveau`)
        else if(chatbotchannel === null) {
            message.channel.send(`Salon de chat bot défini sur <#${channel}>`)
            db.set(`chatbotchannel_${message.guild.id}`, channel)
        }

    }
}