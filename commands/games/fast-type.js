const Canvas = require("canvas");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const fastwords = ["Bonjour", "test", "Wow", "Amérique", "Tomate", "Discord", "discord", "minecraft", "Minecraft", "ps4", "Playsation", "x-box", "japon", "Tokyo", "hentai", "téléphone", "pc", "ordinateur", "sport", "éducation", "wolfy", "bot", "Okami", "actuellement", "frère", "soeur", "mère", "bienvenue", "or", "argent", "bronze", 
"installer", "programmation", "crème-glacé", "intermarché", "attend", "ptdr", "mdr", 'instagram', "bruh", "ennemie", "dangereux", "enchant", "vélo", "constitution", "entropie", "yamete", "senpaï", "désolidariserions", "développement", "prolétariat", "Kouign-amann", "Trottinette", "myrrhe", "mythologie", "coccyx", "kudasaï", 
"prestidigitateur", "métempsychose", "phénylalanine", "désoxyribonucléique", "smaragdin", "émeraude", "cabillaud", "seiche", "serveur", "nitescence", "mascarade", "caduc", "phénomène", "obscurité", "chimpanzé", "fenrir", "týr", "copyright", "inégalité", "mathématique", "perclus"]

module.exports = {
    name: 'fast-type',
    aliases: ["ft", "fast"],
    permissions: ['SEND_MESSAGES'],
    category: "game",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let fastEmebd = new MessageEmbed()
            .setAuthor(`Wolfy`, client.user.displayAvatarURL())
            .setColor("GREY")
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setDescription(`Dans \`5 secondes\` votre mot apparaîtra`)
            const a = await message.channel.send({ embeds: [fastEmebd]})
            await delay(5000);
            let x = 20000;

            let msg = fastwords[Math.floor(Math.random() * fastwords.length)];
                const channel = message.channel;
                if (!channel) return;
                const canvas = Canvas.createCanvas(800, 250);
                const ctx = canvas.getContext('2d');
                const background = await Canvas.loadImage("botConfig/assets/images/fond.jpg")
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = '#C0C0C0';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
                ctx.font = '56px Impact';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(msg, canvas.width / 2.35, canvas.height / 1.8);
                ctx.beginPath();
                ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                ctx.closePath()
                ctx.clip();
                const avatar = await Canvas.loadImage(message.member.user.displayAvatarURL({ format: 'jpg' }))
                ctx.drawImage(avatar, 25, 25, 200, 200)
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'fast-image.png');
                let fastemebd2 = new Discord.MessageEmbed()
                    .setAuthor("Wolfy", client.user.displayAvatarURL())
                    .setColor("#00ffff")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter(client.user.username, client.user.displayAvatarURL())
                    .setImage("attachment://fast-image.png")
                    .addField(`vous avez`, `\`${x/1000} Secondes\``)
                    a.delete();
                    const b = await message.reply({ embeds: [fastemebd2], files: [attachment]});
            let i =0;
            var date = new Date();
            await b.channel.awaitMessages({ filter: m => m.author.id == message.author.id,
                max: 1, time: x, errors: ['time'],} ).then(async collected => {
                    x = collected.first().content;
                }).catch(() => {return i++;});
                    if (i===1) return message.reply("votre temps s’est écoulé");
                    var  date2 = new Date();
                if (x===msg) return message.reply(`**Wouah vous êtes rapides ! et juste ! :white_check_mark:** \n\nvous aviez besoin \`${(date2-date)/1000} secondes\``);
                else return message.reply("**Beep, Boop, c’est faux ! :x:**")
    }
}

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms)
    });
}
