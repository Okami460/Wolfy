const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    
        name: "invite",
        category: "utilities",
        description: "Invite le bot sur votre serveur",
        permissions: ["SEND_MESSAGES"],
    run: async (client, message, args) => {

        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor({ name: "Invite!"})
        .setDescription("```Inviter moi sur votre serveur```")
        .setTimestamp()
        .setFooter({ text: `Demander par ${message.author.tag}`, iconURL: message.author.displayAvatarURL()});

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Invite")
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=0&scope=bot`)
                    .setEmoji("🔗")
                    .setStyle("LINK")
            )
        
        message.channel.send({ embeds: [embed], components: [row] });
    }
}