//const { prefix } = require("../../Botconfig/config.json");


let game = {
    roles: {
        LG: {
            count: 1,
            inGame: 0,
            description: "Survivez et ne vous faites pas voter! Si vous êtes le seul loup-garou en jeu, vous devenez le loup solitaire et vous pouvez vérifier l’une des cartes centrales.",
            perform: function () {
                return werewolf();
            },
        },
        Villageois: { count: 1, inGame: 0, description: "Découvrez qui est le loup-garou et votez-le!" },
        Minion: {
            count: 1,
            inGame: 0,
            description: "Aidez les Loups-Garous à gagner. Les loups-garous ne savent pas qui vous êtes.",
            perform: function () {
                return minion();
            },
        },
        Maçon: {
            count: 0,
            inGame: 0,
            description: "Vous apprenez à connaître qui est l’autre joueur de Maçon. Si vous ne voyez personne, cela signifie que la carte Maçon est au centre.",
            perform: function () {
                return mason();
            },
        },
        Voyante: {
            count: 1,
            inGame: 0,
            description: "Vous pouvez vérifier la carte d’un joueur ou deux des cartes centrales.",
            perform: function (player) {
                return seer(player);
            },
        },
        Voleur: {
            count: 1,
            inGame: 0,
            description: "Vous pouvez échanger votre carte avec l’un des joueurs et regarder votre nouvelle carte. (Vous ne pouvez rien faire)",
            perform: function (player) {
                return robber(player);
            },
        },
        Troublemaker: {
            count: 0,
            inGame: 0,
            description: "Vous pouvez échanger deux cartes de joueurs l’une avec l’autre sans qu’ils le sachent. (Cette action inclut l’échange avec un autre joueur)",
            perform: function (player) {
                return troublemaker(player);
            },
        },
        Ivre: {
            count: 0,
            inGame: 0,
            description: "Vous êtes tellement ivre que vous devez échanger votre carte avec l’une des cartes centrales sans connaître la carte.",
            perform: function (player) {
                return drunk(player);
            },
        },
        Insomniac: {
            count: 0,
            inGame: 0,
            description: "Vous vous réveillez juste avant tout le monde et vérifiez votre carte finale.",
            perform: function () {
                return insomniac();
            },
        },
        Tanneur: { count: 0, inGame: 0, description: "Vous détestez tellement votre travail que vous voulez mourir. Faites-vous voter pour gagner!" },
        Chasseur: {
            count: 0,
            inGame: 0,
            description: "Lorsque vous êtes éliminé, vous pouvez tirer sur un joueur et le tuer.",
            perform: function () {
                return hunter();
            },
        },
        Sosie: {
            count: 0,
            inGame: 0,
            description: "Vous pouvez regarder la carte d’un joueur et devenir ce rôle pour le reste du jeu.",
            role: "",
            perform: function () {
                return doppelganger();
            },
        },
    },
    players: [],
    deck: [],
    emojis: {
        join: "🎮",
        start: "🟢",
        confirm: "✅",
        deny: "❌",
        Werewolf: "🐺",
        Minion: "🧟",
        Villager: "👨",
        Seer: "🧙‍♂️",
        Robber: "🦹",
        Troublemaker: "🤷",
        Drunk: "🍺",
        Hunter: "🔫",
        Mason: "👷",
        Insomniac: "🦉",
        Tanner: "💀",
        Doppelganger: "🤡",
        numbers: ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"],
    },
    timers: { role: 6000, discussion: 10000, vote: 10000 },
    collectors: [],
    order: ["LG", "Minion", "Maçon", "Voyante", "Voleur", "Troublemaker", "Ivre", "Insomniac"],
    on: false,
};

let noPermissionNotice = "Le bot n’est pas autorisé à envoyer un message à ce salon.";

