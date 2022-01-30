const { EventEmitter } = require("events");

const tmi = require('tmi.js');
const commandResolver = require('./commands/commandResolver');


module.exports = class TwitchBot extends EventEmitter { 
    constructor() {
        super();

        this.USER = 'iKasu2k';
        this.TOKEN = 'oauth:l85x6z5b2wfvciqs1gfsnotbqw7ol2';
        this.CHANNEL = ['#schmaxoff'];
    }

    initialize = () => {
        return new Promise((resolve, reject) => {
            this.client = new tmi.client({
                options: { debug: true },
    
                identity: {
                  username: this.USER,
                  password: this.TOKEN
                },
                connection: {
                    secure: true,
                    reconnect: true
                },
                channels: this.CHANNEL
            });
    
            this.client.on('message', this.onMessageHandler);
            this.client.on('connected', this.onConnectedHandler);
            this.client.on('disconnected', this.onDisconnectedHandler);
            this.client.on('reconnect', this.onReconnectHandler);
    
            this.client.connect();

            resolve();
        });   
    }

    say = (channel, msg) => {
        this.client.say(channel, msg);
    }

    onConnectedHandler = (addr, port) => {
        this.log(`* Connected to ${addr}:${port}`);
    }

    onDisconnectedHandler = (reason) => {
        this.log(`* Disconnected due to: ${reason}`);
    }

    onReconnectHandler = () => {
        this.log(`* Trying to reconnect...`);
    }

    onMessageHandler = (channel, user, message, self) => {
        if (self) { return; } // Ignore messages from the bot

        if ((message.indexOf('!')) !== -1) {
            switch(user["message-type"]) {
                case "chat":
                    commandResolver.resolve(this, channel, user, message);
                    break;
                default:
                    break;
            }
        }
    }

    log = (msg) => {
        console.log(msg);
    }
}