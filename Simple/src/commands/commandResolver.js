"use strict";

const commands = require('./commands');

const commandResolver = (client, channel, user, message) => {
    const command = recognizeCommand(message);
    if (!command) return;

    commands.call(client, command, { channel, user, message });
}

const recognizeCommand = (message) => {
    const regex = /\!(.*?)$/gm;
    const fullCommand = regex.exec(message);
  
    if (fullCommand) {
        const splittedCommand = fullCommand[1].split(' ')
        const command = splittedCommand[0];
    
        splittedCommand.shift() // remove command from array
    
        return {
            command: command,
            args: splittedCommand
        }
    }
  
    return false
}
  
module.exports = {
    resolve: (client, channel, user, message) => {
      commandResolver(client, channel, user, message)
    }
}