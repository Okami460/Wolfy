const discord = require("discord.js")
const fs = require("fs")

module.exports = {
    name: "help",
    aliases: ["aide"],
    category: "utility",
    permissions: ["SEND_MESSAGES"],
    description: "Menu help",
    usage: "[nom de la commande]",
    run: async (client, message, args) => {

        if (!args[0]) {
            let categories = []

            const dirEmojis = {
                admin: "🛠️ | ",
                chatbot: "🗣️ | ",
                economy: "💸 | ",
                fun: "🐺 | ",
                games: "🕹️ | ",
                image: "🖼️ | ",
                info: "👨‍💻 | ",
                levels: "🚀 | ",
                listanime: "📜 | ",
                moderation: "🔧 | ",
                music: "🎵 | ",
                owner: "🔰 | ",
                recherche: "🌐 |",
                utility: "🔩 | "
            }


            let adminCategory = fs.readdirSync('./commands/')
            if (!message.member.permissions.has("ADMINISTRATOR")) {
                adminCategory.shift()
            }

            if (!["780444874411474964"].includes(message.author.id)) adminCategory.splice(adminCategory.indexOf("owner", 1))

            adminCategory.forEach(dir => {

                const editName = `${dirEmojis[dir]} __${dir.toUpperCase()}__`
                const commands = fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'))

                const cmds = commands.map(command => {
                    let file = require(`../../commands/${dir}/${command}`)

                    if (!file.name) return "`Commande indisponible`"

                    let name = file.name.replace(".js", "");
                    
                    return `\`${name}\``
                })

                let data = new Object()
                data = {
                    name: editName + ` [${cmds.length}]`,
                    value: cmds.length === 0 ? "`En progression`" : cmds.join(" **/** ")
                }

                categories.push(data)
            })

            const helpEmbed = new discord.MessageEmbed()
                .setTitle("Menu Help")
                .addFields(categories)
                .setDescription(`Utilisez ${client.config.prefix}help avec le nom d'une commande pour obtenir des informations sur la commande`)
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                .setColor("GREEN")
                .setTimestamp()

            return message.channel.send({ embeds: [helpEmbed] })
        } else {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(c => c.aliases && c.aliases.includes(args[0]))

            if (!command) {
                const noCommandEmbed = new discord.MessageEmbed()
                    .setTitle("Commande Non Trouvé")
                    .setDescription(`Utiliser ${client.config.prefix}help pour voir la liste de toutes les commandes`)
                    .setColor("RED")
                    .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                return message.channel.send({ embeds: [noCommandEmbed] })
            }
            
            const helpCommandEmbed = new discord.MessageEmbed()
                .setTitle("Information Commande")
                .addField("Prefix", `\`${client.config.prefix}\``)
                .addField("Command", command.name ? `\`${command.name}\`` : "Commande Indisponible")
                .addField("Aliases", command.aliases ? `\`${command.aliases.join(" / ")}\`` : "Pas d'Aliases")
                .addField("Usage", command.usage ? `\`${client.config.prefix}${command.name} ${command.usage}\`` : `\`${client.config.prefix}${command.name}\``)
                .addField("Description", command.description ? `\`${command.description}\`` : "`Pas de Description`")
                .addField("Permissions", `\`${command.permissions.join(" / ")}\``)
                .setColor("YELLOW")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })

            return message.channel.send({ embeds: [helpCommandEmbed] })
                
        }
    }
}

