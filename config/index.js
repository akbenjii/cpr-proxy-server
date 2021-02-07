'use strict'

module.exports = Object.freeze({
    "COMMAND_PREFIX": "!",
    "HIDE_DEBUG": false,
    "HIDE_PACKETS": false,
    "CHAT_REGEX": '[^A-Za-z0-9!\'\\" ?,]+',
    "keepLogs": {
        "debug": "1d",
        "info": "1d",
        "warn": "2d",
        "error": "3d",
        "incoming": "4d",
        "outgoing": "4d"
    }
});