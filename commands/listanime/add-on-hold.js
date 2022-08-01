const { Client, Message, MessageEmbed } = require("discord.js");
const watchlists = require("../../models/watchlist");

module.exports = {
  name: "add-on-hold",
  permissions: ['SEND_MESSAGES'],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const query = args.join(" ");
    if (!query) return message.channel.send("Veuillez inclure un anime a ajouté");
    let data = await watchlists.findOne({
      userID: message.author.id,
    });


    if (data.watching.includes(query)) {
      const index = data.watching.indexOf(query);
      data.watching.splice(index, 1);
      data.save();  
    }

    if (data.completed.includes(query)) {
      const index = data.completed.indexOf(query);
      data.completed.splice(index, 1);
    }

    if (data.onHold.includes(query)) {
      const index = data.onHold.indexOf(query);
      data.onHold.splice(index, 1);
    }

    if (data.dropped.includes(query)) {
      const index = data.dropped.indexOf(query);
      data.dropped.splice(index, 1);
    }

    if (data.toWatch.includes(query)) {
      const index = data.dropped.indexOf(query);
      data.dropped.splice(index, 1);
    }

    data.onHold.unshift(query);

    data.save();

    return message.channel.send(`Ajouté: ${query}`);
  },
};