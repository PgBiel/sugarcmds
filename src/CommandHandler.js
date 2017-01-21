const Discord = require("discord.js");
const Command = require("./Command.js");
const Storage = require("saltjs").Storage;
/**
	* A handler for commands, checks if message runs command
	*/
const CommandHandler = class CommandHandler {
	/**
		* @param {Client} client The client to check commands
		*/
  constructor(client) {
    if (!(client instanceof Client)) throw new TypeError("client must be a client.");
    if (!client.commands) client.commands = new Storage();
    if (!client.cmdhandler) client.cmdhandler = this;
    /**
    	* The client that this handler checks in
    	* @type {Client}
    	*/
    this.client = client;
  }
  /**
  	* Test if a message has a command and run it
  	* @param {Message} message The message to check
  	* @returns {Promise<*>} What the Command's function returns
  	*/
  async test(message) {
    if (!(message instanceof Discord.Message)) throw new TypeError("Message must be a message.");
    if (!this.client.commands || this.client.commands.size < 1) return null;
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
