const { Message, Client } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "slowmode",
    category: "moderation",
    permissions: ['MANAGE_CHANNELS'],
    usage: "<temps(s/m/h)>",
    description: "Ajoute un cooldown sur vos salons",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */

    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.channel.send('Vous n\'avais pas les permissions "Gérer les salons"')
        if (!args[0]) {
            message.channel.setRateLimitPerUser(0);
            return message.channel.send("Le cooldown a été enlevé")
        }

        const raw = args[0]
        const milliseconds = ms(raw);

        if (isNaN(milliseconds)) return message.channel.send("Le temps indiqué n'est pas un nombre")

        if (milliseconds < 1000) return message.channel.send("Le temps définit doit être supérieur ou égale à 1")

        message.channel.setRateLimitPerUser(milliseconds / 1000);
        message.channel.send(
            `le cooldown pour ce salon a été fixé à ${ms(milliseconds, {
                long: true
            })}`
        )

    }
}