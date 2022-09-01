const discord = require("discord.js")

module.exports = {
    name: "test",
    aliases: ["p", "checkping"],
    category: "info",
    permissions: ["SEND_MESSAGES"],
    description: "Bot ping !",
    run: async (client, message, args) => {

        const embed1 = new discord.MessageEmbed()
            .setTitle("1")

        const embed2 = new discord.MessageEmbed()
            .setTitle("2")

        const embed3 = new discord.MessageEmbed()
            .setTitle("3")

            paginationEmbed(client, message, [embed1, embed2, embed3], 1200000)
    }
}


async function paginationEmbed(client, msg, pages, timeout = 120000) {

	if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
	if (!pages) throw new Error('Pages are not given.');
	let page = 0;
    let skip = new discord.MessageButton().setStyle("SUCCESS").setCustomId("pp").setLabel("⏭️")
    let volumeM = new discord.MessageButton().setStyle("SUCCESS").setCustomId("mm").setLabel("➖")
    let row = new discord.MessageActionRow().addComponents([skip, volumeM])
	await msg.channel.send({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)], components: [row]}).then(message => {
        let collector = message.createMessageComponentCollector({ filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id, time: timeout })
        collector.on("collect", async (x) => {
            x.deferUpdate()
            switch (x.customId) {
                case "pp":
                    page = page > 0 ? --page : pages.length - 1;
                    break;
                case "mm":
                    page = page + 1 < pages.length ? ++page : 0;
                    break
            }
            message.edit({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)], components: [row]});
        })
    });
};