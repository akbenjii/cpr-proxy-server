'use strict'

const Connection = require('./connection');

module.exports = class Penguin extends Connection {
    constructor(port, world_name) {
        super(port);

        this.world_name = world_name
    }

    /**
     *
     * TO-DO
     * - add heartbeat detection cus cpr gay
     * - send message function using engine:prompt
     *
     */

    async emitToServer(action, params) {
        let packet = {action, params};
        logger.outgoing(JSON.stringify(packet));

        packet = await this.cryptoUtils.encrypt(packet);
        this.server.send(packet);
    }

    async emitToClient(action, params) {
        let packet = {action, params};
        logger.incoming(JSON.stringify(packet));

        packet = await this.cryptoUtils.encrypt(packet);
        this.client.send(packet);
    }
}