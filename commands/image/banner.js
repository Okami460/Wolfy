const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "banner",
    aliases: ["bannère"],
    category: "fun",
    permissions: ['SEND_MESSAGES'],
    usage: "<[mention_user/nom_membre]>",
    description: "Permet de voir la bannière d'un utilisateur ou de vous même !",
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.channel.send("Veuillez entrer un utilisateur")

        axios.get(`https://discord.com/api/users/${user.id}`, {
            headers: {
                Authorization: `Bot ${client.token}`,
            },
        }).then(res => {
            const { banner, accent_color } = res.data;

            if (banner) {
                const extension = banner.startsWith("a_") ? '.gif' : '.png';
                const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}`

                const embed = new MessageEmbed()
                    .setTitle(`Bannière de ${user.tag}`)
                    .setImage(url, { size: 560 });

                message.channel.send({ embeds: [embed] })
            } else {
                if (accent_color) {
                    const embed = new MessageEmbed()
                        .setTitle(`${user.tag} n'a pas de bannière mais il a une couleur d’accentuation`)
                        .setColor(accent_color);
                    message.channel.send({ embeds: [embed] })
                } else return message.channel.send(`${user.tag} n'a pas de bannière ni de couleur d'accentuation`)
            }
        })
    }
}