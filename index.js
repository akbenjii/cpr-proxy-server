const Login = require('./src/login');
const World = require('./src/world');

// # Globals # //
// Enums //
global.ActionType = require('./src/enums/action-type');
global.ConnectionType = require('./src/enums/connection-type');
global.ErrorMessage = require('./src/enums/error-message');
global.ProxyType = require('./src/enums/proxy-type');

// Utils //
global.selectedType = process.argv[2];
global.CryptoUtils = require('./src/utils/crypto');
global.logger = require('./src/utils/logger');

// Handlers //
global.Events = require('./src/handlers/event-handler');

switch (selectedType) {
    case ProxyType.LOGIN:
        logger.info('Starting Login Proxy.');

        new Login().init(7072);
        break;
    case ProxyType.WORLD:
        logger.info('Starting World Proxy.');

        new World().init();
        break;
    default:
        return logger.error(ErrorMessage['INVALID_TYPE']);
}