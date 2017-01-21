"use strict";
const Discord = require("discord.js");
const Storage = require("saltjs").Storage;
const fs = require("fs");
let loadedmodules = {};
for (let file of fs.readdirSync("./src")) {
  if (/\.js$/.test(file)) {
    loadedmodules[file.replace(/\.js$/, "")] = require(`./src/${file}`);
  }
}

module.exports = loadedmodules;


