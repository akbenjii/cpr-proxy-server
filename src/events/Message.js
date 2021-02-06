'use strict'

const {CHAT_REGEX} = require('../../config');
const CryptoKey = require('../handlers/CryptoKey');
const Command = require('../handlers/CommandHandler');

// Server -> Proxy -> Client
exports.incoming = async (data, world_name, received_packet, client) => {
    let incoming_packet = client.penguin.CryptoUtils.key ? msgpackr.unpack(await client.penguin.CryptoUtils.decrypt(data)) : msgpackr.unpack(new Uint8Array(data));
    logger.incoming(JSON.stringify(incoming_packet));

    if (!client.penguin.CryptoUtils.key) await CryptoKey.init(data, world_name, received_packet, client);
    else if(selectedType === ProxyType.LOGIN && incoming_packet.action === ActionType.LOGIN.USER) {
        let servers = incoming_packet.params[4];

        incoming_packet.params[incoming_packet.params.length - 2] = CHAT_REGEX;
        data = await client.penguin.CryptoUtils.encrypt(incoming_packet);

        await sendToWorldProxy(incoming_packet, servers, client);
    }
	
    client.send(data);
}

// Client -> Proxy -> Server
exports.outgoing = async (data, server, client) => {
	if(server.readyState !== 1) await waitFor(_ => server.readyState === 1);
    let outgoing_packet = client.penguin.CryptoUtils.key ? msgpackr.unpack(await client.penguin.CryptoUtils.decrypt(data)) : msgpackr.unpack(new Uint8Array(data));
    let commandHasRun = Command.trigger(outgoing_packet, client);

    if (commandHasRun === true) return;

	if(outgoing_packet.action === ActionType.ENGINE.KEEP_ALIVE){
		client.penguin.heartBeat()
	}

    logger.outgoing(JSON.stringify(outgoing_packet));
    server.send(data);
}

async function sendToWorldProxy(data, servers, client) {
    localIPCServer.emit('servers', servers, client.ipAddr);

    client.penguin.CryptoUtils.resetCrypto();
    logger.debug('Sent login packet to proxy.');
}

async function waitFor(conditionFunction) {

	const poll = resolve => {
	  console.log(conditionFunction())
	  if(conditionFunction()) resolve();
	  else setTimeout(_ => poll(resolve), 400);
	}
  
	return new Promise(poll);
}