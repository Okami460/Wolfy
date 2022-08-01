const client = require('../../index');
const Discord = require('discord.js');


client.on("guildCreate", async (guild) => {

    
    let channelSendTo;

    guild.channels.cache.forEach(channel => {
        if (channel.type === "text" && !channelSendTo && channel.permissionsFor(guild.me).has("SEND_MESSAGES")) channelSendTo = channel;

    })

    if (!channelSendTo) return;

    const newGuildEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor({ name:guild.name, iconURL :guild.iconURL({ dynamic: true })})
        .setTitle(`Merci d'avoir invité ${client.user.username} !`)
        .setDescription(`Utiliser ${client.config.prefix}help pour voir toutes les commandes !`)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL()})

    channelSendTo.send({ embeds: [newGuildEmbed]});
});
