'use strict'

const cryptoKey = require('../../handlers/cryptokey');

const {unpack} = require('msgpackr');
const {CHAT_REGEX} = require('../../../config');

exports.incoming = async (login, data) => {
    let incoming_packet = login.cryptoUtils.key ? unpack(await login.cryptoUtils.decrypt(data)) : unpack(new Uint8Array(data));
    if (!login.cryptoUtils['key']) await cryptoKey.init(login, incoming_packet);

    logger.incoming(JSON.stringify(incoming_packet));

    if (incoming_packet.action === ActionType.LOGIN.USER) {
        login._redis.set(`login:u${login.ip_addr}`, JSON.stringify(incoming_packet), login._redis.print);

        incoming_packet.params[incoming_packet.params.length - 2] = CHAT_REGEX;
        data = await login.cryptoUtils.encrypt(incoming_packet);
    } else if (incoming_packet.action === ActionType.ENGINE.PROMPT) logger.info(`User${login.ip_addr} failed login.`);

    login.client.send(data);
}

exports.outgoing = async (login, data) => {
    let outgoing_packet = login.cryptoUtils.key ? unpack(await login.cryptoUtils.decrypt(data)) : unpack(new Uint8Array(data));
    if (login.server.readyState !== 1) await login.waitFor(_ => login.server.readyState === 1);

    outgoing_packet = JSON.stringify(outgoing_packet);
    logger.outgoing(outgoing_packet);

    login.server.send(data);
}