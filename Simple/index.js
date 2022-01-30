"use strict";

const TwitchBot = require('./src/twitchBot');

const twitchBot = new TwitchBot();
twitchBot.initialize()
.then(() => {
    console.log('*** RUNNING ***');
})
.catch((err) => {
    console.error(err);
});