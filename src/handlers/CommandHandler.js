'use strict'

const {commands} = require('../loaders/Collections');
const {COMMAND_PREFIX} = require('../../config');

exports.trigger = (packet, client) => {
    if(packet.action !== ActionType.PLAYER.MESSAGE) return;
    let command = packet.params[0];

    if(!command.startsWith(COMMAND_PREFIX)) return;
    command = command.split(COMMAND_PREFIX)[1];

    let args = command.split(' ');
    command = args[0].toLowerCase();

    let commandIndex = commands.findIndex(x => x.info.name === command);
    if(commandIndex === -1) return;

    commands[commandIndex].init(args, client);
    return true;
}