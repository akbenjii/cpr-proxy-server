'use strict'

const fs = require('fs');
const { pack, unpack } = require('msgpackr');

const cryptoKey = require('../../handlers/cryptokey');

const prefix = '!';
const commands = {};

for (let file of fs.readdirSync(`${__dirname}\\..\\..\\commands`).filter(file => file.endsWith('.js'))) {
	let command = require(`${__dirname}\\..\\..\\commands\\${file}`);
	commands[file.slice(0, -3)] = command;
}

exports.incoming = async (penguin, data) => {
    try {
        if (penguin.key_exist === false) { // check if login:u world key exists in redis.
            penguin.client.close();
            penguin.server.close();

            return logger.error(`login:u does not exists for Penguin${penguin.ip_addr}`);
        }

        let incomingPacket = penguin.cryptoUtils.key ? unpack(await penguin.cryptoUtils.decrypt(data)) : unpack(data);
        incomingPacket = JSON.stringify(incomingPacket);

        logger.incoming(incomingPacket);
        penguin.client.send(data)
    } catch (err) {
        logger.error(`Client : ${err}`);
    }
}

exports.outgoing = async (penguin, data, isCustomPacket) => {
    try {
        if (penguin.server.readyState !== 1) await penguin.waitFor(_ => penguin.server.readyState === 1);
        if (!penguin.cryptoUtils['key']) await cryptoKey.init(penguin);

        if (isCustomPacket) {
            data = penguin.cryptoUtils.key ? await penguin.cryptoUtils.encrypt(data) : pack(data);
        }

        let outgoingPacket = penguin.cryptoUtils.key ? unpack(await penguin.cryptoUtils.decrypt(data)) : unpack(data);

        if (outgoingPacket.action == 'player:message') {
            let msg = outgoingPacket.params[0].toLowerCase();
            if (msg.startsWith(prefix)) {
                let args = msg.split(' ');
                let command = commands[args[0].slice(prefix.length)];
                if (command) {
                    args.shift();
                    try {
                        command(this, penguin, args);
                    } catch(err) {
                        logger.warn(`Command Error: ${err}`);
                    }
                }
            }
        }

        logger.outgoing(JSON.stringify(outgoingPacket));
        penguin.server.send(data);
    } catch(err) {
        logger.error(`Server : ${err}`);
        if (penguin.client) penguin.client.close();
    }
}
