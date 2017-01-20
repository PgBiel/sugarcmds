"use strict";
const Discord = require("discord.js");
const proto = require("helpful-prototypes");
if ([1,2].keysize === undefined)
	proto.load();
const Storage = require("saltjs").Storage;
const fs = require("fs");
let tempvar = async function(){};
global.AsyncFunction = tempvar.constructor;

let Client = exports.Client = undefined;

const Command = exports.Command = class Command {
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
};

const CommandHandler = exports.CommandHandler = class CommandHandler {
	constructor(client) {
		if (!(client instanceof Client)) throw new TypeError("client must be a client.");
		if (!client.commands) client.commands = new Storage();
		if (!client.cmdhandler) client.cmdhandler = this;
		this.client = client;
	}

	async test(message){
		if (!(message instanceof Discord.Message)) throw new TypeError("Message must be a message.");
		if (!this.client.commands||this.client.commands.keysize < 1) return null;
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
			return await cmdtobeused.run(message);
		} else {
			return null;
		}
	}
};
const RegisterCmd = exports.RegisterCmd = function(client, nameOrCmd, pattern, func, guildOnly=true) {
	if (!(client instanceof Client)) throw new TypeError("Client must be a Client.");
	if (nameOrCmd instanceof Command) {
		client.commands.set(nameOrCmd.name, nameOrCmd);
		return nameOrCmd;
	} else {
		let cmd = new Command(typeof nameOrCmd == "string"?nameOrCmd:nameOrCmd.toString(), pattern, func, guildOnly);
		if (!client.commands) client.commands = new Storage();
		client.commands.set(nameOrCmd, cmd);
		return cmd;
	}
};
const Send = exports.Send = class Send {
	constructor(channel, client, safeSend=true, logUnknownChannel=true/*log if channel was not found*/) {
		if (!(client instanceof Client)) throw new TypeError("Client must be a client.");
		console.log(channel instanceof Discord.Channel);
		if (!(channel instanceof Discord.Channel)) throw new TypeError(`Channel must be a channel. ${channel instanceof Discord.Channel}`);
		this.safeSend = typeof safeSend == "boolean"?safeSend:Boolean(safeSend);
		this.client = client;
		this.logUnknownChannel = logUnknownChannel;
		this.channel = channel;
		this.channelget = ()=>{
			let channel = client.channels.get(this.channel.id);
			if (!channel)
				if (this.logUnknownChannel)
					throw new RangeError("Channel not found!");
				else {
					return null;
				}
			else {
				return channel;
			}
		};
	}

	async send(content, options) {
		let msg = {};
		if (this.safeSend)
			try {
				msg = await this.channelget().send(content, options);
				msg.error = null;
			} catch (err) {
				let channel = this.channelget();
				let channelguild = "";
				if (channel.guild)
					channelguild = ` of server ${channel.guild.name}`;
				msg.error = err;
				console.error(`Error at sending message to ${channel.recipient?`${channel.recipient.username}#${channel.recipient.discriminator}`:(channel.recipients?`Group DM ${"\""+channel.name+"\""||"(that has no name)"}`:`#${channel.name}`)}${channelguild} (ID: ${channel.id}): ${err.toString().replace(/^Error:\s?/, "")}`);
			}
		else {
			msg = await this.channelget().send(content, options);
		}
		return msg;
	}

	sendFile(attachment, name="file.jpg", content="", options={}) {
		options.file = {
			attachment,
			name
		};
		return this.send(content, options);
	}

	sendEmbed(embed, content="", options={}) {
		options.embed = embed;
		return this.send(content, options);
	}

	sendCode(lang, content="", options={}) {
		let zeargs = Array.from(arguments);
		if (zeargs.length === 1) {
			options.code = true;
			content = lang;
		} else {
			options.code = lang;
		}
		return this.send(content, options);
	}

	sendMessage(content, options) {
		return this.send(content, options);
	}

	sendTTS(content, options={}) {
		options.tts = true;
		return this.send(content, options);
	}

	setSafe(bool) {
		if (bool === undefined || bool === null) {
			return this.safeSend = !this.safeSend;
		} else {
			return this.safeSend = Boolean(bool);
		}
	}
};
Client = exports.Client = class Client extends Discord.Client {
	constructor(options) {
		super(options);
		this.commands = new Storage();
		this.cmdhandler = new CommandHandler(this);
		this.once("ready", ()=>{
			this.channels.map(c=>{
				c.sender = new Send(c, this);
				c.sr = c.sender; //Alias lol
			});
		});
	}
};
