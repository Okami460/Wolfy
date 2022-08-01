const { MessageEmbed, ReactionCollector, Client, Message, MessageFlags } = require("discord.js");

module.exports = {
    name: "embed",
    category: "moderation",
    description: "Créer un embed",
    permissions: ['MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        let embedBeForEdit = new MessageEmbed()
            .setDescription("᲼")
        
        let embedForEditing = await message.channel.send({ embeds: [embedBeForEdit]})
        const msgwait = await message.channel.send("Veuillez attendre la fin de l'ajout des réactions");

        await Promise.all(['✏️','💬','🕵️','🔻','🔳','🕙','🖼️','🌐','🔵','↩️', '↪️','📥','✅','📑'].map(r => msgwait.react(r)));
        await msgwait.edit(`:pencil2: Modifier le titre\n:speech_balloon: Modifier la description\n:detective: Modifier l'auteur\n:small_red_triangle_down: Modifier le footer\n:white_square_button: Modifier le thumbnail\n:clock10: Ajouter un timestamp\n:frame_photo: Modifier l'image\n:globe_with_meridians: Modifier l'url\n:blue_circle: Modifier la couleur\n:leftwards_arrow_with_hook: Ajouter un field\n:arrow_right_hook: Supprime un field\n:inbox_tray: Copier un embed existant\n:white_check_mark: Envoyer l'embed\n:bookmark_tabs: Modifier un message du bot avec cet embed`)

        const filterReaction = (reaction, user) =>  user.id === message.author.id && !user.bot;
        const filterMessage = (m) => m.author.id === message.author.id && !m.author.bot;
        const collectReaction = await new ReactionCollector(msgwait, filterReaction);
        collectReaction.on("collect", async reaction => {
            reaction.users.remove(message.author);
            switch(reaction._emoji.name){
                case '✏️':
                    const msgQuestionTitle = await message.channel.send("Quel est votre titre ?");
                    const title = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionTitle.delete();
                    title.delete();
                    embedBeForEdit.setTitle(title.content);
                    embedForEditing.edit({ embeds: [embedBeForEdit]})
                    
                    
                break;
                case '💬':
                    const msgQuestionDescription = await message.channel.send("Quelle est votre decription ?")
                    const description = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionDescription.delete();
                    description.delete()
                    embedBeForEdit.setDescription(description.content)
                    embedForEditing.edit({ embeds: [embedBeForEdit]})
                break;
                case '🕵️':
                    const msgQuestionAuteur = await message.channel.send("Quelle est l'auteur ?")
                    const auteur = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionAuteur.delete();
                    auteur.delete()
                    embedBeForEdit.setAuthor(auteur.content)
                    embedForEditing.edit({ embeds: [embedBeForEdit]})
                break;
                case '🔻':
                    const msgQuestionFooter = await message.channel.send("Quelle est le footer ?")
                    const footer = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionFooter.delete();
                    footer.delete()
                    embedBeForEdit.setFooter(footer.content)
                    embedForEditing.edit({ embeds: [embedBeForEdit]})
                break;
                case '🔳':
                    const msgQuestionThumbnail = await message.channel.send("Quelle est votre thumbnail ?")
                    const thumbnail = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    if(!thumbnail.content.includes("http" || !thumbnail.content.includes("https"))) return message.channel.send("Thumbnail incorrect")
                    msgQuestionThumbnail.delete();
                    thumbnail.delete()
                    embedBeForEdit.setThumbnail(thumbnail.content)
                    embedForEditing.edit({ embeds: [embedBeForEdit]})
                break;
                case '🕙':
                    embedBeForEdit.setTimestamp()
                    embedForEditing.edit({ embeds: [embedBeForEdit]})
                break;
                case '🖼️':
                    const msgQuestionImage = await message.channel.send("Quelle est votre image ?")
                    const image = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    if(!image.content.includes("http" || !image.content.includes("https"))) return message.channel.send("Image incorrect")
                    msgQuestionImage.delete();
                    image.delete()
                    embedBeForEdit.setImage(image.content)
                    embedForEditing.edit({ embeds: [embedBeForEdit]})
                break;
                case '🌐':
                    const msgQuestionUrl = await message.channel.send("Quelle est votre lien internet ?")
                    const url = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionUrl.delete();
                    url.delete()
                    embedBeForEdit.setURL(url.content)
                    embedForEditing.edit({ embeds: [embedBeForEdit]})
                break;
                case '🔵':
                    const msgQuestionColor = await message.channel.send("Quelle est votre couleur (veuillez mettre la couleur hexadecimal)?")
                    const color = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionColor.delete();
                    color.delete()
                    embedBeForEdit.setColor(color.content)
                    embedForEditing.edit({ embeds: [embedBeForEdit]})
                break; 
                case '↩️':
                    const msgQuestionField = await message.channel.send("Quelle est le titre du Field ?")
                    const titlefield = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionField.delete();
                    titlefield.delete()
                    const msgQuestionDescField = await message.channel.send("Quelle est la description du Field ?")
                    const descfield = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionDescField.delete();
                    descfield.delete()
                    embedBeForEdit.addField(titlefield.content, descfield.content)
                    embedForEditing.edit({ embeds: [embedBeForEdit]})
                break;
                case '✅':
                    const msgQuestionChannel = await message.channel.send("Merci de mettre l'id du salon")
                    const channel = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionChannel.delete();
                    channel.delete()
                    if (!message.guild.channels.cache.get(channel.content)) return ('Salon introuvable');
                    else {

                        message.guild.channels.cache.get(channel.content).send({ embeds: [embedForEditing.embeds[0]]});} 

                break;
                case '↪️':
                    const msgQuestionFieldTtile = await message.channel.send("Merci de mettre le titre du field a enlever")
                    const field_title = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000 })).first();
                    msgQuestionFieldTtile.delete();
                    field_title.delete();
                    let indexField = '';
                    embedBeForEdit.fields.map(field => {
                        if (indexField !== '' ) return;
                        if (field.name === field_title.content ) indexField+=embedBeForEdit.fields.indexOf(field);
                    })

                    if (indexField === '') return message.channel.send('Aucun field trouvé').then(msg => msg.delete({ timeout: 5000 }));
                    delete embedBeForEdit.fields[indexField];
                    embedForEditing.edit({ embeds: [embedBeForEdit]});
                break;
                case '📥':
                    const msgQuestionChannelID = await message.channel.send("Veuillez mettre l'id du Salon");
                    const channel_id  = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000 })).first();
                    msgQuestionChannelID.delete();
                    channel_id.delete();
                    if(!Number(channel_id.content) || !message.guild.channels.cache.get(channel_id.content)) return message.channel.send("Salon invalide").then(msg => { setTimeout(() => { msg.delete()}, 5000)});
                    const msgQuestionMessageID = await message.channel.send("Veuillez mettre l'id du message");
                    const message_id = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionMessageID.delete()
                    message_id.delete();
                    if(!Number(message_id.content) || !message.guild.channels.cache.get(channel_id.content).messages.fetch(message_id.content)) return message.channel.send("Message invalide").then(msg => { setTimeout(() => { msg.delete()}, 5000)});
                    let msg = await message.guild.channels.cache.get(channel_id.content).messages.fetch(message_id.content);
                    if (msg.embeds.length === 0) return message.channel.send("Ce message n'est pas un embed").then(msg => { setTimeout(() => { msg.delete()}, 5000)});
                    embedForEditing.edit({ embeds: [msg.embeds[0]]});
                break;
                case '📑':
                    const msgQuestionChannel_ID = await message.channel.send("Merci de mettre l'id du Salon");
                    const channel_ID = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionChannel_ID.delete()
                    channel_ID.delete();
                    if(!Number(channel_ID.content) || !message.guild.channels.cache.get(channel_ID.content)) return message.channel.send("Salon invalide").then(msg => { setTimeout(() => { msg.delete()}, 5000)});
                    const msgQuestionMessage_ID = await message.channel.send("Veuillez mettre l'id du message");
                    const message_ID = (await message.channel.awaitMessages({ filter: filterMessage,  max: 1, time: 60000})).first();
                    msgQuestionMessage_ID.delete()
                    message_ID.delete();
                    if(!Number(message_ID.content) || !message.guild.channels.cache.get(channel_ID.content).messages.fetch(message_ID.content)) return message.channel.send("Message invalide").then(msg => { setTimeout(() => { msg.delete()}, 5000)});
                    const msg1 = await message.guild.channels.cache.get(channel_ID.content).messages.fetch(message_ID.content);
                    msg1.edit({ embeds: [embedForEditing.embeds[0]]});
    
                break;
            }
        })
    }
}