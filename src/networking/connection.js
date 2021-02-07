'use strict'

const WebSocket = require('ws');
const redis = require("redis");

module.exports = class Connection {
    constructor(port) {
        this.port = port;

        this.client = new WebSocket.Server({port: port});
        this._redis = redis.createClient({
            host: '127.0.0.1',
            port: 6379
        });

        process.on('SIGTERM', async () => await this.stop('SIGTERM'));
        process.on('SIGINT', async () => await this.stop('SIGINT'));
    }

    connectToCPR() { // Client to Server
        return new WebSocket(`wss://server.cprewritten.net:${this.port}/`, {
            origin: 'https://play.cprewritten.net',
            rejectUnauthorized: false,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36"
            }
        });
    }

    async waitFor(conditionFunction) {
        const poll = resolve => {
            if (conditionFunction()) resolve();
            else setTimeout(_ => poll(resolve), 400);
        }
        return new Promise(poll);
    }

    stop() {
        process.exit(0);
    }
}