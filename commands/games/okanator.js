const { MessageEmbed } = require("discord.js"),
  { Aki } = require("aki-api"),
  emojis = ["👍", "👎", "❔", "🤔", "🙄", "❌"],
  Started = new Set();
module.exports = {
  name: "okanator",
  aliases: ["oka"],
  permissions: ['SEND_MESSAGES'],
  description: "Akinator version Okanator ( ._.)",
  async run(client, message, args) {
    const sendMsg = await message.channel.send("⚙ Chargement...");
    const region = "fr"
    const childMode = false;
    const proxy = undefined; 
    const aki = new Aki({ region, childMode, proxy});
    await aki.start();
    sendMsg.delete();
    const msg = await message.channel.send({ embeds:[
      new MessageEmbed()
        .setTitle(`${message.author.username}, Question ${aki.currentStep + 1}`)
        .setColor(10181046)
        .setDescription(
          `**${aki.question}**\n${aki.answers
            .map((x, i) => `${x} | ${emojis[i]}`)
            .join("\n")}`
        )
    ]});
    for (let emoji of emojis) await msg.react(emoji).catch(console.error);
    const collector = msg.createReactionCollector({  filter:
      (reaction, user) =>
        emojis.includes(reaction.emoji.name) && user.id === message.author.id && !user.bot,
      time: 60000 * 6 }
    );
    collector.on("collect", async (reaction, user) => {
      reaction.users.remove(user).catch(console.error);
      if (reaction.emoji.name == "❌") return collector.stop();

      await aki.step(emojis.indexOf(reaction.emoji.name));
      if (aki.progress >= 70 || aki.currentStep >= 78) {
        await aki.win();
        collector.stop();
        message.channel.send({ embeds: [
          new MessageEmbed()
            .setTitle("Est-ce votre personnage ?")
            .setDescription(
              `**${aki.answers[0].name}**\n${aki.answers[0].description}\nClassement en tant que **#${aki.answers[0].ranking}**\n\n[oui (**o**) / non (**n**)]`
            )
            .setImage(aki.answers[0].absolute_picture_path)
            .setColor(10181046)
        ]});
        message.channel
          .awaitMessages({
            filter: (response) =>
              ["oui", "o", "non", "n"].includes(
                response.content.trim().toLowerCase()
              ) && response.author.id == message.author.id,
             max: 1, time: 30000, errors: ["time"] }
          )
          .then((collected) => {
            const content = collected.first().content.trim().toLowerCase();
            if (content == "o" || content == "oui")
              return message.channel.send({ embeds: [
                new MessageEmbed()
                  .setColor(10181046)
                  .setTitle("YEAH !! Rejouons au devinette  !!")
                  .setDescription("J’ai aimé jouer avec vous!")
              ]});
            else
              return message.channel.send({ embeds: [
                new MessageEmbed()
                  .setColor(10181046)
                  .setTitle("Bon... vous êtes gagnant !")
                  .setDescription("J’ai aimé jouer avec vous!")
              ]});
          });
        return;
      }
      msg.edit({ embeds: [
        new MessageEmbed()
          .setTitle(
            `${message.author.username}, Question ${aki.currentStep + 1}`
          )
          .setColor(10181046)
          .setDescription(
            `**${aki.question}**\n${aki.answers
              .map((x, i) => `${x} | ${emojis[i]}`)
              .join("\n")}`
          )
      ]});
    });

    collector.on("end", () => {
      Started.delete(message.author.id);
      setTimeout(() => { msg.delete()}, 1000)
    });
  },
};