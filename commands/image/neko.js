const { MessageEmbed } = require("discord.js");
const axios = require("axios")

module.exports = {
    name:"neko",
    category: "fun",
    permissions: ['SEND_MESSAGES'],
    description: "Envoie une photo d'une magnifique Catgirl",
   run: async( client, message, args) => {
    let json = await axios("https://neko-love.xyz/api/v1/neko");
  
      json = json.data;
      if (json.code !== 200) throw "Error 01: Unable to access the json content of API"

      const embed = new MessageEmbed()
        .setColor("#FFC0CB")
        .setTitle("NEKO")
        .setImage(json.url)

    message.channel.send({ embeds: [embed]})
  
    } 
}