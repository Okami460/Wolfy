const Discord = require('discord.js');
const Kitsu = require('kitsu.js');
const kitsu = new Kitsu();

module.exports =  {
  name: "anime-search",
  category: "info",
  description: "Obtient des infomations sur un Anime",
  permissions: ['SEND_MESSAGES'],
  usage: "<nom>",
  run: async (client, message, args) => {

   if (!args[0]) {
     return message.channel.send("Veuillez inclure un nom d'un anime");
      
    }
        var search = message.content.split(/\s+/g).slice(1).join(" ");
        kitsu.searchAnime(search).then(async result => {
            if (result.length === 0) {
                return message.channel.send(`Recherche non trouvé pour **${search}**!`);
            }
          
          var anime = result[0]

            let embed = new Discord.MessageEmbed()
                .setColor('#FF2050')
                .setAuthor(`${anime.titles.french ? anime.titles.french : search} | ${anime.showType}`, anime.posterImage.original)
                .setDescription(anime.synopsis.replace(/<[^>]*>/g, '').split('\n')[0])
                .addField('❯\u2000\Information', `•\u2000\**Nom Japonais:** ${anime.titles.japanese} (${anime.titles.romaji})\n\•\u2000\**Note d'age:** ${anime.ageRating}\n\•\u2000\**NSFW:** ${anime.nsfw ? 'Oui' : 'Non'}`, true)
                .addField('❯\u2000\Stats', `•\u2000\**Notes:** ${anime.averageRating}\n\•\u2000\**Classement d’évaluation:** ${anime.ratingRank}\n\•\u2000\**Popularité:** ${anime.popularityRank}`, true)
                .addField('❯\u2000\Status', `•\u2000\**Episodes:** ${anime.episodeCount ? anime.episodeCount : 'N/A'}\n\•\u2000\**Date de début:** ${anime.startDate}\n\•\u2000\**Date de fin:** ${anime.endDate ? anime.endDate : "Toujours en diffusion"}`, true)
            
                .setThumbnail(anime.posterImage.original, 100, 200);
          

            return message.channel.send({ embeds: [embed] })
        }).catch(err => {
            console.log(err)
            return message.channel.send(`Recherche non trouvé pour **${search}**!`);
        });
    }

}