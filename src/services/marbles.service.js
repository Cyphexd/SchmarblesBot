import {EventEmitter} from 'events'

const GLOBAL_COOLDOWN = 120000;
const GLOBAL_MINMSG = 3;
const GLOBAL_MESSAGE = '!play';

class MarblesService extends EventEmitter {
    constructor() {
        super();

        this.chatClient = {}
        this.games = {}
    }

    start(chatClient) {
        this.chatClient = chatClient

        this.chatClient.onMessage((channel, user, message) => {

            if(message.includes('!play') && this.games[channel].isRunning) {
                if(this.checkCooldownForChannel(channel)) {
                    if(this.checkMsgCountForChannel(channel)) {
                        this.games[channel].lastMsg = Date.now();

                        setTimeout(function(){
                            // Play
                            this.chatClient.say(channel, this.games[channel].message);
                            this.emit('play');

                            this.games[channel].status = 'Playing';
                            this.games[channel].rounds = this.games[channel].rounds + 1;
                            setTimeout(function(){
                                this.games[channel].status = 'Waiting...';
                            }.bind(this), 25000);
    
                        }.bind(this), Math.random() * (5000));
                    }
                }
            }
        });
    }

    setPlayMessage(channel, msg) {
        this.games[channel].message = msg;
    }

    setMinReqMsg(channel, msg) {
        this.games[channel].minReqMsg = msg;
    }

    setMinMsgDelay(channel, msg) {
        this.games[channel].minMsgDelay = msg * 1000;
    }
    
    getGames() {
        let _games = [];
        for(let i = 0; i < Object.keys(this.games).length; i++) {
            let _game = {
                channel: Object.keys(this.games)[i],
                rounds: this.games[Object.keys(this.games)[i]].rounds,
                status: this.games[Object.keys(this.games)[i]].status,
                isRunning: this.games[Object.keys(this.games)[i]].isRunning,
                message: this.games[Object.keys(this.games)[i]].message,
                minReqMsg: this.games[Object.keys(this.games)[i]].minReqMsg,
                minMsgDelay: this.games[Object.keys(this.games)[i]].minMsgDelay / 1000
            }

            _games.push(_game);
        }
        return _games;
    }

    addGame(channel) {
        if(!this.games[channel]) {
            this.games[channel] = {
                rounds: 0,
                status: 'Waiting...',
                lastMsg: Date.now() - GLOBAL_COOLDOWN,
                msgCount: 0,
                msgCountHandle: {},
                isRunning: true,
                message: GLOBAL_MESSAGE,
                minReqMsg: 3,
                minMsgDelay: 15000
            }
        }
    }

    removeGame(channel) {
        delete this.games[channel];
    }

    togglePlayGame(channel) {
        if(this.games[channel]) {
            this.games[channel].isRunning = !this.games[channel].isRunning;

            if(this.games[channel].isRunning) {
                this.games[channel].status = 'Waiting...';
            } else {
                this.games[channel].status = 'Paused...';
            }
        }
    }

    checkCooldownForChannel(channel) {
        const notOver = Date.now() - this.games[channel].lastMsg < GLOBAL_COOLDOWN
        return !notOver;
    }

    checkMsgCountForChannel(channel) {
        this.games[channel].msgCount = this.games[channel].msgCount + 1;
        if(this.games[channel].msgCount > this.games[channel].minReqMsg) {
            this.games[channel].msgCount = 0;
            return true;
        }
    
        if(!this.games[channel].msgCountHandle) {
            this.games[channel].msgCountHandle = setTimeout(function(){
                this.games[channel].msgCount = 0;
                clearTimeout(this.games[channel].msgCountHandle);
            }, this.games[channel].minMsgDelay);
        }
        
        return false;
    }

}

export default MarblesService;