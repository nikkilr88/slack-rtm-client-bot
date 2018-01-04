const { RtmClient, CLIENT_EVENTS, RTM_EVENTS, WebClient } = require('@slack/client');
const { rand } = require('../helpers/functions');
const jokes = require('../helpers/jokes');

module.exports = () => {

    // An access token (from your Slack app or custom integration - usually xoxb)
    const token = process.env.SLACK_TOKEN;

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
        let directReg = /(<@U8ME78MFH>)/gi;

        console.log('New message: ', message);
        let msg = message.text;

        if (msg.match(directReg)) {
            rtm.sendMessage(`<@${message.user}> You direct mentioned me!`, message.channel);
        }

        if (msg.match(helpReg)) {
            rtm.sendMessage('If you really need help, call a fellow human!', message.channel);
        }
        else if (msg.match(jokeReg)) {
            let joke = jokes[rand(jokes.length)];
            rtm.sendMessage(joke, message.channel);
        }
        else {
            return;
        }
    });

    // Start the connecting process
    rtm.start();
}