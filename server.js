if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const Discord = require('discord.js');
const client = new Discord.Client();

const { DISCORD_BOT_TOKEN } = process.env;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('pinbot ready');
});

client.on('message', async (msg) => {
  const prefix = '!pin';
  if (!msg.content.startsWith('!pin')) {
    return;
  }

  const args = msg.content.slice(prefix.length).trim().split(' ');
  const messageURL = new URL(args.shift());

  const [_, type, guildID, channelID, messageID] = messageURL.pathname.split('/');
  if (!type || type !== 'channels') {
    console.error(`Unsupported channel type: ${type}`);
    return;
  }
  if (!guildID || !channelID || !messageID) {
    console.error('Invalid message URL format');
    return;
  }

  try {
    const channel = await client.channels.fetch(channelID);
    if (!channel.isText()) {
      console.error('Channel is not text based');
      return;
    }

    const msgToPin = await channel.messages.fetch(messageID);
    if (msgToPin.pinned) {
      msg.reply('This message has already been pinned');
      return;
    }

    await msgToPin.pin();
  } catch (err) {
    console.log(err);
    return;
  }
});

client.login(DISCORD_BOT_TOKEN);
