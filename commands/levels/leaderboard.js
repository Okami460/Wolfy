const Discord = require('discord.js');
const Levels = require('discord-xp');
const canvacord = require('canvacord');

module.exports = {
    name: "leaderboard",
    category: "levels",
    permissions: ['SEND_MESSAGES'],
    description: "afficher le classement de niveau du serveur",

    run: async (client, message, args) => {
        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 5);

        if (rawLeaderboard.length < 1) return reply("personne n’est encore dans le classement");

        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);

        const lb = leaderboard.map(e => `${e.position} | ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);

        const leaderboardEmbed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setAuthor({ text: '📊 LEADERBOARD'})
            .setDescription(`${lb.join('\n\n')}`)
            .setImage('https://mybroadband.co.za/forum/data/attachments/942/942482-77292019e5c358fffde950b4a717d6a2.jpg')
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

        message.channel.send({ embeds: [leaderboardEmbed] });


    },
};