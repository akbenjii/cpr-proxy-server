'use strict'

const Command = require('../../handlers/command-handler');
const cryptoKey = require('../../handlers/cryptokey');

const {unpack} = require('msgpackr');

exports.incoming = async (penguin, data) => {
    if(!penguin.client || !penguin.server) return;
    try {
        if (penguin.key_exist === false) { // check if login:u world key exists in redis.
            penguin.client.close();
// {"action":"engine:prompt","params":["logout","Invalid crumbs type.",true]}
            logger.error(`login:u does not exists for Penguin${penguin.ip_addr}`);
            return penguin.emitToClient(ActionType.ENGINE.PROMPT, ["logout","urgay",true])
        }
        let incoming_packet = penguin.cryptoUtils.key ? unpack(await penguin.cryptoUtils.decrypt(data)) : unpack(new Uint8Array(data));
        incoming_packet = JSON.stringify(incoming_packet);

        logger.incoming(incoming_packet);
        penguin.client.send(data)
    } catch (err) {
        logger.error(`Client : ${err}`);
    }
}

exports.outgoing = async (penguin, data) => {
    if(!penguin.client || !penguin.server) return;
    try {
        if (penguin.server && penguin.server.readyState !== 1) await penguin.waitFor(_ => penguin.server.readyState === 1);
        if (!penguin.cryptoUtils['key']) await cryptoKey.init(penguin);

        let outgoing_packet = penguin.cryptoUtils.key ? unpack(await penguin.cryptoUtils.decrypt(data)) : unpack(new Uint8Array(data));
        if(outgoing_packet.action === ActionType.PLAYER.MESSAGE) Command.trigger(penguin, outgoing_packet);
        if(penguin.ranCommand === true) return penguin.ranCommand = false;

        outgoing_packet = JSON.stringify(outgoing_packet);
        logger.outgoing(outgoing_packet);
        penguin.server.send(data);
    } catch (err) {
        logger.error(`Server : ${err}`);
        if (penguin.client) penguin.client.close();
    }
}