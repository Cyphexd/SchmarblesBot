"use strict";

let cooldown = 120000;
let lastMsg = Date.now() - cooldown;

let msgCount = 0;
let msgCountHandle = null;

const checkCoolDown = () => {
    const notOver = Date.now() - lastMsg < cooldown;
    if(!notOver) lastMsg = Date.now();
    return !notOver;
}

const checkMsgCount = () => {
    msgCount = msgCount + 1;
    if(msgCount > 3) {
        msgCount = 0;
        return true;
    }

    if(!msgCountHandle) {
        msgCountHandle = setTimeout(function(){
            msgCount = 0;
            clearTimeout(msgCountHandle);
        }, 2000);
    }
    
    return false;
}

const handlePlayMarble = async (client, channel) => {
    if(checkCoolDown())  {
        if(checkMsgCount()) {
            setTimeout(function(){
                client.say(channel, '!play');
            }, Math.random() * (5000));
        }
    }
}

module.exports = {
    handlePlayMarble
}