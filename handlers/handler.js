const fs = require("fs")
const ascii = require("ascii-table")
let table = new ascii("Liste des Commandes")
table.setHeading("Commande", "Status")


module.exports = client => {

    /*Handler Commands */
    fs.readdirSync("./commands").forEach(dir => {
        const commands = fs.readdirSync(`./commands/${dir}`).filter(files => files.endsWith(".js"))


        for (let files of commands) {
            let get = require(`../commands/${dir}/${files}`)
            if (get.name) {
                client.commands.set(get.name, get)
                table.addRow(files, "✅")
            } else {
                table.addRow(files, "❌")
                continue;
            }
            if (get.aliases && Array.isArray(get.aliases)) get.aliases.forEach(alias => client.aliases.set(alias, get.name))
        }
    })

    
    console.log(table.toString())
    client.logger.log(`${client.commands.size} commandes chargé`, "cmd");

    /*Handler Events */
    fs.readdirSync("./events").forEach(dir => {
        const events = fs.readdirSync(`./events/${dir}`).filter(files => files.endsWith(".js"))

        for (let files of events) {
            let get = require(`../events/${dir}/${files}`)

            if (get.name) {
                client.events.set(get.name, get)
            } else {
                client.events.set(files, get)
                continue;
            }
        }

        
    })
    client.logger.log(`${client.events.size} évènements chargé`, "event");
}

