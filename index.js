// Written by Edwin Jones - http://edwinjones.me.uk

'use strict';

// dependencies
const Scheduler = require('./scheduler.js')
const Discord = require('discord.js');
const Client = Discord.Client
const Intents = Discord.Intents
const MessageEmbed = Discord.MessageEmbed
require("dotenv").config()
const clientOptions = {intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]}
//Initialize Discord client
const client = new Client();

//Initialize scheduler
let scheduler = new Scheduler(client);

const helpmsg =
    "Hi there, I'm reminder client!\n" +
    "You can see this message again by typing **!help**\n" +
    "You can set a reminder for yourself by typing THERE ARE SPACES BETWEEN **!remindme SPACE [about a thing] SPACE [at a time in the future: FORMAT 00:00:00 or 00:00]**\n" +
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
    console.log(err);
    await channel.send("Looks like even I forget things, like how to do what you just asked. Please ask me again later.");
}

//start the client by making it log in to discord.
client.login(process.env.token).then(i => console.log({i})).catch(e => console.warn(`cant log in:${e}`))

client.on('message', async msg => {
    if (msg.content === 'ping') {
        await msg.reply('pong');
    }
});

client.on('ready', async (evt) => {
    try {
        await evt?.channel.send("connected");
    } catch (e) {
        console.warn({"error from connected ": e})
    }
    console.log('connected');
    console.log('logged in as: ');
    console.log(`${client.user.username} - (${client.user.id})`);
});


const prefix = "!"

// Decide what to do when the client get a message. NOTE: discord supports markdown syntax.

client.on('message', async (message) => {
    if (message) {
        try {
            // the client needs to know if it will execute a command
            // It will listen for messages that will start with `!`
            if (message.content.startsWith(prefix)) {

                console.log('Received a command!')

                let messageContent = message?.content.substring(1);
                let command = messageContent.split(' ')[0];
                let parameters = messageContent.substring(messageContent.indexOf(' ') + 1);

                switch (command) {

                    // handle commands
                    case 'help':
                        try {
                            await message?.channel.send(helpmsg);
                            console.log("help command executed");
                        } catch (e) {
                            console.warn({error: e + `  schedule error ${command}`})
                        }
                        break;
                    case 'remindme':
                        try {
                            await scheduler.setReminder(message?.author.id, message?.channel, parameters);
                        } catch (e) {
                            console.warn({error: e + `  || schedule error ${command}`})
                        }
                        break;
                    case 'potluck':
                        const vid = new MessageEmbed({
                            color: 0x0099ff,
                            title: 'Click itttttttttt',
                            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            description: 'Click me, do it!',
                        })
                        console.log(vid)

                        await message?.channel.send(vid);


                        break;
                    case 'snooze':
                        try {
                            await scheduler.snoozeReminder(message?.author.id, message?.channel, parameters);

                        } catch (e) {
                            console.warn({error: e + `  schedule error ${command}`})
                        }
                        break;

                    case 'snoozeall':
                        try {
                            await scheduler.snoozeReminders(message?.author.id, message?.channel, parameters);

                        } catch (e) {
                            console.warn({error: e + `  schedule error ${command}`})
                        }
                        break;

                    case 'list':
                        try {
                            await scheduler.listReminders(message?.author.id, message?.channel);

                        } catch (e) {
                            console.warn({error: e + `  schedule error ${command}`})
                        }
                        break;

                    case 'clear':
                        await scheduler.clearActiveReminder(message?.author.id, message?.channel);
                        break;

                    case 'clearall':
                        try {
                            await scheduler.clearActiveReminders(message?.author.id, message?.channel);

                        } catch (e) {
                            console.warn({error: e + `  schedule error ${command}`})
                        }
                        break;

                    case 'forgetme':
                        try {
                            await scheduler.clearAllReminders(message?.author.id, message?.channel);

                        } catch (e) {
                            console.warn({error: e + `  schedule error ${command}`})
                        }
                        break;
                }
            }
        } catch (err) {
            await onError(message?.channel, err);
        }
    } else {
        return console.warn({"no message": message})
    }
});

