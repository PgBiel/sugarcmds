const Discord = require("discord.js");
const Send = require("./Send.js");
const Storage = require("saltjs").Storage;
Client = module.exports = class Client extends Discord.Client {
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