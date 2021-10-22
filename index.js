//Written by Edwin Jones - http://edwinjones.me.uk

'use strict';

//dependencies
const {Client} = require('discord.js');
const Scheduler = require('./scheduler');
require('dotenv').config(); //initialize dotenv


// const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


//Initialize Discord Bot
let bot = new Client();

//Initialize scheduler
let scheduler = Scheduler(bot);
// const auth = require('./auth.json'); //you need to make this file yourself!

const helpmsg =
    "Hi there, I'm reminder bot!\n" +
    "You can see this message again by typing **!help**\n" +
    "You can set a reminder for yourself by typing **!remindme [about a thing] [at a time in the future]**\n" +
    "You can snooze the most recent reminder you received by typing **!snooze [for a time / until a time in the future]**\n" +
    "You can snooze all the reminders you have received by typing **!snoozeall [for a time / until a time in the future]**\n" +
    "You can remove the most recent reminder you received by typing **!clear**\n" +
    "You can remove all the reminders you have received by typing **!clearall**\n" +
    "You can list your upcoming reminders by typing **!list**\n" +
    "You can remove all your reminders by typing **!forgetme**";

/**
 * Error handler
 *
 * @param channel the text channel to send the message to
 * @param err the error message to log
 */
async function onError(channel, err) {
    log(err);
    await channel.send("Looks like even I forget things, like how to do what you just asked. Please ask me again later.");
}


//log when the bot is ready
bot.on('ready', async (evt) => {
    try {
        await evt.channel.send("connected");
    } catch (e) {
        console.warn({"error from connected ": e})

    }
    console.log('connected');
    console.log('logged in as: ');
    console.log(`${bot.user.username} - (${bot.user.id})`);
});
const prefix = "!"

// Decide what to do when the bot get a message. NOTE: discord supports markdown syntax.

bot.on('messageCreate', async (message) => {

    try {

        // the bot needs to know if it will execute a command
        // It will listen for messages that will start with `!`
        if (!message.content.startsWith(prefix)) {

            console.log('Received a command!')

            let messageContent = message.content.substring(1);
            let command = messageContent.split(' ')[0];
            let parameters = messageContent.substring(messageContent.indexOf(' ') + 1);

            switch (command) {

                // handle commands
                case 'help':
                    await message.channel.send(helpmsg);
                    console.log("help command executed");
                    break;

                case 'remindme':
                    await scheduler.setReminder(message.author.id, message.channel, parameters);
                    break;

                case 'snooze':
                    await scheduler.snoozeReminder(message.author.id, message.channel, parameters);
                    break;

                case 'snoozeall':
                    await scheduler.snoozeReminders(message.author.id, message.channel, parameters);
                    break;

                case 'list':
                    await scheduler.listReminders(message.author.id, message.channel);
                    break;

                case 'clear':
                    await scheduler.clearActiveReminder(message.author.id, message.channel);
                    break;

                case 'clearall':
                    await scheduler.clearActiveReminders(message.author.id, message.channel);
                    break;

                case 'forgetme':
                    await scheduler.clearAllReminders(message.author.id, message.channel);
                    break;
            }
        }
    } catch (err) {
        await onError(message.channel, err);
    }
});

//start the bot by making it log in to discord.
bot.login(process.env.token).then(i => {
    console.log({"loggedIn": true})
}).catch(e => {
    console.warn({"login": e})
});