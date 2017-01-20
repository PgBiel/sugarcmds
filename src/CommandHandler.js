const Discord = require("discord.js");
const Command = require("./Command.js");
const CommandHandler = module.exports = class CommandHandler {
	constructor(client) {
		if (!(client instanceof Client)) throw new TypeError("client must be a client.");
		if (!client.commands) client.commands = new Storage();
		if (!client.cmdhandler) client.cmdhandler = this;
		this.client = client;
	}

	async test(message){
		if (!(message instanceof Discord.Message)) throw new TypeError("Message must be a message.");
		if (!this.client.commands||this.client.commands.size < 1) return null;
		let client = this.client;
		let cmdtobeused;
		for (let command in client.commands.toObject()) {
			command = client.commands.get(command);
			if (command instanceof Command) {
				if (command.pattern.test(message.content)) {
					cmdtobeused = command;
					break;
				}
			}
		}
		if (cmdtobeused) {
			if (cmdtobeused.guildOnly && !message.guild) return null;
			return await cmdtobeused.run(message);
		} else {
			return null;
		}
	}
};
