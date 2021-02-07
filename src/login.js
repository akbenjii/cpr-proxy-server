'use strict'

const Connection = require('./networking/connection');

module.exports = class Login {
    init(login_port) {
        let login = new Connection(login_port);
        logger.info(`Proxy is listening on 127.0.0.1:${login_port}`);

        login.client.on('connection', client => {
            login.client = client;
            login.ip_addr = `[${client._socket.remoteAddress}]`;

            logger.info(`User${login.ip_addr} has connected to proxy!`);
            Events.login.connection.init(login);
        });
    }
}