const Math = require("mathjs")
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "kiss",
    category: "fun",
    permissions: ['SEND_MESSAGES'],
    usage: "<@membre>",
    description: "Embrasse un membre !",
    run: async (client, message, args) => {
        images = [
            "https://pa1.narvii.com/5925/bfd5fdfa6132c17a1c768a88536afb0589f7aeb6_hq.gif",
            "https://www.animeler.net/upload/media/entries/2017-02/15/787-2-94c5f33a5b06c67c3c840bd37121eb10.gif",
            "https://pa1.narvii.com/5750/afabc33d3f0670abd130b40d07b17ae79cb8b5d4_hq.gif",
            "http://images6.fanpop.com/image/photos/36200000/yuri-image-yuri-36241949-480-270.gif",
            "https://i.pinimg.com/originals/9b/a3/25/9ba325b3eee2c69f0b3ffd00696230a0.gif",
            "https://i.pinimg.com/originals/18/bc/8c/18bc8caec8fc67047a5f9586a51429f9.gif"
        ]

        kissUser = message.mentions.users.first()
        if (!kissUser) return message.channel.send("Veuillez mentionné la personne que vous voulez embrasser !")

        let embed = new MessageEmbed()
            .setTitle(`Vous avez embrassé ${kissUser.username} :heart:`)
            .setImage(images[Math.floor(Math.random() * images.length)])
            .setTimestamp()
        
            message.channel.send({embeds:[embed]})
    }
}