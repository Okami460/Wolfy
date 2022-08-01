const client = require("../../index");
const Vc = require('../../models/tempvc');
const jointocreatemap = new Map();



client.on("voiceStateUpdate", async (oldvoice, newvoice) => {



    const temp = await Vc.findOne({
        guildID: newvoice.guild.id || oldvoice.guild.id
    })

    if (!temp) return

    if (newvoice.channel?.id === temp.channelID) {
        await jointocreatechannel(newvoice)
    }
    if (oldvoice.channel?.parentId === temp.categoryID && oldvoice.channel?.id !== temp.channelID) {
        if (oldvoice.channel.members.size <=0) await oldvoice.channel.delete();
    }
    
    
})
async function jointocreatechannel(user) {
    try {
        const vcDB = await Vc.findOne({
            guildID: user.guild.id
        })
        if (!vcDB) return;

        let category = vcDB.categoryID
        if (!category) return;


        await user.guild.channels.create(`Salon de ${user.member.user.username}`, {
            type: 'GUILD_VOICE',
            parent: category,
        }).then(async vc => {

            
            await user.setChannel(vc).catch(() => { })

           // jointocreatemap.set(`tempvoicechannel_${vc.guild.id}_${vc.id}`, vc.id);

            // await vc.permissionOverwrites.edit(
            //     {
            //         id: user.id,
            //         allow: ['MANAGE_CHANNELS'],
            //     },
            //     {
            //         id: user.guild.id,
            //         allow: ['VIEW_CHANNEL'],
            //     },
            // );

            

            
        })
    } catch (err) {
        console.log(err)
    }
}