module.exports = {
    name: "lg",
    description: "LG",
    permissions: ['SEND_MESSAGES'],
    run: async function (client, message, args) {
        console.log(gameCondition());

        try {
            if (game.players.length) return message.channel.send("Un jeu est déjà en session.");

            const welcomeMsg = await message.channel.send("Bienvenue ! Appuyez sur l’icône du contrôleur pour joindre ou tapez 'squish join'.");
            await welcomeMsg.react(game.emojis.join);
            await welcomeMsg.react(game.emojis.start);

            
            const filter = (reaction, user) => [game.emojis.join, game.emojis.start].includes(reaction.emoji.name) && !user.bot;
            
            const options = { time: 60000, dispose: true };
            const welcomeMsgCollector = welcomeMsg.createReactionCollector({filter, options});
            game.collectors.push(welcomeMsgCollector);

            
            welcomeMsgCollector.on("collect", (reaction, user) => {
                if (reaction.emoji.name === game.emojis.join) {
                    if (game.players.findIndex((i) => i.id === user.id) === -1) {
                        game.players.push(user);
                        console.log(`${user.username} a rejoint.`);
                    }
                } else if (user.id === message.author.id) {
                    welcomeMsgCollector.stop();
                    console.log(`Bouton Démarrer enfoncé.`);
                    console.log(`Joueurs rejoints ${game.players.map((player) => player.username)}`);

                    if (!game.players.length) return message.channel.send("Impossible de démarrer le jeu sans aucun joueur.");
                    setRoles(message);
                }
            });

            //remove users that un-reacted "🎮"
            welcomeMsgCollector.on("remove", (reaction, user) => {
                let userIndex = game.players.findIndex((i) => i.id === user.id);
                if (userIndex !== -1) {
                    game.players.splice(userIndex, 1);
                    console.log(`${user.username} retiré.`);
                }
            });
        } catch (err) {
            console.log(noPermissionNotice);
        }
    },

    join: function (message) {
        if (game.on) return message.channel.send("Impossible de rejoindre lorsque le jeu est en session.").catch(() => console.log(noPermissionNotice));

        if (game.players.findIndex((i) => i.id === message.author.id) === -1) {
            game.players.push(message.author);
            console.log(`${message.author.username} a rejoint.`);
        }
    },

    leave: function (message) {
        if (game.on) return message.channel.send("Impossible de quitter lorsque le jeu est en session.").catch(() => console.log(noPermissionNotice));

        let userIndex = game.players.findIndex((i) => i.id === message.author.id);
        if (userIndex !== -1) {
            game.players.splice(userIndex, 1);
            console.log(`${message.author.username} retiré.`);
        }
    },

    players: function (message) {
        if (!game.players.length) return message.channel.send("Pas de joueurs.").catch(() => console.log(noPermissionNotice));
        message.channel.send(game.players);
    },

    roles: function (message) {
        let rolesString = "";
        let keys = Object.keys(game.roles);

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (game.roles[key]) {
                rolesString += `${game.emojis[key]} ${game.emojis.confirm.repeat(game.roles[key].count)} (${key})\n`;
            } else {
                rolesString += `${game.emojis[key]} ${game.emojis.deny} (${key})\n`;
            }
        }

        message.channel.send(rolesString).catch(() => console.log(noPermissionNotice));
    },

    add: function (message, args) {
        if (game.on) return message.channel.send("Impossible de modifier les rôles lorsque le jeu est en session.").catch(() => console.log(noPermissionNotice));

        for (let i = 0; i < args.length; i++) {
            let roleName = args[i][0].toUpperCase() + args[i].slice(1).toLowerCase();
            if (game.roles[roleName]) {
                game.roles[roleName].count += 1;
                console.log(`Ajout ${roleName} (${game.roles[roleName].count})`);
            }
        }
        getBalanceNotice(message);
    },

    remove: function (message, args) {
        if (game.on) return message.channel.send("Impossible de modifier les rôles lorsque le jeu est en session.").catch(() => console.log(noPermissionNotice));

        for (let i = 0; i < args.length; i++) {
            let roleName = args[i][0].toUpperCase() + args[i].slice(1).toLowerCase();
            if (game.roles[roleName].count > 0) {
                game.roles[roleName].count -= 1;
                console.log(`Retiré ${roleName} (${game.roles[roleName].count})`);
            }
        }
        getBalanceNotice(message);
    },

    stop: function (message) {
        if (!game.on && !game.players.length) return message.channel.send("Pas de jeu en session.").catch(() => console.log(noPermissionNotice));

        game.on = false;
        game.roles.Sosie.role = "";
        game.timer.cancel();
        clearTimeout(game.timer);

        
        let entries = Object.keys(game.roles);
        for (let i = 0; i < entries.length; i++) {
            let roleName = entries[i];
            game.roles[roleName].inGame = 0;
        }

        
        for (let i = 0; i < game.collectors.length; i++) {
            game.collectors[i].stop();
        }

        
        game.players = [];
        game.deck = [];
        game.collectors = [];

        console.log(gameCondition());
        message.channel.send("Jeux terminé");
        console.log("Arrêter. Jeu terminé.");
    },

    again: function (message) {
        if (game.on && game.players.length) return message.channel.send("Le jeu est en session.").catch(() => console.log(noPermissionNotice));
        if (!game.on && !game.players.length) return message.channel.send("Pas d’historique de joueurs précédents.").catch(() => console.log(noPermissionNotice));

        game.on = false;
        game.roles.Sosie.role = "";
        if (game.timer) {
            game.timer.cancel();
            clearTimeout(game.timer);
        }

        
        let entries = Object.keys(game.roles);
        for (let i = 0; i < entries.length; i++) {
            let roleName = entries[i];
            game.roles[roleName].inGame = 0;
        }

        
        for (let i = 0; i < game.collectors.length; i++) {
            game.collectors[i].stop();
        }

        
        game.deck = [];
        game.collectors = [];

        console.log("Play again.");
        startGame(message);
    },

    skip: function () {
        game.timer.cancel();
    },
};

