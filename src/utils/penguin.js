

module.exports = class PenguinClient {

    constructor(server, client) {
        this.CryptoUtils = new CryptoUtils();
        this.server = server;
        this.client = client;
        this.timeout = null;
    }

    async emitToServer(action, params) {
        let packet = {action, params};
        packet = JSON.stringify(packet);

        logger.outgoing(packet);
        packet = await this.cryptoUtils.encrypt(packet);
        this.server.send(packet);
    }

    heartBeat() {
		var _this2 = this;
		if(this.timeout !== null) clearTimeout(this.timeout);
        this.timeout = setTimeout(disconnect, 22000, _this2.client);
		logger.info(this.timeout)
    }
}

function disconnect(client) {
	Events.close.init(ConnectionType.CLIENT, '41', client)
}