const { Client, Message, MessageEmbed } = require("discord.js");
const { AnimeWallpaper } = require("anime-wallpaper");
const wall = new AnimeWallpaper();

module.exports = {
  name: "anime-wallpaper",
  aliases: ["wallpaper"],
  description: "Permet de rechercher un wallpaper d'un anime choisi",
  permissions: ['SEND_MESSAGES'],
  usage: "<nom_anime>",
  category: "recherche",
  run: async (client, message, args) => {
    const query = args.join(" ");
    if (!query)
      return message.channel.send(
        "Veuillez indiqué un nom d'anime pour la recherche du wallpaper"
      );
    async function Wallpaper1() {
      const wallpaper = await wall.getAnimeWall1({
        search: query,
        page: 1,
      });
      return wallpaper;
    }
    try {
        var wallpapers = await Wallpaper1();
    } catch (err) {
        return message.channel.send("❌Impossible de trouver un wallpaper avec : " + query.toString());
    }

    const wallpaper =
      wallpapers[Math.floor(Math.random() * wallpapers.length)].image;
    const embed = new MessageEmbed()
      .setImage(wallpaper)
      .setTitle("🖼️ Wallpaper Anime Pour Pc")
      .setDescription(`[⬇️ **__Download__**](${wallpaper})`)
      .setTimestamp()


      message.channel.send({ embeds: [embed] })
  },
};