function gameCondition() {
    let gameOn = game.on;
    let players = game.players.map((player) => player.username);
    let deck = game.deck;
    let roles = getPlayersRoles();
    return { gameOn, players, deck, roles };
}

function timeout(ms) {
    let resolve, reject;
    let promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
    });

    promise.timeout = setTimeout(function () {
        resolve(`${ms} fois plus haut.`);
    }, ms);

    promise.cancel = function () {
        reject("Skippé");
        clearTimeout(promise.timeout);
    };

    return promise;
}

function werewolf() {
    return new Promise(async (resolve, reject) => {
        if (game.roles.LG.inGame === 1) {
            const player = game.players.find((player) => player.role === "LG");

            const msg = await player.send("Vous êtes un loup solitaire. Vous pouvez voir une carte au milieu.");
            for (let i = 1; i <= 3; i++) {
                msg.react(game.emojis.numbers[i]);
            }

            let madeAnAction = false;

            const filter = (reaction, user) => game.emojis.numbers.includes(reaction.emoji.name) && !user.bot;
            const options = { max: 1, time: game.timers.role };
            const collector = msg.createReactionCollector({filter, options});
            game.collectors.push(collector);

            collector.on("collect", (reaction, user) => {
                madeAnAction = true;
                let choice = 0;

                if (reaction.emoji.name === game.emojis.numbers[1]) {
                    choice = 1;
                } else if (reaction.emoji.name === game.emojis.numbers[2]) {
                    choice = 2;
                } else if (reaction.emoji.name === game.emojis.numbers[3]) {
                    choice = 3;
                }

                let card = game.deck[game.deck.length - choice];
                player.send(`Carte ${choice} c'est ${card}.`);
                resolve(`Loup solitaire (${player.username}) carte choisie ${choice} ${card}.`);
            });

            collector.on("end", () => {
                if (!madeAnAction) {
                    player.send(`Temps en haut. Vous avez choisi de ne rien faire.`);
                    resolve(`Loup solitaire (${player.username}) a choisi de ne rien faire.`);
                }
            });
        } else {
            for (let i = 0; i < game.players.length; i++) {
                let player = game.players[i];
                if (player.role === "LG") {
                    if (game.roles.LG.inGame === 2) player.send(`(${findOtherPlayersWithRole("Loup Garou", player)[0]}) est votre coéquipier.`);
                    if (game.roles.LG.inGame > 2) player.send(`(${findOtherPlayersWithRole("Loup Garou", player).join(", ")}) sont vos coéquipiers.`);
                }
            }
            resolve(`Les loups-garous ont vérifié leurs coéquipiers.`);
        }
    });
}

function minion() {
    return new Promise((resolve) => {
        let werewolfCount = game.roles.LG.inGame;
        for (let i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            if (player.role === "Minion") {
                if (!werewolfCount) player.send(`Il n’y a pas de loup-garou en jeu. Survivre et ne pas être voté pour gagner.`);
                if (werewolfCount) player.send(`Empêcher ce lecteur (${findPlayersWithRole("LG")[0]}) d’être éliminé pour gagner.`);
                if (werewolfCount > 1) player.send(`Empêcher ces joueurs (${findPlayersWithRole("LG").join(", ")}) d’être éliminé pour gagner.`);
            }
        }
        resolve("Minion checked their masters");
    });
}

