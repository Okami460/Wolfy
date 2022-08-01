"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordBattleShip = void 0;
const discord_js_1 = require("discord.js");
class DiscordBattleShip {
    constructor(settings) {
        this.settings = settings;
        if (!this.settings.embedColor)
            this.settings.embedColor = "#6b8ba4";
    }
    ;
    async createGame(message) {
        const challenger = message.member; // Define the challenger
        const opponent = message.mentions.members.first(); // Get and define the opponent
        if (!opponent)
            return message.channel.send("Veuillez mentionner votre adversaire !"); 
        if (opponent.id === message.author.id) {
            return message.channel.send("Vous ne pouvez pas vous défier vous même !");}
        const accept = await message.channel.send(`Eh ${opponent}, ${challenger.user.tag} vient de vous mettre au défi, acceptez vous ?`); // Ask if the user would like to play 
        await Promise.all([accept.react("✅"), accept.react("❌")]);
        const acceptFilter = (reaction, user) => user.id === opponent.id && ["✅", "❌"].includes(reaction.emoji.name);
        const acceptedData = await accept.awaitReactions({ filter: acceptFilter,  max: 1, time: 30000 });
        if (acceptedData.size < 1)
            return accept.edit("Il n’a pas réagi à temps, on dirait qu'il a décliné.");
        if (acceptedData.first().emoji.name === "❌")
            return accept.edit("on dirait qu'il a décliné. \:(");
        await accept.delete();
        const trackingEmbed = new discord_js_1.MessageEmbed()
            .setTitle("Jeux Bataille Navale")
            .setFooter(`${challenger.user.tag} vs ${opponent.user.tag}`)
            .setColor(this.settings.embedColor)
            .setDescription("Le jeu a commencé ! Vérifiez vos MP pour obtenir des instructions sur la façon de procéder. Cette intégration sera mise à jour au fur et à mesure que le jeu se poursuit.");
        const trackMsg = await message.channel.send({ embeds: [trackingEmbed] });
        const players = [
            { collector: null, member: challenger, playerHitBoard: this.genBoard(10, 10), playerShipBoard: this.genBoard(10, 10), gameChannel: "", placedBoats: [], gameMessages: { start: "", hits: "", boats: "" }, ready: false },
            { collector: null, member: opponent, playerHitBoard: this.genBoard(10, 10), playerShipBoard: this.genBoard(10, 10), gameChannel: "", placedBoats: [], gameMessages: { start: "", hits: "", boats: "" }, ready: false },
        ];
        let player = 0;
        for (const play of players) {
            const startMsg = await play.member.send(`Voici votre planche d’attaque et de navire de départ! Pour ajouter vos pièces de bateau au bord du navire, veuillez utiliser le format de commande suivant. '${this.settings.prefix}ajouter <ship> <Cordons de bord> <direction>'. Un exemple de ceci serait, '${this.settings.prefix}add destroyer D5 down'\nBateaux Disponible:\ncarrier (5)\nbattleship (4)\ndestroyer (3)\nsubmarine (3)\npatrolboat (2)`);
            const hitBoard = await play.member.send(`Tableau d’attaque:\n${this.displayBoard(play.playerHitBoard, "hit")}`);
            const dmBoard = await play.member.send(`Tableau des Bateaux:\n${this.displayBoard(play.playerShipBoard, "ship")}`);
            play.gameMessages.start = startMsg.id;
            play.gameMessages.hits = hitBoard.id;
            play.gameMessages.boats = dmBoard.id;
            const filter = (msg) => msg.author.id === play.member.id && [`${this.settings.prefix}add`, `${this.settings.prefix}attack`].includes(msg.content.split(" ")[0]);
            const dmCollector = dmBoard.channel.createMessageCollector({filter});
            play.collector = dmCollector;
            play.gameChannel = dmBoard.channel.id;
            const validBoats = [{ name: "carrier", length: 5, hits: 0, sunk: false }, { name: "battleship", length: 4, hits: 0, sunk: false }, { name: "destroyer", length: 3, hits: 0, sunk: false }, { name: "submarine", length: 3, hits: 0, sunk: false }, { name: "patrolboat", length: 2, hits: 0, sunk: false }];
            const validDirrections = ["up", "down", "right", "left"];
            dmCollector.on("collect", async (msg) => {
                const argument = msg.content.slice(this.settings.prefix.length).trim().split(/ +/g);
                const cmd = argument.shift();
                if (!players.find(plr => plr.member.id === msg.author.id).ready) {
                    if (cmd === "add") {
                        const currPlayer = players.find(plr => plr.member.id === msg.author.id);
                        const gameChannelObject = message.client.channels.cache.get(currPlayer.gameChannel);
                        const boatType = argument[0];
                        if (!boatType)
                            return msg.channel.send("Veuillez fournir un bateau à placer.").then(m => { setTimeout(() => { m.delete()}, 15000) });
                        if (!validBoats.some(value => value.name === boatType.toLowerCase()))
                            return msg.channel.send("Veuillez fournir un type de bateau valide à placer.").then(m => { setTimeout(() => { m.delete()}, 15000) });
                        if (players.find(plyr => plyr.member.id === msg.author.id).placedBoats.some(data => data.name === boatType.toLowerCase()))
                            return msg.channel.send("Vous avez déjà placé ce bateau. Veuillez en essayer un autre.").then(m => { setTimeout(() => { m.delete()}, 15000) });
                        const cords = argument[1];
                        if (!cords)
                            return msg.channel.send("Veuillez entrer des cordons pour votre navire. Ex: `D5`").then(m => { setTimeout(() => { m.delete()}, 15000) });
                        const directionRegex = /[a-z]([1-9]|10)/i;
                        if (!cords.match(directionRegex))
                            return msg.channel.send("Veuillez entrer des cordons valide pour votre navire. Ex: `D5`").then(m => { setTimeout(() => { m.delete()}, 15000) });
                        const dirrection = argument[2];
                        if (!dirrection)
                            return msg.channel.send("Veuillez fournir une direction pour positionner votre bateau!").then(m => { setTimeout(() => { m.delete()}, 15000) });
                        if (!validDirrections.some(value => value === dirrection.toLowerCase()))
                            return msg.channel.send(`Veuillez fournir une dirrection valide. Choix valides: ${validDirrections.join(", ")}`).then(m => { setTimeout(() => { m.delete()}, 15000) });
                        const checked = this.checkBoatPos(play.playerShipBoard, validBoats.find(data => data.name === boatType.toLowerCase()), { letter: cords[0], number: parseInt(cords.slice(1)), cord: cords }, dirrection, "check");
                        if (!checked)
                            return msg.channel.send(`Vous ne pouvez pas mettre le ${boatType} à ${cords} parement ${dirrection}`).then(m => { setTimeout(() => { m.delete()}, 15000) });
                        currPlayer.placedBoats.push(validBoats.find(data => data.name === boatType.toLowerCase()));
                        const reRender = this.checkBoatPos(players.find(plyr => plyr.member.id === msg.author.id).playerShipBoard, validBoats.find(boat => boat.name === boatType.toLowerCase()), { letter: cords[0], number: parseInt(cords.slice(1)), cord: cords }, dirrection, "render");
                        currPlayer.playerShipBoard = reRender.board;
                        gameChannelObject.messages.cache.get(currPlayer.gameMessages.boats).edit(`Tableaux de Bateaux:\n${this.displayBoard(reRender.board, "ship")}`);
                        let oldBoat = players.find(p => p.member.id === msg.author.id).placedBoats.find(b => b.name.toLowerCase() === reRender.boat.name.toLowerCase());
                        oldBoat = reRender.boat;
                        const editMe = gameChannelObject.messages.cache.get(currPlayer.gameMessages.start);
                        const regex = new RegExp(boatType.toLowerCase(), "ig");
                        editMe.edit(editMe.content.replace(regex, `~~${boatType.toLowerCase()}~~`));
                        if (currPlayer.placedBoats.length === 5) {
                            currPlayer.ready = true;
                            if (players[0].ready && players[1].ready) {
                                for (const playr of players) {
                                    const perGame = message.client.channels.cache.get(playr.gameChannel);
                                    perGame.messages.cache.get(playr.gameMessages.start).edit(`Vous avez maintenant tous les deux terminé la phase de configuration du jeu! C'est vrai ${players[player].member.user.tag} au tour d’attaquer! Utiliser \`${this.settings.prefix}attack <cords>' pour appeler une attaque à cet endroit!\n\nLegende:\n- Tableaux d'attaque:\n--- ◻️ = Endroit Vide\n--- ⚪ = Attaque Manquée\n--- 🔴 = Attaque de Frappe\n- Tableau des Bateaux:\n--- 🔲 = Emplacement Vide\n--- 🟩 = Navire-unité\n--- 🟥 = Attaque de Frappe\n--- ⚪ = Tir adverse manqué`);
                                    playr.member.send(`${playr.member.user}`).then(m => m.delete());
                                }
                                trackingEmbed.setDescription("");
                                for (const p of players) {
                                    trackingEmbed.addField(p.member.user.tag, `A ${p.placedBoats.filter(b => !b.sunk).length} navires laissés!\n\n${p.placedBoats.map(b => b.sunk ? `❌ ${b.name}` : `✅ ${b.name}`).join("\n")}`);
                                }
                                trackMsg.edit(trackingEmbed);
                            }
                            else
                                return msg.channel.send("Il semble que votre adversaire n’ait pas encore placé tous ses navires! Veuillez attendre qu’il est terminé. Une fois qu’il est terminé, vous obtiendrez un MP.").then(m => { setTimeout(() => { m.delete()}, 15000) });
                        }
                    }
                }
                else if (players[0].ready && players[1].ready) {
                    if (players[player].member.id === msg.author.id) {
                        if (cmd === "attack") {
                            const playerChannel = message.client.channels.cache.get(players[player].gameChannel);
                            const opponentChannel = message.client.channels.cache.get(players[(player + 1) % players.length].gameChannel);
                            const cords = argument[0];
                            if (!cords)
                                return msg.channel.send("Veuillez entrer des cordons pour votre attaque. Ex: `D5`").then(m => { setTimeout(() => { m.delete()}, 15000) });
                            const directionRegex = /[a-z]([1-9]|10)/i;
                            if (!cords.match(directionRegex))
                                return msg.channel.send("Veuillez entrer des cordons valides pour votre attaque. Ex: `D5`").then(m => { setTimeout(() => { m.delete()}, 15000) });
                            const returnData = this.attack(players[player].playerHitBoard, players[(player + 1) % players.length].playerShipBoard, { letter: cords[0], number: parseInt(cords.slice(1)), cord: cords });
                            if (!returnData)
                                return msg.channel.send("Vous ne pouvez pas attaquer là-bas, s’il vous plaît essayez ailleurs!").then(m => { setTimeout(() => { m.delete()}, 15000) });
                            playerChannel.messages.cache.get(players[player].gameMessages.hits).edit(`Tableaux d'Attaque:\n${this.displayBoard(returnData.attackBoard, "hit")}`);
                            players[player].playerHitBoard = returnData.attackBoard;
                            opponentChannel.messages.cache.get(players[(player + 1) % players.length].gameMessages.boats).edit(`Tableau des Bateaux:\n${this.displayBoard(returnData.shipBoard, "ship")}`);
                            players[(player + 1) % 2].playerShipBoard = returnData.shipBoard;
                            const shipToHit = players[(player + 1) % players.length].placedBoats.find(s => s.name.toLowerCase() === returnData.shipName.toLowerCase());
                            if (shipToHit) {
                                shipToHit.hits++;
                                if (shipToHit.hits === shipToHit.length) {
                                    shipToHit.sunk = true;
                                    players[player].member.send(`Vous avez coulé ${players[(player + 1) % players.length].member.user.tag} ${shipToHit.name}!`);
                                    players[(player + 1) % players.length].member.send(`Votre ${returnData.shipName} a coulé !`);
                                    const embed = new discord_js_1.MessageEmbed()
                                        .setTitle("Battaillle navale <:submarine:753289857907818561>")
                                        .setFooter(`${challenger.user.tag} vs ${opponent.user.tag}`)
                                        .setColor(this.settings.embedColor);
                                    for (const p of players) {
                                        embed.addField(p.member.user.tag, `A ${p.placedBoats.filter(b => !b.sunk).length} navires laissés!\n\n${p.placedBoats.map(b => b.sunk ? `❌ ${b.name}` : `✅ ${b.name}`).join("\n")}`);
                                    }
                                    trackMsg.edit({ embeds: [embed] });
                                }
                            }
                            if (this.winCondition(players[(player + 1) % players.length].placedBoats)) {
                                for (const p of players) {
                                    p.collector.stop();
                                    p.member.send(`${players[player].member.user} gagne la partie`);
                                }
                                const embed = new discord_js_1.MessageEmbed()
                                    .setTitle("Battaille Navale <:submarine:753289857907818561>")
                                    .setFooter(`${challenger.user.tag} vs ${opponent.user.tag}`)
                                    .setColor(this.settings.embedColor)
                                    .setDescription(`${players[player].member.user} a gagné la partie !`);
                                trackMsg.edit({ content: `${players[0].member}, ${players[1].member}`,  embeds: [embed] });
                            }
                            playerChannel.messages.cache.get(players[player].gameMessages.start).edit(`C'est au tour de ${players[(player + 1) % players.length].member.user.tag} ! Utilisez \`${this.settings.prefix}attack <cords>\` pour appeler une attaque à cet endroit!\n\nLegend:\n- Tableau d'Attaque:\n--- ◻️ = Emplacement Vide\n--- ⚪ = Attaque Manquée\n--- 🔴 = Attaque de Frappe\n- Tableau des Bateaux:\n--- 🔲 = Emplacement Vide\n--- 🟩 = Navire-unité\n--- 🟥 = Attaque de Frappe\n--- ⚪ = Tir adverse manqué`);
                            opponentChannel.messages.cache.get(players[(player + 1) % players.length].gameMessages.start).edit(`C'est au tour de ${players[(player + 1) % players.length].member.user.tag} ! Utilisez \`${this.settings.prefix}attack <cords>\` pour appeler une attaque à cet endroit!\n\nLegende:\n- Tableau d'Attaque:\n--- ◻️ = Emplacement Vide\n--- ⚪ = Attaque manquée\n--- 🔴 = Attaque de Frappe\n- Tableau des Bateaux:\n--- 🔲 = Emplacement Vide\n--- 🟩 = Navire-unité\n--- 🟥 = Attaque de Frappe\n--- ⚪ = Tir adverse manqué`);
                            player = (player + 1) % players.length;
                            players[player].member.send(`${players[player].member.user}`).then(m => m.delete());
                        }
                    }
                    else
                        return msg.channel.send("Ce n’est pas encore votre tour. Veuillez attendre que l’adversaire attaque.").then(m => m.delete({ timeout: 10000 }));
                }
                else
                    return msg.channel.send("Il semble que l’adversaire / vous n’avez pas / n’avez pas placé tous leurs / vos navires. S’il vous plaît, terminez de placer vos navires ou attendez que votre adversaire termine!").then(m => m.delete({ timeout: 10000 }));
            });
        }
        return message.channel.send("En progression...");
    }
    winCondition(boats) {
        for (const playerBoat of boats) {
            if (!playerBoat.sunk)
                return false;
        }
        return true;
    }
    attack(attackBoard, shipBoard, spot) {
        let shipName = "";
        for (let i = 0; i < shipBoard.length; i++) {
            const index = shipBoard[i].findIndex(data => data.cords.cord.toLowerCase() === spot.cord.toLowerCase());
            if (shipBoard[i].find(data => data.cords.cord.toLowerCase() === spot.cord.toLowerCase())) {
                // Missed attack
                if (shipBoard[i][index].data === "0") {
                    shipBoard[i][index].data = "3";
                    attackBoard[i][index].data = "1";
                    // Successful attack
                }
                else if (shipBoard[i][index].data === "1") {
                    shipBoard[i][index].data = "2";
                    attackBoard[i][index].data = "2";
                    shipName = shipBoard[i][index].ship;
                }
                else
                    return false;
            }
        }
        return { shipBoard, attackBoard, shipName };
    }
    checkBoatPos(board, boat, cords, dirrection, type) {
        for (let i = 0; i < board.length; i++) {
            if (board[i].find(data => data.cords.cord.toLowerCase() === cords.cord.toLowerCase())) {
                switch (dirrection) {
                    case "up":
                        let countUp = 0;
                        let startPosUp = i;
                        do {
                            if (type === "check") {
                                if (board[startPosUp] === undefined)
                                    return;
                                if (board[startPosUp][cords.number - 1].data === "1")
                                    return;
                                countUp++;
                                startPosUp--;
                            }
                            else {
                                board[startPosUp][cords.number - 1].data = "1";
                                board[startPosUp][cords.number - 1].ship = boat.name;
                                countUp++;
                                startPosUp--;
                            }
                        } while (countUp < boat.length);
                        break;
                    case "down":
                        let countDown = 0;
                        let startPosDown = i;
                        do {
                            if (type === "check") {
                                if (board[startPosDown] === undefined)
                                    return;
                                if (board[startPosDown][cords.number - 1].data === "1")
                                    return;
                                countDown++;
                                startPosDown++;
                            }
                            else {
                                board[startPosDown][cords.number - 1].data = "1";
                                board[startPosDown][cords.number - 1].ship = boat.name;
                                countDown++;
                                startPosDown++;
                            }
                        } while (countDown < boat.length);
                        break;
                    case "left":
                        let countLeft = 0;
                        let currIndexLeft = board[i].findIndex(data => data.cords.cord.toLowerCase() === cords.cord.toLowerCase());
                        do {
                            if (type === "check") {
                                currIndexLeft--;
                                if (board[i][currIndexLeft] === undefined)
                                    return;
                                if (board[i][currIndexLeft].data === "1")
                                    return;
                                countLeft++;
                            }
                            else {
                                board[i][currIndexLeft].data = "1";
                                board[i][currIndexLeft].ship = boat.name;
                                currIndexLeft--;
                                countLeft++;
                            }
                        } while (countLeft < boat.length);
                        break;
                    case "right":
                        let countRight = 0;
                        let currIndexRight = board[i].findIndex(data => data.cords.cord.toLowerCase() === cords.cord.toLowerCase());
                        do {
                            if (type === "check") {
                                currIndexRight++;
                                if (board[i][currIndexRight] === undefined)
                                    return;
                                if (board[i][currIndexRight].data === "1")
                                    return;
                                countRight++;
                            }
                            else {
                                board[i][currIndexRight].data = "1";
                                board[i][currIndexRight].ship = boat.name;
                                currIndexRight++;
                                countRight++;
                            }
                        } while (countRight < boat.length);
                        break;
                }
            }
        }
        return { boat, board };
    }
    genBoard(hor, ver) {
        let whileCounter = 0;
        const boardLetter = [{ i: 0, letter: "A" }, { i: 1, letter: "B" }, { i: 2, letter: "C" }, { i: 3, letter: "D" }, { i: 4, letter: "E" }, { i: 5, letter: "F" }, { i: 6, letter: "G" }, { i: 7, letter: "H" }, { i: 8, letter: "I" }, { i: 9, letter: "J" }];
        const doneData = [];
        do {
            const temp = [];
            for (let i = 0; i < ver; i++) {
                const boardLttr = boardLetter.find(data => data.i === whileCounter).letter;
                temp.push({ data: "0", ship: "", cords: { letter: boardLttr, number: i + 1, cord: boardLttr + (i + 1) } });
            }
            doneData.push(temp);
            whileCounter++;
        } while (whileCounter < hor);
        return doneData;
    }
    displayBoard(board, type) {
        let returnData = "";
        returnData = returnData.concat("⬛1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣🔟\n");
        for (let i = 0; i < board.length; i++) {
            let temp = "";
            const leftEmoji = [{ i: 0, emoji: ":regional_indicator_a:" }, { i: 1, emoji: ":regional_indicator_b:" }, { i: 2, emoji: ":regional_indicator_c:" }, { i: 3, emoji: ":regional_indicator_d:" }, { i: 4, emoji: ":regional_indicator_e:" }, { i: 5, emoji: ":regional_indicator_f:" }, { i: 6, emoji: ":regional_indicator_g:" }, { i: 7, emoji: ":regional_indicator_h:" }, { i: 8, emoji: ":regional_indicator_i:" }, { i: 9, emoji: ":regional_indicator_j:" }];
            if (type === "hit") {
                for (let j = 0; j < board[i].length; j++) {
                    // "0" is an empty space, "1" is a missed shot, "2" is a hit shot
                    temp += `${board[i][j].data === "0" ? "◻️" : board[i][j].data === "1" ? "⚪" : "🔴"}`;
                }
            }
            else {
                for (let j = 0; j < board[i].length; j++) {
                    // "0" is an empty space, "1" is a Navire-unité piece, "2" is a Attaque de Frappe piece, "3" is a missed shot from opponent
                    temp += `${board[i][j].data === "0" ? "◻️" : board[i][j].data === "1" ? "🟩" : board[i][j].data === "2" ? "🟥" : "⚪"}`;
                }
            }
            returnData += leftEmoji.find(object => object.i === i).emoji + temp + "\n";
        }
        return returnData;
    }
}
exports.DiscordBattleShip = DiscordBattleShip;
module.exports.DiscordBattleShip = DiscordBattleShip;
//# sourceMappingURL=index.js.map