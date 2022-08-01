const { MessageEmbed, Message } = require("discord.js");

module.exports = {
    name: "puissance4",
    aliases: ["ps4", "p4"],
    category: "game",
    usage: "<@membre>",
    permissions: ['SEND_MESSAGES'],
    description: "permet de jouer au puissance 4",

    run: async (client, message, args) => {

        const challenger = message.member;
        const oppenent = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!oppenent) return message.channel.send("veuillez mentionner votre adversaire");

        const board = [
            ["⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️"],
            ["⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️"],
            ["⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️"],
            ["⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️"],
            ["⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️"],
            ["⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️", "⚫️"],
        ];

        const renderBoard = (board) => {
            let tempString = "";
            for (const boardSection of board) {
                tempString += `${boardSection.join("")}\n`;
            }

            tempString = tempString.concat("1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣");

            return tempString;
        }

        const initialState = renderBoard(board);

        const initial = new MessageEmbed()
            .setDescription(initialState);

        const gameMessage = await message.channel.send({ embeds: [initial]});

        ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"].forEach(async el => gameMessage.react(el));

        const gameFilter = (reaction, user) => ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"].includes(reaction.emoji.name) && (user.id === oppenent.id || user.id === challenger.id);

        const gameCollector = gameMessage.createReactionCollector({ filter: gameFilter});

        const gameData = [
            { member: challenger, playerColor: "🔴" },
            { member: oppenent, playerColor: "🔵" }
        ];

        let player = 0;


        const checkFour = (a, b, c, d) => (a === b) && (b === c) && (c === d) && (a !== "⚫️");

        const horizontalCheck = () => {
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 4; j++) {
                    if (checkFour(board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3])) return [
                        board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3]
                    ];
                }
            }
        }

        const verticalCheck = () => {
            for (let j = 0; j < 7; j++) {
                for (let i = 0; i < 3; i++) {
                    if (checkFour(board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j])) return [
                        board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j]
                    ];
                }
            }
        }

        const diagonal1 = () => {
            for (let col = 0; col < 4; col++) {
                for (let row = 0; row < 3; row++) {
                    if (checkFour(board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3])) return [
                        board[row][col], board[row + 1][col + 1], board[row + 2], board[col + 2], board[row + 3][col + 3]
                    ]
                }
            }
        }

        const diagonal2 = () => {
            for (let col = 0; col < 4; col++) {
                for (let row = 5; row > 2; row--) {
                    if (checkFour(board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3])) return [
                        board[row][col], board[row - 1][col + 1], board[row - 2][col + 2], board[row - 3][col + 3]
                    ]
                }
            }
        }

        const tieCheck = () => {
            let count = 0;
            for (const el of board) {
                for (const string of el) {
                    if (string !== "⚫️") count++;
                }
            }
            if (count === 42) return true;
            else return false;
        }

        const checks = [horizontalCheck, verticalCheck, diagonal1, diagonal2];

        gameCollector.on("collect", (reaction, user) => {

            if (user.id === gameData[player].member.id) {
                reaction.users.remove(user)

                const openSpaces = [];


                switch (reaction.emoji.name) {

                    case "1️⃣":

                        for (let i = 5; i > -1; i--) {
                            if (board[i][0] === "⚫️") openSpaces.push({ i, j: 0 });
                        }
                        if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, cette colonne est déjà pleine. Choisissez-en un autre.`);
                        else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;

                        break;
                    case "2️⃣":

                        for (let i = 5; i > -1; i--) {
                            if (board[i][1] === "⚫️") openSpaces.push({ i, j: 1 });
                        }
                        if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, cette colonne est déjà pleine. Choisissez-en un autre.`);
                        else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;

                        break;
                    case "3️⃣":
                        for (let i = 5; i > -1; i--) {
                            if (board[i][2] === "⚫️") openSpaces.push({ i, j: 2 });
                        }
                        if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, cette colonne est déjà pleine. Choisissez-en un autre.`);
                        else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                    case "4️⃣":
                        for (let i = 5; i > -1; i--) {
                            if (board[i][3] === "⚫️") openSpaces.push({ i, j: 3 });
                        }
                        if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, cette colonne est déjà pleine. Choisissez-en un autre.`);
                        else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                    case "5️⃣":
                        for (let i = 5; i > -1; i--) {
                            if (board[i][4] === "⚫️") openSpaces.push({ i, j: 4 });
                        }
                        if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, cette colonne est déjà pleine. Choisissez-en un autre.`);
                        else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                    case "6️⃣":
                        for (let i = 5; i > -1; i--) {
                            if (board[i][5] === "⚫️") openSpaces.push({ i, j: 5 });
                        }
                        if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, cette colonne est déjà pleine. Choisissez-en un autre.`);
                        else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;
                    case "7️⃣":
                        for (let i = 5; i > -1; i--) {
                            if (board[i][6] === "⚫️") openSpaces.push({ i, j: 6 });
                        }
                        if (openSpaces.length === 0) return message.channel.send(`${gameData[player].member}, cette colonne est déjà pleine. Choisissez-en un autre.`);
                        else board[openSpaces[0].i][openSpaces[0].j] = gameData[player].playerColor;
                        break;

                }

                if (tieCheck()) {

                    const TieEmbed = new MessageEmbed()
                        .setDescription(renderBoard(board))
                    gameCollector.stop("Egalité !");
                    return gameMessage.edit({ content: `c'est une égaliter !`,  embeds: [TieEmbed] });

                }

                for (const func of checks) {

                    const data = func();
                    if (data) {

                        const WinEmbed = new MessageEmbed()
                            .setDescription(renderBoard(board))
                        gameCollector.stop(`${gameData[player].member.id} gagne !`);
                        return gameMessage.edit({ content:`${gameData[player].member} a gagner la partie`, embeds: [WinEmbed] });

                    }

                }

                player = (player + 1) % 2;

                const newEmbed = new MessageEmbed()
                    .setDescription(`c'est au tour de ${gameData[player].member} de jouer\n${renderBoard(board)}\n
                    🔴 - ${challenger}\n
                    🔵 - ${oppenent}`)
                gameMessage.edit({ embeds: [newEmbed] });

            }

        });

    }

}