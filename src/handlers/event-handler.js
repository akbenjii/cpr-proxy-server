'use strict'

module.exports = Object.freeze({
    login: {
        connection: require('../events/login/connection'),
        message: require('../events/login/message')
    },
    world: {
        connection: require('../events/world/connection'),
        message: require('../events/world/message')
    },
    close: require('../events/close')
});