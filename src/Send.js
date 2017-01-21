const Discord = require("discord.js");
const Client = require("./Client.js");
/**
  * A tool to safely send messages to a channel
  */
const Send = class Send {
  /**
    * @param {Channel} channel A Discord channel to send
    * @param {boolean} [safeSend=true] If it should send safely (catching rejections and errors)
    */
  constructor(channel, safeSend = true) {
    if (!(channel instanceof Discord.Channel)) throw new TypeError(`Channel must be a channel.`);
    /**
      * The channel to send messages to
      * @type {Channel}
      */
    this.channel = channel;
    /**
      * If it should safe send
      * @type {boolean}
      */
    this.safeSend = typeof safeSend == "boolean" ? safeSend : Boolean(safeSend);
  }

  /**
    * Main sending function
    * @see https://discord.js.org/#/docs/main/master/class/TextChannel?scrollTo=send
    */
  async send(content, options) {
    let msg = {};
    if (this.safeSend)
      try {
        msg = await this.channel.send(content, options);
        msg.error = null;
      } catch (err) {
        let channel = this.channel;
        let channelguild = "";
        if (channel.guild)
          channelguild = ` of server ${channel.guild.name}`;
        msg.error = err;
        console.error(`Error at sending message to ${channel.recipient?`${channel.recipient.username}#${channel.recipient.discriminator}`:(channel.recipients?`Group DM ${"\""+channel.name+"\""||"(that has no name)"}`:`#${channel.name}`)}${channelguild} (ID: ${channel.id}): ${err.toString().replace(/^Error:\s?/, "")}`);
      }
    else {
      msg = await this.channel.send(content, options);
    }
    return msg;
  }

  /**
    * Send a file
    * @see https://discord.js.org/#/docs/main/master/class/TextChannel?scrollTo=sendFile
    */
  sendFile(attachment, name="file.jpg", content="", options={}) {
    options.file = {
      attachment,
      name
    };
    return this.send(content, options);
  }

  /**
    * Send an embed
    * @see https://discord.js.org/#/docs/main/master/class/TextChannel?scrollTo=sendEmbed
    */
  sendEmbed(embed, content="", options={}) {
    options.embed = embed;
    return this.send(content, options);
  }

  /**
    * Send a code block
    * @see https://discord.js.org/#/docs/main/master/class/TextChannel?scrollTo=sendCode
    */
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

  /**
    * Alias for the main sending function
    * @see https://discord.js.org/#/docs/main/master/class/TextChannel?scrollTo=sendMessage
    */
  sendMessage(content, options) {
    return this.send(content, options);
  }

  /**
    * Send message with TTS
    * @see https://discord.js.org/#/docs/main/master/class/TextChannel?scrollTo=send
    */
  sendTTS(content, options={}) {
    options.tts = true;
    return this.send(content, options);
  }

  /**
    * Set if it should safe send
    * @param {boolean} [safeSend=(Toggles)] If it should safe send
    * @returns {boolean} The new value for SafeSend
    */
  setSafe(bool) {
    if (bool === undefined || bool === null) {
      return this.safeSend = !this.safeSend;
    } else {
      return this.safeSend = Boolean(bool);
    }
  }
};
module.exports = Send;