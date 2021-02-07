'use strict'

exports.init = async (penguin, args) => {
    let room_id = parseInt(args[1]);
    await penguin.emitToServer(ActionType.NAVIGATION.JOIN_ROOM, [room_id,4,38]);
}

exports.info = {
    name: 'joinroom',
    aliases: ['jr']
}