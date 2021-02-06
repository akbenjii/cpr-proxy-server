'use strict'

exports.init = async (data, world_name, received_packet, client) => {
    switch (selectedType) {
        case ProxyType.LOGIN:
            let packet = msgpackr.unpack(new Uint8Array(data));
            if (packet.action !== ActionType.LOGIN.KEY) return;
            let key = packet.params[0];

            await client.penguin.CryptoUtils.createKey(key);
            logger.debug('Created CryptoKey for Login!');
            break;
        case ProxyType.WORLD:
            world_name = world_name.toLowerCase();

            await client.penguin.CryptoUtils.createKey(received_packet[world_name].key);
            logger.debug(`Created CryptoKey for world "${world_name}!`);
            break;
    }
}