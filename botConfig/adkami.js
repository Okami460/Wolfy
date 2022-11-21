async function adkami(client, axios, discord, fs) {

    let info = await axios.get("https://m.adkami.com/api/main?objet=news&bot=an-hactys", {
        headers: {
          "User-Agent": "axios 0.21.1"
        }
    }).catch(err => console.log(err))



        let urlimage = info["episodes"][0]["image"]
        let urlserie = info["episodes"][0]["url"]
        urlserie = "https://" + urlserie.slice(15, -1)
        let epname = info["episodes"][0]["title"]
        let epinfo = info["episodes"][0]["info"]
  
  
  
        const embed = new discord.MessageEmbed()
          .setTitle(`${epname}`)
          .setDescription(`${epinfo}\n${urlserie}`)
          .setAuthor({ name: "team: " + info["episodes"][0]["team"], iconURL: "https://m.adkami.com/favicon2.png" })
          .setImage(urlimage)
          .setURL(urlserie)
          .setFooter({ text: "ADKami" })
  
  
  
        const anime = require("./anime.json")
  
  
        try {
          if (!anime.anime_name.includes(`${epname} ${epinfo}`)) {
            anime.anime_name.push(`${epname} ${epinfo}`)
  
            await client.channels.cache.get("929074477579505667").send({
                embeds: [embed]
            })
            fs.writeFileSync("./botConfig/anime.json", JSON.stringify(anime, null, 4))
          } else return
  
        } catch (error) {
        }
  
  
}

module.exports = { adkami }