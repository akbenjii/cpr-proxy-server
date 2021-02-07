'use strict'

exports.init = (login) => {
    login.server = login.connectToCPR();
    login.cryptoUtils = new CryptoUtils();

    login.server.on('open', () => logger.info(`Proxy${login.ip_addr} has connected to CPR\'s login server.`));

    login.server.on('close', reason => Events.close.init(login, ConnectionType.SERVER, reason));
    login.client.on('close', reason => Events.close.init(login, ConnectionType.CLIENT, reason));

    login.server.on('error', err => Events.close.init(login, ConnectionType.SERVER, err));
    login.client.on('error', err => Events.close.init(login, ConnectionType.CLIENT, err));

    login.server.on('message', data => Events.login.message.incoming(login, data));
    login.client.on('message', data => Events.login.message.outgoing(login, data));
}