function mason() {
    return new Promise((resolve) => {
        let masonCount = game.roles.Maçon.inGame;
        for (let i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            if (player.role === "Maçon") {
                if (masonCount === 1) player.send(`Vous êtes seul.`);
                if (masonCount === 2) player.send(`(${findOtherPlayersWithRole("Maçon", player)[0]}) est l’autre maçon.`);
                if (masonCount > 2) player.send(`(${findOtherPlayersWithRole("Maçon", player).join(", ")}) sont les autres maçon`);
            }
        }
        resolve("Les maçons vérifiaient entre eux.");
    });
}

function seer(player) {
    return new Promise(async (resolve, reject) => {
        if (!player) player = game.players.find((player) => player.role === "Voyante");

        const msg = await player.send(`vous pouvez:\n${game.emojis.numbers[1]} regardez la carte d’un autre joueur.\n${game.emojis.numbers[2]} regardez 2 cartes au milieu.`);
        await msg.react(game.emojis.numbers[1]);
        await msg.react(game.emojis.numbers[2]);

        const filter = (reaction, user) => game.emojis.numbers.includes(reaction.emoji.name) && !user.bot;
        const options = { max: 1, time: game.timers.role };
        const collector = msg.createReactionCollector({filter, options});
        game.collectors.push(collector);
        let option = 0;

        collector.on("collect", (reaction, user) => {
            if (reaction.emoji.name === game.emojis.numbers[1]) {
                option = 1;
            } else if (reaction.emoji.name === game.emojis.numbers[2]) {
                option = 2;
            }
            console.log(`Voyante (${player.username}) option choisie ${option}.`);
        });

        collector.on("end", async () => {
            console.log(option)
            if (!option) {
                player.send(`Temps en haut.`);
                resolve("Le voyant a choisi de ne rien faire");
            } else if (option === 1) {
                const option1Msg = await player.send(`Sélectionnez un joueur pour voir son rôle. ${getPlayersString()}`);
                for (let i = 0; i < game.players.length; i++) {
                    option1Msg.react(game.emojis.numbers[i + 1]);
                }

                const filter = (reaction, user) => game.emojis.numbers.includes(reaction.emoji.name) && !user.bot;
                const options = { max: 1, time: game.timers.role };
                const collector = option1Msg.createReactionCollector({filter, options});
                game.collectors.push(collector);

                collector.on("collect", (reaction, user) => {
                    let numberIndex = game.emojis.numbers.findIndex((emoji) => emoji === reaction.emoji.name);
                    let selectedPlayer = game.players[numberIndex - 1];
                    player.send(`(${selectedPlayer.username}) c'est ${game.deck[numberIndex - 1]}`);
                    resolve(`Voyante (${player.username}) choisie (${selectedPlayer.username} ${game.deck[numberIndex - 1]}).`);
                });

                collector.on("end", () => {
                    resolve(`Voyante (${player.username}) a choisi de ne pas choisir de joueur.`);
                });
            } else {
                const option2Msg = await player.send(`Sélectionnez 2 cartes au milieu.`);
                for (let i = 1; i <= 3; i++) {
                    option2Msg.react(game.emojis.numbers[i]);
                }

                const filter = (reaction, user) => game.emojis.numbers.includes(reaction.emoji.name) && !user.bot;
                const options = { max: 2, time: game.timers.role };
                const collector = option2Msg.createReactionCollector({filter, options});
                game.collectors.push(collector);
                let amountOfClicks = 0;
                let card1 = "";

                collector.on("collect", (reaction, user) => {
                    let numberIndex = game.emojis.numbers.findIndex((emoji) => emoji === reaction.emoji.name);
                    let cardIndex = game.deck.length - 1 - (numberIndex - 1);
                    player.send(`Carte ${reaction.emoji.name} is ${game.deck[cardIndex]}`);
                    amountOfClicks += 1;
                    if (card1 === "") card1 = reaction.emoji.name;

                    if (amountOfClicks === 2) {
                        resolve(`Voyante (${player.username}) carte choisie ${card1} et ${reaction.emoji.name}.`);
                    }
                });

                collector.on("end", () => {
                    resolve(`Voyante (${player.username}) a choisi de choisir ${amountOfClicks === 0 ? "0 carte" : "1 carte"} à partir du milieu.`);
                });
            }
        });
    });
}

