const {CPR_SERVER, CLIENT_PAGE, OPEN_BROWSER, LOGIN_PORT} = require('./config');
const {cyan} = require('chalk');

const open = require('open');
const worlds = require('./config/worlds');

const Connection = require('./src/handlers/ConnectionHandler');
const IPC = require('./src/utils/IPC');

const CommandLoader = require('./src/loaders/Commands');

global.WebSocket = require('ws');
const { Packr } = require('msgpackr');

global.msgpackr = new Packr({useRecords:false});

global.CryptoUtils = require('./src/utils/cryptoUtils');

global.ActionType = require('./src/enums/ActionType');
global.ConnectionType = require('./src/enums/ConnectionType');
global.ErrorMessage = require('./src/enums/ErrorMessage');
global.ProxyType = require('./src/enums/ProxyType');

global.PenguinClient = require('./src/utils/penguin');
global.Events = require('./src/handlers/EventHandler');

const selectedType = process.argv[2];

console.log(cyan`
 ██████╗██████╗ ██████╗     ██████╗ ██████╗  ██████╗ ██╗  ██╗██╗   ██╗
██╔════╝██╔══██╗██╔══██╗    ██╔══██╗██╔══██╗██╔═══██╗╚██╗██╔╝╚██╗ ██╔╝
██║     ██████╔╝██████╔╝    ██████╔╝██████╔╝██║   ██║ ╚███╔╝  ╚████╔╝ 
██║     ██╔═══╝ ██╔══██╗    ██╔═══╝ ██╔══██╗██║   ██║ ██╔██╗   ╚██╔╝  
╚██████╗██║     ██║  ██║    ██║     ██║  ██║╚██████╔╝██╔╝ ██╗   ██║   
 ╚═════╝╚═╝     ╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    `);

const logger = require('./src/utils/logger');
if (!selectedType) return logger.error(ErrorMessage['NO_PARAMS']);

global.selectedType = selectedType;
global.logger = logger;

let ipc = new IPC();

switch (selectedType) {
    case ProxyType.LOGIN:
        logger.info('Started Login Server Proxy.');
        global.localIPCServer = ipc.localIPCServer();
        if (OPEN_BROWSER === true) open(CLIENT_PAGE);
		
        let proxy = new Connection(CPR_SERVER, LOGIN_PORT);
        proxy.start();
        break;
    case ProxyType.WORLD:
        logger.info('Started World Server Proxy.');
        global.localIPCListener = ipc.localIPCListener();
        CommandLoader.load();

        for (let world in worlds) {
            const {english: WORLD_NAME, port: WORLD_PORT, safe_chat} = worlds[world];
            if (safe_chat) continue;

            let proxy = new Connection(CPR_SERVER, WORLD_PORT, WORLD_NAME);
            proxy.start();
        }
        break;
    default:
        return logger.error(ErrorMessage['INVALID_TYPE']);
}