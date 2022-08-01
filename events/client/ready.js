const client = require("../../index")


client.on("ready", () => {

    function pickStatus() {
        let status = ["le menu help", "une partie de loup-Garou", "un hurlement de pleine lune", "et chasse dans la forêt", "et enmerde Okami"]
        const rotateStatus = Math.floor(Math.random() * status.length);

        client.user.setActivity(status[rotateStatus], {
            type: "STREAMING",
            url: "https://www.twitch.tv/okami635"
        })
    }

    client.user.setStatus("online")

    setInterval(pickStatus, 3000)

    client.logger.log(`${client.user.tag} est connecté !`, "success");
})