function robber(player) {
    return new Promise(async (resolve) => {
        if (!player) player = game.players.find((player) => player.role === "Voleur");

        const msg = await player.send(`Selectionner un joueur. ${getPlayersString()}`);
        for (let i = 0; i < game.players.length; i++) {
            msg.react(game.emojis.numbers[i + 1]);
        }

        const filter = (reaction, user) => game.emojis.numbers.includes(reaction.emoji.name) && !user.bot;
        const options = { max: 1, time: game.timers.role };
        const collector = msg.createReactionCollector({filter, options});
        game.collectors.push(collector);

        collector.on("collect", (reaction, user) => {
            let numberIndex = game.emojis.numbers.findIndex((emoji) => emoji === reaction.emoji.name);
            let selectedPlayer = game.players[numberIndex - 1];
            player.send(`Vous volez (${selectedPlayer.username}). Ce joueur est ${game.deck[numberIndex - 1]}.`);
            swapPlayerCards(player, selectedPlayer);
            resolve(`Voleur (${player.username}) vole (${selectedPlayer.username} ${game.deck[numberIndex - 1]}).`);
        });

        collector.on("end", () => {
            resolve(`Voleur (${player.username}) a choisi de ne voler personne.`);
        });
    });
}

function troublemaker(player) {
    return new Promise(async (resolve, reject) => {
        if (!player) player = game.players.find((player) => player.role === "Troublemaker");

        const msg = await player.send(`Sélectionnez un joueur. ${getPlayersString()}`);
        for (let i = 0; i < game.players.length; i++) {
            msg.react(game.emojis.numbers[i + 1]);
        }

        const filter = (reaction, user) => game.emojis.numbers.includes(reaction.emoji.name) && !user.bot;
        const options = { max: 2, time: game.timers.role };
        const collector = msg.createReactionCollector({filter, options});
        game.collectors.push(collector);

        let players = [];

        collector.on("collect", (reaction, user) => {
            let numberIndex = game.emojis.numbers.findIndex((emoji) => emoji === reaction.emoji.name);
            let cardIndex = numberIndex - 1;
            players.push(game.players[cardIndex]);

            if (players.length === 2) {
                let [p1, p2] = players;
                player.send(`Vous avez échangé ${p1} et ${p2}.`);
                swapPlayerCards(p1, p2);
                resolve(`Troublemaker (${player.username}) Échangé ${p1.username} et ${p2.username}.`);
            }
        });

        collector.on("end", () => {
            resolve(`Troublemaker (${player.username}) choisissez de ne pas échanger qui que ce soit.`);
        });
    });
}

function drunk(player) {
    return new Promise(async (resolve, reject) => {
        let playerIndex = game.players.findIndex((player) => player.role === "Ivre");
        if (!player) {
            player = game.players[playerIndex];
        }

        const msg = await player.send(`Sélectionnez une carte au milieu.`);
        for (let i = 1; i <= 3; i++) {
            msg.react(game.emojis.numbers[i]);
        }

        let madeAnAction = false;

        const filter = (reaction, user) => game.emojis.numbers.includes(reaction.emoji.name) && !user.bot;
        const options = { max: 1, time: game.timers.role };
        const collector = msg.createReactionCollector({filter, options});
        game.collectors.push(collector);

        collector.on("collect", (reaction, user) => {
            madeAnAction = true;
            let numberIndex = game.emojis.numbers.findIndex((emoji) => emoji === reaction.emoji.name);
            let cardIndex = game.deck.length - 1 - (numberIndex - 1);

            let temp = game.deck[playerIndex];
            game.deck[playerIndex] = game.deck[cardIndex];
            game.deck[cardIndex] = temp;
            player.send(`Vous avez échangé avec la carte ${reaction.emoji.name} au milieu.`);
            resolve(`Ivre (${player.username}) échangé avec une carte ${reaction.emoji.name} au milieu.`);
        });

        collector.on("end", () => {
            if (!madeAnAction) {
                let randomIndex = Math.floor(Math.random() * 3);
                let cardIndex = game.deck.length - 1 - randomIndex;

                let temp = game.deck[i];
                game.deck[i] = game.deck[cardIndex];
                game.deck[cardIndex] = temp;

                player.send(`Vous avez été échangé avec une carte ${game.emojis.numbers[randomIndex + 1]} qui a été choisi au hasard.`);
                resolve(`Ivre (${player.username}) n’a pas choisi. Carte ${game.emojis.numbers[randomIndex + 1]} a été choisi au hasard.`);
            }
        });
    });
}

