const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: "shop",
    category: "economy",
    permissions: ['SEND_MESSAGES'],
    description: "Permet de voir les items du Shop !",
    run: async (client, message, args) => {



        const embed = new MessageEmbed()
        .setTitle('Shop')
        .setThumbnail("https://cdn-0.emojis.wiki/emoji-pics/microsoft/shopping-cart-microsoft.png")
        .setTimestamp()
        .setColor('RANDOM')
        .addField('Laptop <:laptop:871898793442938880>:', `Prix:- \`$10,000\`\nUtilisez un ordinateur portable pour publier des memes et plus encore\nUsage:- \`${client.config.prefix}buy laptop\``)
        .addField('Canne à pêche <:fishing_rod:871898584835043378>:', `Prix:- \`$15,000\`\nUtiliser votre canne à pêche pour pêcher\nUsage:- \`${client.config.prefix}buy fish rod\``)
 
        .setFooter('Shop')
        message.channel.send({ embeds: [embed]})
    }
}