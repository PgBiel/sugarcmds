const Discord = require("discord.js");
let tempvar = async function() {};
const AsyncFunction = tempvar.constructor;
/**
  * Represents a generic bot command
  */
const Command = class Command {
  /**
    * @param {string} name The name of the command
    * @param {RegExp} pattern The pattern to check for in the message
    * @param {CommandFunction} function The function to be executed
    * @param {boolean} [guildOnly] If the command must only be executed in guilds, defaults to true
    */
  constructor(name, pattern, funct, guildOnly = true) {
    if (name === undefined || name === null || name === "") throw new TypeError("name must not be null or undefined.");
    if (!(pattern instanceof RegExp)) throw new TypeError("Pattern must be Regex!");
    //if (typeof funct !== "function") throw new TypeError("Main command function must be an async function.");
    if (!(funct instanceof AsyncFunction)) throw new TypeError("Main command function must be an async function.");
    /**
      * The name of the command
      * @type {string}
      */
    this.name = name;
    /**
      * The pattern of the command
      * @type {RegExp}
      */
    this.pattern = pattern;
    /**
      * The function of the command
      * @type {CommandFunction}
      */
    this.function = funct;
  }
  /**
    * @param {Message} message The message to run
    * @private
    */
  run(message) {
    if (!(message instanceof Discord.Message)) throw new TypeError("Message must be a message.");
    return this.function(message, !!message.guild);
  }
};

module.exports = Command;
