"use strict";

const {handlePlayMarble}        = require('./marble');


let state = null; let twitchBot = null;
const callCommand = (client, command, messageInfo) => {
    twitchBot = client;
    state = messageInfo;

    switch (command.command) {
        case 'play': {
            handlePlayMarble(client, messageInfo.channel)
        } break;
        default:
            break
    }
}

module.exports = {
    call: (client, command, messageInfo) => {
        callCommand(client, command, messageInfo)
    }
}