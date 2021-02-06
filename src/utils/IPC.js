'use strict'

const Connection = require('../handlers/ConnectionHandler');

module.exports = class IPC extends Connection {

    /**
     * Transport data from login proxy to world proxy.
     */

    localIPCServer() {
        logger.debug('Created local IPC server on port 8000.')
        return this.ioServer(8000, {
            path: '/localIPC',
            transports: ['websocket']
        });
    }

    localIPCListener() {
        logger.debug('Listening to local IPC server on port 8000.')
        return this.ioClient(`ws://localhost:8000`, {
            path: '/localIPC',
            transports: ['websocket']
        });
    }

}