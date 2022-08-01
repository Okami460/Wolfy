const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "pdp",
    aliases: ["pp", "avatar"],
    category: "fun",
    permissions: ['SEND_MESSAGES'],
    usage: "<[@membre/nom_membre]>",
    description: "Permet de voir les photos de profiles d'un utilisateur ou de vous même !",
    run: async (client, message, args) => {
        let target = message.mentions.members.first() || message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").toLowerCase());
        if (!target) target = message.member;
        
        const embed = new MessageEmbed()
        .setTitle(`Avatar de ${target.user.tag}`)
        .setImage(target.user.displayAvatarURL({ dynamic: true, size: 512}))

        message.channel.send({ embeds: [embed]})
    }
}