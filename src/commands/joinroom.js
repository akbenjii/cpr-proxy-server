module.exports = (message, penguin, args) => {
    message.outgoing(penguin, {
        action: 'navigation:join_room',
        params: [parseInt(args[0]), 4, 38]
    }, true);
}
