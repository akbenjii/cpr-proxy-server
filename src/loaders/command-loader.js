const {commands} = require('./collections');
const fs = require("fs");

exports.load = () => {
    const files = fs.readdirSync(`${__dirname}/../../commands/`);
    if (files.length < 1) logger.debug(`[Command Loader]: No commands found.`)
    else logger.debug(`[Command Loader]: Commands Found: ${files.length}.`)

    files.forEach(command => {
        if (command.split(".").slice(-1)[0] !== "js") return;
        const props = require(`${__dirname}/../../commands/${command}`);
        commands.push(props);

        logger.debug(`[Command Loader]: Loaded ${command.replace(".js", "")} command.`);
    });
};