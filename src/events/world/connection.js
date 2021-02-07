'use strict'

exports.init = (penguin) => {
    penguin.server = penguin.connectToCPR();
    penguin.cryptoUtils = new CryptoUtils();

    penguin.server.on('open', () => {
        logger.info(`Proxy${penguin.ip_addr} has connected to World "${penguin.world_name}"!`);
    });

    penguin.server.on('close', reason => Events.close.init(penguin, ConnectionType.SERVER, reason));
    penguin.client.on('close', reason => Events.close.init(penguin, ConnectionType.CLIENT, reason));

    penguin.server.on('error', err => Events.close.init(penguin, ConnectionType.SERVER, err));
    penguin.client.on('error', err => Events.close.init(penguin, ConnectionType.CLIENT, err));

    penguin.server.on('message', data => Events.world.message.incoming(penguin, data));
    penguin.client.on('message', data => Events.world.message.outgoing(penguin, data));
}