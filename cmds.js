"use strict";
const Discord = require("discord.js");
const Storage = require("saltjs").Storage;
const fs = require("fs");
const path = require("path");
let loadedmodules = {};
for (let file of fs.readdirSync(path.join(__dirname, "src"))) {
  if (/\.js$/.test(file)) {
    loadedmodules[file.replace(/\.js$/, "")] = require(path.join(__dirname, `src/${file}`));
  }
}

module.exports = loadedmodules;


