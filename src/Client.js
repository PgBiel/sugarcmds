const Discord = require("discord.js");
const Send = require("./Send.js");
const Storage = require("saltjs").Storage;
const CommandHandler = requie("./CommandHandler.js");
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
    this.on("channelCreate", c=>{
      c.sender = new Send(c, this);
      c.sr = c.sender;
    });
    let { defaultPrefix, prefixes, ownerID } = options;
    defaultPrefix = defaultPrefix || "!";
    this.prefixes = new Storage();
    if (typeof defaultPrefix !== "string") defaultPrefix = defaultPrefix.toString();
    if (typeof ownerID !== "string" && !(ownerID instanceof Array)) throw new TypeError("Must give an owner ID or array of owner IDs.");
    if (prefixes) {
      if (typeof prefixes !== "object") throw new TypeError("Prefixes must be an object of format `guildID: prefix` or a Storage mapping prefixes by guild ID.");
      if (prefixes instanceof Storage) {
        this.prefixes = prefixes;
      } else {
        for (let guildID in prefixes) {
          this.prefixes.set(guildID.toString(), prefixes[guildID].toString()); //in case they aren't strings for some weird reason
        }
      }
    }
    this.owners = ownerID;
  }

  reloadPrefixes(prefixes) {
    if (!prefixes || typeof prefixes !== "object") throw new TypeError("Prefixes must be an object of format `guildID: prefix` or a Storage mapping prefixes by guild ID.");
    this.prefixes = prefixes;
    return true;
  }
};