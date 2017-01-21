const Discord = require("discord.js");
const Send = require("./Send.js");
const Storage = require("saltjs").Storage;
const RegisterCmd = require("./RegisterCmd.js");
const Command = require("./Command.js");
const CommandHandler = requie("./CommandHandler.js");
/**
  * A modified Discord.js client for the command framework.
  * @extends {Discord.Client}
  */
const Client = class Client extends Discord.Client {
  /**
    * @param {ClientOptions} options Options for the client.
    */
  constructor(options) {
    super(options);
    /**
      * The commands for the client
      * @type {Storage}
      */
    this.commands = new Storage();
    /**
      * The client's command handler
      * @type {CommandHandler}
      */
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
    /**
      * The prefixes for each guild, mapped by ID
      * @type {Storage}
      */
    this.prefixes = new Storage();
    if (typeof defaultPrefix !== "string") defaultPrefix = defaultPrefix.toString();
    /**
      * The default prefix for guilds without a prefix
      * @type {string}
      */
    this.defaultPrefix = defaultPrefix;
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
    /**
      * The owners of the client. Can be Owner ID or Array of Owner IDs
      * @type {string|Array<string>}
      */
    this.owners = ownerID;
  }
  /**
    * Set the prefixes.
    * @param {Object|Storage} prefixes Prefixes mapped by guild ID
    * @returns {boolean}
    */
  reloadPrefixes(prefixes) {
    if (!prefixes || typeof prefixes !== "object") throw new TypeError("Prefixes must be an object of format `guildID: prefix` or a Storage mapping prefixes by guild ID.");
    this.prefixes = prefixes;
    return true;
  }

  test(){}

  /**
    * Command registerer.
    * @param {Command} command Command object to be registered
    * @returns {Command} Command registered
    */
  registerCmd(cmd) {
    if (!(cmd instanceof Command)) throw new TypeError("Command must be a command.");
    return RegisterCmd(cmd);
  }  
};
module.exports = Client;