function insomniac() {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            if (player.role === "Insomniac") {
                let playerIndex = game.players.findIndex((i) => i.id === player.id);
                player.send(`Votre carte après la fin de la nuit est ${game.deck[playerIndex]}.`);
            }
        }

        resolve(`Insomniac a vérifié la carte finale.`);
    });
}

function doppelganger() {
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            if (player.role === "Sosie") {
                let msg = await player.send(`Sélectionnez un lecteur. ${getPlayersString()}`);

                for (let i = 0; i < game.players.length; i++) {
                    msg.react(game.emojis.numbers[i + 1]);
                }

                let madeAnAction = false;

                const filter = (reaction, user) => game.emojis.numbers.includes(reaction.emoji.name) && !user.bot;
                const options = { max: 1, time: game.timers.role };
                const collector = msg.createReactionCollector({filter, options});
                game.collectors.push(collector);

                collector.on("collect", async (reaction, user) => {
                    madeAnAction = true;
                    let cardIndex = game.emojis.numbers.findIndex((emoji) => emoji === reaction.emoji.name) - 1;
                    let newRole = game.deck[cardIndex];

                    player.role = newRole;
                    game.roles[newRole].inGame += 1;
                    game.roles.Sosie.role = newRole;

                    player.send(`Votre nouveau rôle est ${player.role}.`);

                    
                    if (["Voyante", "Voleur", "Troublemaker", "Ivre"].includes(newRole)) await game.roles[newRole].perform(player);

                    resolve(`Sosie (${player.username}) choisirent ${reaction.emoji.name} et est maintenant ${player.role}.`);
                });

                collector.on("end", () => {
                    if (!madeAnAction) {
                        let cardIndex = Math.floor(Math.random() * game.players.length);
                        let newRole = game.deck[cardIndex];

                        player.role = newRole;
                        game.roles[newRole].inGame += 1;
                        game.roles.Sosie.role = newRole;

                        player.send(`Votre nouveau rôle est ${player.role}.`);
                        resolve(`Sosie (${player.username}) n’a pas sélectionné. Carte ${game.emojis.numbers[cardIndex + 1]} a été choisi au hasard.`);
                    }
                });
            }
        }
    });
}

async function hunter(message, player, alreadyHunter = "") {
    message.channel.send(`${player.username} est le chasseur. Avant de mourir, ce joueur peut tirer sur un joueur et remplace complètement tous les votes précédents.`);
    let msg = await player.send(`Sélectionnez un joueur. ${getPlayersString()}`);
    for (let i = 0; i < game.players.length; i++) {
        if (alreadyHunter === i + 1) continue; 
        msg.react(game.emojis.numbers[i + 1]);
    }

    const filter = (reaction, user) => game.emojis.numbers.includes(reaction.emoji.name) && !user.bot;
    const options = { max: 1, time: game.timers.role };
    const collector = msg.createReactionCollector({filter, options});
    game.collectors.push(collector);

    collector.on("collect", (reaction, user) => {
        madeAnAction = true;
        let playerIndex = game.emojis.numbers.findIndex((emoji) => emoji === reaction.emoji.name) - 1;
        let selectedPlayer = game.players[playerIndex];
        let playerRole = selectedPlayer.role;
        if (playerRole === "Doppelganger") playerRole = game.roles.Sosie.role;
        console.log(`${player.username} choisie ${selectedPlayer.username}.`);

        if (playerRole === "Tanneur") {
            message.channel.send(`${selectedPlayer.username} gagne!`);
        } else if (playerRole === "LG" || (playerRole === "Minion" && !game.roles.LG.inGame)) {
            message.channel.send(`L’équipe du village gagne!`);
        } else if (playerRole === "Chasseur") {
            //do not recursion call if a player shoots him/herself
            if (player.username !== selectedPlayer.username) {
                hunter(message, selectedPlayer, playerIndex);
            } else {
                console.log(1);
                message.channel.send(`L’équipe maléfique gagne!`);
            }
        } else {
            console.log(2);
            message.channel.send(`L’équipe maléfique gagne!`);
        }
    });

    collector.on("end", () => {
        if (!madeAnAction) {
            message.channel.send(`L’équipe maléfique gagne!`);
        }
    });
}

