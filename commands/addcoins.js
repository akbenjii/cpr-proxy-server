'use strict'

exports.init = async (args, client) => {

    let add_amount = parseInt(args[1]);

    await client.penguin.emitToServer(ActionType.NAVIGATION.JOIN_ROOM, [903,4,38]);
    await client.penguin.emitToServer(ActionType.GAME.OVER, [add_amount,407,692])
}

exports.info = {
    name: 'addcoins'
}