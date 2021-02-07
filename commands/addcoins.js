'use strict'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.init = async (penguin, args) => {

    let add_amount = parseInt(args[1]);

    await penguin.emitToServer(ActionType.NAVIGATION.JOIN_ROOM, [903,-36,-33]);
    await sleep(1200); // ensure the scene loads
    await penguin.emitToServer(ActionType.GAME.OVER, [add_amount,407,692]);
}

exports.info = {
    name: 'addcoins',
    aliases: ['ac', 'addcoin']
}