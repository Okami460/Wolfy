const schema = require('../../models/custom-commands');

module.exports = {
    name: 'cmd-delete',
    usage: '<nom de la commande custom>',
    permissions: ['ADMINISTRATOR'],
    run: async(client, message, args) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('Vous n\'avez pas les permissions');

        const name = args[0];

        if(!name) return message.channel.send('Veuillez spécifier le nom de la commande');

        const data = await schema.findOne({ Guild: message.guild.id, Command: name });
        if(!data) return message.channel.send('La commande custome n\'existe pas');
        await schema.findOneAndDelete({ Guild: message.guild.id, Command: name });
        message.channel.send(`Suppression **${name}** du commande custome!`);
    }
}