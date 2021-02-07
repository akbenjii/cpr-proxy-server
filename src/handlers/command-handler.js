'use strict'

const {commands} = require('../loaders/collections');
const {COMMAND_PREFIX} = require('../../config');

exports.trigger = (penguin, packet) => {
    let command = packet.params[0];

    if(!command.startsWith(COMMAND_PREFIX)) return;
    command = command.split(COMMAND_PREFIX)[1];

    let args = command.split(' ');
    command = args[0].toLowerCase();

    let commandIndex = commands.findIndex(x => x.info.name === command);

    if(commandIndex === -1) {
        let aliasIndex = commands.findIndex(x => x.info.aliases.includes(command));
        if(aliasIndex === -1) return;

        commands[aliasIndex].init(penguin, args);
        return penguin.ranCommand = true;
    }

    commands[commandIndex].init(penguin, args);
    return penguin.ranCommand = true;
}