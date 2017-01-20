const Discord = require("discord.js");
let tempvar = async function(){};
const AsyncFunction = tempvar.constructor;
const Command = module.exports = class Command {
	constructor(name, pattern, funct, guildOnly=true) {
		if (name===undefined||name===null||name==="") throw new TypeError("name must not be null or undefined.");
		if (!(pattern instanceof RegExp)) throw new TypeError("Pattern must be Regex!");
		//if (typeof funct !== "function") throw new TypeError("Main command function must be an async function.");
		if (!(funct instanceof AsyncFunction)) throw new TypeError("Main command function must be an async function.");
		this.name = name;
		this.pattern = pattern;
		this.function = funct;
	}

	run(message) {
		if (!(message instanceof Discord.Message)) throw new TypeError("Message must be a message.");
		return this.function(message, !!message.guild);
	}
    thisisaplaceholder(){}
};
