'use strict'

const Penguin = require('./networking/penguin');
const Servers = require('../config/servers');

module.exports = class World {
    init() {
        for (let world in Servers) {
            const {english: world_name, port: world_port, safe_chat} = Servers[world];
            if (safe_chat) continue;

            logger.info(`Listening to world ${world_name} on proxy server 127.0.0.1:${world_port}`);

            // Start local servers //
            let penguin = new Penguin(world_port, world_name);

            // Created whenever a penguin connects. //
            penguin.client.on('connection', client => {
                penguin.client = client;
                penguin.ip_addr = `[${client._socket.remoteAddress}]`;

                logger.info(`Penguin${penguin.ip_addr} has connected to proxy!`);
                Events.world.connection.init(penguin);
            })
        }
    }
}