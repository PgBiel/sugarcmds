const Discord = require("discord.js");
const Client = require("./Client.js");
const Send = exports.Send = class Send {
    constructor(channel, client, safeSend = true, logUnknownChannel = true /*log if channel was not found*/ ) {
      if (!(client instanceof Client)) throw new TypeError("Client must be a client.");
      console.log(channel instanceof Discord.Channel);
      if (!(channel instanceof Discord.Channel)) throw new TypeError(`Channel must be a channel. ${channel instanceof Discord.Channel}`);
      this.safeSend = typeof safeSend == "boolean" ? safeSend : Boolean(safeSend);
      this.client = client;
      this.logUnknownChannel = logUnknownChannel;
      this.channel = channel;
      this.channelget = () => {
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