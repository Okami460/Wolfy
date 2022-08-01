const schema = require('../../models/custom-commands');

module.exports = {
    name: 'cmd-create',
    category: "admin",
    usage: "<nom_commande> <réponse_commande>",
    permissions: ['ADMINISTRATOR'],

    run: async(client, message, args) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('Vous n\'avez pas les permissions');

        const name = args[0]; 
        const response = args.slice(1).join(" ");

        if(!name) return message.channel.send('Veuillez spécifier le nom de la commande');
        if(!response) return message.channel.send('Veuillez spécifier une réponse');

        const data = await schema.findOne({ Guild: message.guild.id, Command: name });
        if(data) return message.channel.send('Cette commande custome existe déjà !');
        const newData =  new schema({
            Guild: message.guild.id,
            Command: name,
            Response: response
        })
        await newData.save();
        message.channel.send(`Sauvegarder **${name}** autant que commande custome !`);
    }
}