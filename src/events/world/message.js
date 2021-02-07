'use strict'

const cryptoKey = require('../../handlers/cryptokey');

const {unpack} = require('msgpackr');

exports.incoming = async (penguin, data) => {
    try {
        if (penguin.key_exist === false) { // check if login:u world key exists in redis.
            penguin.client.close();
            return logger.error(`login:u does not exists for Penguin${penguin.ip_addr}`);
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
    try {
        if (penguin.server && penguin.server.readyState !== 1) await penguin.waitFor(_ => penguin.server.readyState === 1);
        if (!penguin.cryptoUtils['key']) await cryptoKey.init(penguin);

        let outgoing_packet = penguin.cryptoUtils.key ? unpack(await penguin.cryptoUtils.decrypt(data)) : unpack(new Uint8Array(data));
        outgoing_packet = JSON.stringify(outgoing_packet);

        logger.outgoing(outgoing_packet);
        penguin.server.send(data);
    } catch (err) {
        logger.error(`Server : ${err}`);
        if (penguin.client) penguin.client.close();
        if (penguin.server) penguin.server.close();
    }
}