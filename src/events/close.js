'use strict'

exports.init = (socket, type, msg) => {
    if (type === ConnectionType.CLIENT && socket.client) {
        socket.client.close();
        socket._redis.del(`login:u${socket.ip_addr}`);

        socket.client = null

        logger.info(`Client${socket.ip_addr} has been closed. reason : ${msg}`);
        this.init(socket, ConnectionType.SERVER, 'client closed.');
    } else if (type === ConnectionType.SERVER && socket.server) {
        socket.server.close();
        socket.server = null;

        logger.info(`Server${socket.ip_addr} has been closed. reason : ${msg}`);
    }
}