async function startGame(message) {
    game.on = true;
    createDeck();
    shuffleDeck();
    dealCards();
    console.log(gameCondition());

    message.channel.send("La nuit tombe. Tout le monde vérifie votre carte et s’endort.");

    if (game.roles.Sosie.inGame) {
        let action = await game.roles["Sosie"].perform().catch((err) => console.log("Problème ici"));
        console.log(action);
    }

    for (let i = 0; i < game.order.length; i++) {
        let roleName = game.order[i];
        if (game.roles[roleName].inGame) {
            console.log(`${roleName}' tour`);
            let action = await game.roles[roleName].perform().catch((err) => console.log("proiej"));
            console.log(action);
        }
    }

    
    resetInGameRoles();
    
    dealFinalCards();

    if (!game.on) return;

    try {
        let discuss = await discussion(message);
        console.log(discuss);
    } catch (err) {
        console.log(err);
    } finally {
        let voteResult = await vote(message);
        if (voteResult === "Le jeu a été terminé.") return;

        if (voteResult) {
            console.log("Quelqu’un a été rejeté.");
            message.channel.send(`${voteResult.username} a reçu le plus grand nombre de votes.`);

            let playerRole = voteResult.role;
            if (playerRole === "Sosie") playerRole = game.roles.Sosie.role;

            if (playerRole === "Tanneur") {
                message.channel.send(`${voteResult.username} gagne!`);
            } else if (playerRole === "LG" || (playerRole === "Minion" && !game.roles.LG.inGame)) {
                message.channel.send(`L’équipe du village gagne!`);
            } else if (playerRole === "Chasseur") {
                hunter(message, voteResult);
            } else {
                message.channel.send(`L’équipe maléfique gagne!`);
            }
        } else {
            console.log("Personne n’a été exclu.");
            if (game.roles.LG.inGame || game.roles.Minion.inGame) {
                message.channel.send(`Personne n’a été exclu. L’équipe maléfique gagne!`);
            } else {
                message.channel.send(`Personne n’a été exclu. L’équipe du village gagne!`);
            }
        }
    }

    game.on = false;
    console.log("La session de jeu est terminée.");
    game.players = []
}

function discussion(message) {
    message.channel.send(`Temps de discussion. (${game.timers.discussion / 1000} secondes)`);
    game.timer = timeout(game.timers.discussion);
    return game.timer;
}

function vote(message) {
    return new Promise(async (resolve, reject) => {
        if (!game.on) {
            console.log("Le jeu a été terminé par la commande stop.");
            resolve("Le jeu a été terminé.");
        } else {
            const msg = await message.channel.send(`Heure des votes. Prudent! Vous ne pouvez voter qu’une seule fois! ${getPlayersString()}`);
            for (let i = 1; i <= game.players.length; i++) {
                msg.react(game.emojis.numbers[i]);
            }

            const filter = (reaction, user) => game.emojis.numbers.includes(reaction.emoji.name) && !user.bot;
            const collector = msg.createReactionCollector(filter, { time: game.timers.vote, dispose: true });
            game.collectors.push(collector);

            let votedPlayers = {};

            collector.on("collect", (reaction, player) => {
                if (votedPlayers[player.username]) {
                    
                } else {
                    votedPlayers[player.username] = true;
                }

                let votedCount = Object.values(votedPlayers).length;
                if (votedCount === game.players.length) collector.stop();
            });

            collector.on("remove", (reaction, player) => {
                if (votedPlayers[player.username]) {
                    
                }
            });

            collector.on("end", (reaction, player) => {
                let votedCount = Object.values(votedPlayers).length;
                if (votedCount) {
                    console.log("Tout le monde a voté");

                    let voteArr = msg.reactions.cache.map((cache) => cache.count);
                    console.log(voteArr);

                    let max = Math.max(...voteArr);
                    let occurrence = findOccurrence(max, voteArr);

                    if (occurrence) {
                        console.log("Dupliquer le plus grand nombre de votes.");
                        resolve();
                    } else {
                        let playerIndex = voteArr.findIndex((i) => i === max);
                        let player = game.players[playerIndex];

                        console.log(`${player.username} a reçu le vote le plus élevé.`);
                        resolve(player);
                    }
                } else {
                    console.log("Pas de Vote");
                    resolve();
                }
            });
        }
    });
}

