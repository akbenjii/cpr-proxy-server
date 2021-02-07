'use strict'

exports.init = (socket, type, msg) => {
    if (type === ConnectionType.CLIENT && socket.client) {
        try {
            socket.client.close();
            socket.client = null;
            socket._redis.del(`login:u${socket.ip_addr}`);

            logger.info(`Client${socket.ip_addr} has been closed. Reason : ${msg}`);
            this.init(socket, ConnectionType.SERVER, 'client closed.');
        } catch (e) {
            logger.error(`Error closing Client : ${e}`);
        }
    } else if (type === ConnectionType.SERVER && socket.server) {
        socket.server.close();
        socket.server = null;

        logger.info(`Server${socket.ip_addr} has been closed. Reason : ${msg}`);
    }
}
