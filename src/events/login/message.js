'use strict'

const { unpack } = require('msgpackr');

const cryptoKey = require('../../handlers/cryptokey');

const { CHAT_REGEX } = require('../../../config');

exports.incoming = async (login, data) => {
    try {
        let incoming_packet = login.cryptoUtils.key ? unpack(await login.cryptoUtils.decrypt(data)) : unpack(new Uint8Array(data));
        if (!login.cryptoUtils['key']) await cryptoKey.init(login, incoming_packet);

        if (incoming_packet.action === ActionType.LOGIN.USER) {
            login._redis.exists(`login:u${login.ip_addr}`, (err, exists) => {
                if (exists === 1) login._redis.del(`login:u${login.ip_addr}`);
                login._redis.set(`login:u${login.ip_addr}`, JSON.stringify(incoming_packet), login._redis.print);
            });

            incoming_packet.params[incoming_packet.params.length - 2] = CHAT_REGEX;
            data = await login.cryptoUtils.encrypt(incoming_packet);
        } else if (incoming_packet.action === ActionType.ENGINE.PROMPT) logger.info(`User${login.ip_addr} failed login.`);

        logger.incoming(JSON.stringify(incoming_packet));

        login.client.send(data);
    } catch(err) {
        logger.error(`Client : ${err}`)
    }
}

exports.outgoing = async (login, data) => {
    try {
        let outgoing_packet = login.cryptoUtils.key ? unpack(await login.cryptoUtils.decrypt(data)) : unpack(data);
        if (login.server && login.server.readyState !== 1) await login.waitFor(_ => login.server.readyState === 1);

        outgoing_packet = JSON.stringify(outgoing_packet);
        logger.outgoing(outgoing_packet);

        login.server.send(data);
    } catch(err) {
        logger.error(`Server : ${err}`);
    }
}
