  
const db = require('quick.db')

module.exports = {
    name: "resetchatbot",
    category: "chatbot",
    permissions: ['MANAGE_CHANNELS'],
    description: "Reset le salon de l'A.I",
    run: async (client, message, args) => {

        const chatbotchannel = db.fetch(`chatbotchannel_${message.guild.id}`)
        if(chatbotchannel === null) return message.reply(`Le salon de chat bot n’est pas défini.`)
        else if(chatbotchannel !== null) {
            message.reply(`Salon de chat bot supprimé`)
            db.delete(`chatbotchannel_${message.guild.id}`)
        }

    }
}