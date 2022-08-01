const cli = require("cli-color");
const moment = require("moment");

module.exports = class Logger {
	static log (content, type = "info") {
		const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
		switch (type) {
		// Check the message type and then print him in the console
		case "info": {
			return console.log(`${cli.red(` ❯ INFO        [${date}] `)} ${cli.red(content)}`);
		}
		case "warn": {
			return console.log(`${cli.yellow(` ❯ WARNING        [${date}] `)} ${cli.red(content)}`);		}
		case "error": {
			return console.log(`${cli.red(` ❯ ERROR        [${date}] `)} ${cli.red(content)}`);		}
		case "cmd": {
			return console.log(`${cli.blue(` ❯ COMMAND        [${date}] `)} ${cli.red(content)}`);		}
		case "event": {
			return console.log(`${cli.blue(` ❯ EVENT        [${date}] `)} ${cli.red(content)}`);		}
		case "success": {
			return console.log(`${cli.green(` ❯ SUCCESS        [${date}] `)} ${cli.green(content)}`);		}
		default: throw new TypeError("Logger type must be either info, warn, error, cmd, event or success.");
		}
	}
};