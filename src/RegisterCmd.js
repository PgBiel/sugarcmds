const Discord = require("discord.js");
const Command = require("./Command.js");
const Client = require("./Client.js");
const Storage = require("saltjs").Storage;
const RegisterCmd = exports = function(client, nameOrCmd, pattern, func, guildOnly = true) {
  if (!(client instanceof Client)) throw new TypeError("Client must be a Client.");
  if (nameOrCmd instanceof Command) {
    client.commands.set(nameOrCmd.name, nameOrCmd);
    return nameOrCmd;
  } else {
    let cmd = new Command(typeof nameOrCmd == "string" ? nameOrCmd : nameOrCmd.toString(), pattern, func, guildOnly);
    if (!client.commands) client.commands = new Storage();
    client.commands.set(nameOrCmd, cmd);
    return cmd;
  }
};