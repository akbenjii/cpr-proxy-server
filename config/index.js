'use strict'

module.exports = Object.freeze({
    "COMMAND_PREFIX": "!",
    "HIDE_DEBUG": false,
    "CHAT_REGEX": '[^A-Za-z0-9!\'\\" ?,]+',
    "OPEN_BROWSER": false,
    "LOG_CRUMBS": false,
    "CLIENT_PAGE": "https://play.cprewritten.net/?ip=ws://127.0.0.1:7072&ssl=false&world_ip=127.0.0.1",
    "CPR_SERVER": "server.cprewritten.net",
    "LOGIN_PORT": 7072,
    "keepLogs": {
        "debug": "1d",
        "info": "1d",
        "warn": "2d",
        "error": "3d",
        "incoming": "4d",
        "outgoing": "4d"
    }
});