const discord = require('discord.js');
const { post } = require("node-superfetch")


function clean(string) {
    if (typeof text === "string") {
        return string.replace(/` /g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
    } else {
        return string;
    }
}

module.exports = {
    name: "eval",
    description: "Seul le créateur du bot peut utiliser cette commande donc Okami(狼)#0659",
    usage: "<eval>",
    permissions: ['ADMINISTRATOR'],

    run: async (client, message, args) => {

        if (!["780444874411474964"].includes(message.author.id)) return message.channel.send(`Seule le créateur du bot peut utiliser cette commande`);

        const embed = new discord.MessageEmbed()
            .addField(`Input`, "```js\n" + args.join(" ") + "```");

        try {
            const code = args.join(' ');
            if (!code) return message.channel.send("Oka... Sa va être compliqué d'évaluer rien du tout ( ._.)");
            let evaled
            if (code.includes(`SECRET`) || code.includes(`TOKEN`) || code.includes(`client.token`) || code.includes(`destroy`) || code.includes(`client.destroy`)) {
                evaled = "Ta gueule ! qu'est ce qui te prend sérieusement ?"
            } else {
                evaled = eval(code);
            }

            if (typeof evaled !== "string") evaled = require("util").inspect(evaled, { depth: 0 });

            let output = clean(evaled);

            console.log(output)
            if (output.length > 1024) {
                const { body } = await post("https://hastebin.com/documents").send(output);
                embed.addField("Output", `https://hastebin.com/${body.key}.js`).setColor(0x7289DA);
            } else {
                embed.addField("Output", "```js\n" + output + "```").setColor(0x7289DA)
            }

            message.channel.send({ embeds: [embed]})
        } catch (error) {
            let err = clean(error);
            if (err.length > 1024) {
                const { body } = await post("https://hastebin.com/documents").send(output);
                embed.addField("Output", `https://hastebin.com/${body.key}.js`).setColor("RED");
            } else {
                embed.addField("Output", "```js\n" + err + "```").setColor("RED")
            }

            message.channel.send({embeds: [embed]})

        }
    }

}






