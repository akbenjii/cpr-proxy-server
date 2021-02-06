'use strict'

const ioClient = require('socket.io-client');

exports.init = async (world_name, cpr_server, server_port, received_packet, client) => {
    if (selectedType === ProxyType.LOGIN) logger.info('Client has connected to login server.');
    else logger.info(`Client has connected to world ${world_name}`);

    let server = connectToServer(cpr_server, server_port);
	servers[client.ipAddr] = server;
	client.penguin = new PenguinClient(server, client)


    if (selectedType === ProxyType.LOGIN) server.on('connect', () => {
        logger.info('Proxy has connected to CPR\'s login server.')
    })
	
    else server.on('connect', (cpr_server, server_port) => {
        logger.info(`Proxy has connected to World "${world_name}" server.`)
    });

    server.on('message', (data) => Events.message.incoming(data, client));
    server.on('error', (err) => Events.close.init(ConnectionType.SERVER, err, server, client));
    server.on('close', (reason) => Events.close.init(ConnectionType.SERVER, reason, server));

    client.on('message', (data) => Events.message.outgoing(data, world_name,server, client));
    client.on('error', (err) => Events.close.init(ConnectionType.CLIENT, err, server, client));
    client.on('close', (reason) => Events.close.init(ConnectionType.CLIENT, reason, client));
}

function connectToServer(server, port) { // Client to Server
    return new WebSocket(`wss://${server}:${port}/`, {
	  origin: 'https://play.cprewritten.net',
	  rejectUnauthorized: false,
	  headers: {
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36"
		}
	});
}
