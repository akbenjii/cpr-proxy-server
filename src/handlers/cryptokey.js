'use strict'

exports.init = async (socket, packet) => {
    switch (selectedType) {
        case ProxyType.LOGIN:
            if (packet.action !== ActionType.LOGIN.KEY) return;
            let key = packet.params[0];

            await socket.cryptoUtils.createKey(key);
            logger.debug(`Created CryptoKey for User${socket.ip_addr}!`);
            break;
        case ProxyType.WORLD:
            let world_name = socket.world_name;
            world_name = world_name.toLowerCase();

            socket._redis.exists(`login:u${socket.ip_addr}`, (err, exists) => {
                if (err) return logger.error(err);
                if (exists !== 1) return socket.key_exist = false;
                socket.key_exist = true;

                socket._redis.get(`login:u${socket.ip_addr}`, async (err, login_packet) => {
                    socket._redis.del(`login:u${socket.ip_addr}`);

                    if (err) return logger.error(err);
                    login_packet = JSON.parse(login_packet);
                    login_packet = login_packet.params[4];

                    await socket.cryptoUtils.createKey(login_packet[world_name]['key']);
                    logger.debug(`Created CryptoKey for Penguin${socket.ip_addr} on world "${socket.world_name}"!`);
                });
            });
            break;
    }
}