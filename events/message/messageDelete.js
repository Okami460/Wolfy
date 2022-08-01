const client = require("../../index")



client.on("messageDelete",  (message) => {
    if (message.channel.type === "DM") return


    client.snipes.set(message.channel.id, {
        content: message.content,
        author: (message.member.id),
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })

})