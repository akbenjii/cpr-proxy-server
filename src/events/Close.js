'use strict'

exports.init = async (type, msg, socket, client) => {
    if (type === ConnectionType.CLIENT && socket.connected) {
        socket.disconnect();

        logger.info(`The client socket has been disconnected.`);
        logger.debug(`Client disconnect reason : ${msg}`);

        socket.penguin.CryptoUtils.resetCrypto();
		
		delete clients[socket.ipAddr]
			
        this.init('server', 'Client closed.', servers[socket.ipAddr], socket)
    } else if (type === ConnectionType.SERVER && socket.connected) {
        socket.disconnect();

		delete servers[client.ipAddr]
		delete receivedPackets[client.ipAddr]

        logger.info(`The server socket has been disconnected.`);
        logger.debug(`Server disconnect reason : ${msg}`);
    }
}