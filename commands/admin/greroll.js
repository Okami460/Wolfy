module.exports = {
    
    name: "reroll",
    usage: "<message_id>",
    category: "Giveaways",
    permissions: ['ADMINISTRATOR'],
    
    run: async (client, message, args) => {

        if (!message.member.permissions.has('MANAGE_MESSAGES')) return
  
        if (!args[0]) {
            return message.channel.send('veuillez mettre l\'id du message du giveways');
        }

        let giveaway =
            client.giveaways.giveaways.find((g) => g.prize === args.join(' ')) ||
            client.giveaways.giveaways.find((g) => g.messageId === args[0]);

        if (!giveaway) {
            return message.channel.send('impossible de trouver le giveaway`' + args.join(' ') + '`.');
        }

        if (!giveaway.ended) {
            return message.channel.send('le giveaway n\'est pas terminé`' + args.join(' ') + '`.');
        }

        client.giveaways.reroll(giveaway.messageId)
        
    },
}