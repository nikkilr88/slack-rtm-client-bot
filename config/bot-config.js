const { RtmClient, CLIENT_EVENTS, RTM_EVENTS, WebClient } = require('@slack/client');
const { rand, getJoke } = require('../helpers/functions');
// const { SLACK_TOKEN } = require('./keys.js');

let randNum;

module.exports = () => {

    // An access token (from your Slack app or custom integration - usually xoxb)
    const token = process.env.SLACK_TOKEN || SLACK_TOKEN;

    // Cache of data
    const appData = {};

    // Initialize the RTM client with the recommended settings. Using the defaults for these
    // settings is deprecated.
    const rtm = new RtmClient(token, {
        dataStore: false,
        useRtmConnect: true,
    });

    rtm.on(RTM_EVENTS.MESSAGE, (message) => {
        // For structure of `message`, see https://api.slack.com/events/message

        // Skip messages that are from a bot or my own user ID
        if ((message.subtype && message.subtype === 'bot_message') ||
            (!message.subtype && message.user === appData.selfId)) {
            return;
        }
        //Match trigger words
        let helpReg = /(help)/gi;
        let jokeReg = /(joke)/gi;
        let gameReg = /(number game)/gi;
        let directReg = /(<@U8ME78MFH>)/gi;

        console.log('New message: ', message);
        let msg = message.text;

        if (msg.match(directReg)) {
            rtm.sendMessage(`<@${message.user}> You direct mentioned me!`, message.channel);
        }

        if (msg.match(helpReg)) {
            rtm.sendMessage('If you really need help, call a fellow human!', message.channel);
        }
        //Fetch a random joke
        else if (msg.match(jokeReg)) {
            getJoke()
            .then(data => {
                rtm.sendMessage(data.joke, message.channel);
            }); 
        }
        //Start number guessing game
        else if(msg.match(gameReg)) {
            rtm.sendMessage('Want to play a number game? I\'m thinking of a number between 1 and 10. See if you can guess what it is!', message.channel);
            randNum = rand(10);
            console.log(randNum)
        }
        //Check user guesses for number game
        else if (randNum !== null && Number(msg) && msg.length <= 2) {
            if(msg > randNum) {
                rtm.sendMessage(`Too high! Try again.`, message.channel);
            }
            else if(msg < randNum) {
                rtm.sendMessage(`Too low! Keep trying.`, message.channel);
            }
            else {
                rtm.sendMessage(`You got it! The answer was ${randNum}`, message.channel);
                randNum = null;
            }
        }
        //Return if no trigger word matches
        else {
            return;
        }
    });

    // Start the connecting process
    rtm.start();
}