async function setRoles(message) {

    prefix = "w!"

    const roleMsg = await message.channel.send(
        `Utiliser '${prefix} roles' pour afficher tous les rôles basculés.\nChaque rôle peut également être basculé à l’aide de '${prefix} add/remove nom du role.\nAlors l’hôte peut appuyer sur le cercle vert pour démarrer le jeu.`
    );
    getBalanceNotice(message);

    await roleMsg.react(game.emojis.start);
    const filter = (reaction, user) => game.emojis.start === reaction.emoji.name && !user.bot;
    const roleMsgCollector = roleMsg.createReactionCollector({ filter,  time: 600000 });
    game.collectors.push(roleMsgCollector);

    //only the host can press "🟢" to start the game
    roleMsgCollector.on("collect", (reaction, player) => {
        if (player.id === message.author.id) {
            roleMsgCollector.stop();
            startGame(message);
        }
    });
}

function createDeck() {
    let roles = Object.entries(game.roles);
    for (let i = 0; i < roles.length; i++) {
        const [roleName, roleValue] = roles[i];
        if (roleValue.count) game.deck = game.deck.concat(Array(roleValue.count).fill(roleName));
    }
}

function shuffleDeck() {
    for (let i = 0; i < game.deck.length; i++) {
        let pointer = Math.floor(Math.random() * game.deck.length);
        let temp = game.deck[i];
        game.deck[i] = game.deck[pointer];
        game.deck[pointer] = temp;
    }
}

function dealCards() {
    for (let i = 0; i < game.players.length; i++) {
        let card = game.deck[i];
        game.players[i].role = card;
        game.players[i]
            .send(`Vous êtes ${card}. ${game.roles[card].description}\n${getRoleOrder()}`)
            .catch(() => console.log(`Impossible d’envoyer le message à ${game.players[i].username}`));
        game.roles[card].inGame += 1;
    }
}

function resetInGameRoles() {
    let roles = Object.keys(game.roles);
    for (let i = 0; i < roles.length; i++) {
        roles[i].inGame = 0;
    }
}


function dealFinalCards() {
    for (let i = 0; i < game.players.length; i++) {
        let card = game.deck[i];
        game.players[i].role = card;
        game.roles[card].inGame += 1;
    }
}


function getBalanceNotice(message) {
    let msg = "";
    let balanceRoleCount = game.players.length + 3;
    if (balanceRoleCount < getRolesCount()) {
        msg = `Besoin ${getRolesCount() - balanceRoleCount} moins de roles.`;
    } else if (balanceRoleCount > getRolesCount()) {
        msg = `Besoin ${balanceRoleCount - getRolesCount()} plus de roles.`;
    } else {
        msg = "Rôles équilibrés.";
    }
    message.channel.send(msg);
}

function getPlayersString() {
    return (
        "\n" +
        game.players
            .map((player, index) => {
                return `${game.emojis.numbers[index + 1]} ${player.username}`;
            })
            .join(`\n`)
    );
}

function getPlayersRoles() {
    return game.players.map((player) => player.username + " " + player.role);
}

function getRolesCount() {
    let roles = Object.values(game.roles);
    return roles.reduce((a, b) => a + b.count, 0);
}


function findPlayersWithRole(role) {
    let players = game.players.filter((player) => player.role === role);
    return players.map((player) => player.username);
}


function findOtherPlayersWithRole(role, player) {
    let players = game.players.filter((p) => p.role === role && p.username !== player.username);
    return players.map((player) => player.username);
}


function swapPlayerCards(p1, p2) {
    let p1Index = game.players.findIndex((i) => i.id === p1.id);
    let p2Index = game.players.findIndex((i) => i.id === p2.id);

    let temp = game.deck[p1Index];
    game.deck[p1Index] = game.deck[p2Index];
    game.deck[p2Index] = temp;
}

function findOccurrence(n, arr) {
    let repeat = {};
    for (let i = 0; i < arr.length; i++) {
        if (repeat[arr[i]]) {
            repeat[arr[i]] += 1;
        } else {
            repeat[arr[i]] = 1;
        }
    }

    if (repeat[n] > 1) return true;
    return false;
}


function getRoleOrder() {
    let order = [];
    for (let i = 0; i < game.order.length; i++) {
        let roleName = game.order[i];

        if (game.roles[roleName].count) {
            order.push(roleName);
        }
    }


    return order.join(" -> ");
}