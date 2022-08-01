const schema = require('../../models/custom-commands');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "cmd-list",
    permissions: ['ADMINISTRATOR'],

    run: async(client, message, args) => {
        const data  = await schema.find({ Guild: message.guild.id });
        console.log(data)
        if(!data) return message.channel.send('Il n\'a pas de commande custome');
         message.channel.send({ embeds: [
            new MessageEmbed()
                .setColor('BLUE')
                .setDescription(
                    data.map((cmd, i) => 
                        `${i + 1}: ${cmd.Command}`
                    ).join('\n') 
                )
        ]})
    }
}
