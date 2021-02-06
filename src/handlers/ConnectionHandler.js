'use strict'
const fs = require('fs');
const https = require('https');
let IPCOn = false;

global.clients = {}

global.servers = {}

global.receivedPackets = {}

module.exports = class Connection {
    constructor(cpr_server, server_port, world_name) {
        this.cpr_server = cpr_server;
        this.server_port = server_port;
        this.world_name = world_name;

        this.ioServer = require('socket.io');
        this.ioClient = require('socket.io-client');

        process.on('SIGTERM', async () => await this.stop('SIGTERM'));
        process.on('SIGINT', async () => await this.stop('SIGINT'));

    }

    start() {
		const server = https.createServer({
		  cert: fs.readFileSync('/root/proxy/cert.pem'),
		  key: fs.readFileSync('/root/proxy/priv.pem')
		});
		this.client = new WebSocket.Server({server});
        if (selectedType === ProxyType.LOGIN) {
            logger.info(`Listening to login on proxy server 127.0.0.1:${this.server_port}`);
        } else logger.info(`Listening to world ${this.world_name} on proxy server 127.0.0.1:${this.server_port}`);

        if (IPCOn === false && selectedType === ProxyType.WORLD) this.startIPCListener();

        this.client.on('connection', async (client) => {
			client.ipAddr = client._socket.remoteAddress
			
			clients[client.ipAddr] = client;
			
            logger.debug('Client connected to proxy.');
            await Events.connection.init(this.world_name, this.cpr_server, this.server_port, receivedPackets[client.ipAddr], client);
        });
		server.listen(this.server_port, '0.0.0.0');
    }

    async stop(event) {
		for(let server in servers){
			await Events.close.init('server', event, server)
		}
		for(let client in clients){
			await Events.close.init('client', event, client)
		}
        process.exit(0);
    }

    startIPCListener() {
        IPCOn = true;

        localIPCListener.on('servers', (data, ipAddr) => {
            logger.debug('Received packet from login proxy.')
            receivedPackets[ipAddr] = data;
        });
    }
}