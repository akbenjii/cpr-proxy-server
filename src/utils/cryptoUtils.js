const {subtle, getRandomValues} = require('crypto').webcrypto;

if (typeof btoa === 'undefined') {
    global.btoa = (str) => {
        return Buffer.from(str, 'binary').toString('base64');
    };
}

if (typeof atob === 'undefined') {
    global.atob = (b64Encoded) => {
        return Buffer.from(b64Encoded, 'base64').toString('binary');
    };
}

module.exports = class CryptoUtils {
    constructor() {
        this.resetCrypto()
    }

    resetCrypto() {
        this.key = undefined
    }

    async decrypt(toDecrypt) {
        const iv = toDecrypt.slice(0, 12)
        const stringToDecrypt = toDecrypt.slice(12);
        const decrypted = await subtle.decrypt({
            name: 'AES-GCM',
            iv
        }, this.key, stringToDecrypt);
        return new Uint8Array(decrypted);
    };

    hexStringToByte(str) {
        if (!str) {
            return new Uint8Array();
        }
        var a = [];
        for (var i = 0, len = str.length; i < len; i += 2) {
            a.push(parseInt(str.substr(i, 2), 16));
        }
        return new Uint8Array(a);
    }

    async createKey(stringKey) {
        let key = this.hexStringToByte(stringKey),
            cryptoKey = await subtle.importKey('raw', key, 'AES-GCM', false, ['encrypt', 'decrypt']);
        this.key = cryptoKey;
        return cryptoKey
    };

    async encrypt(str) {
		str = msgpackr.pack(str);
        let iv = getRandomValues(new Uint8Array(12)),
            AESstr = new Uint8Array(await subtle.encrypt({
                name: 'AES-GCM',
                iv
            }, this.key, str));
        const encrypted = new Uint8Array(AESstr.byteLength + 12);
        encrypted.set(iv)
        encrypted.set(AESstr, iv.length)
        return encrypted;
    };
}