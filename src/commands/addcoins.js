module.exports = (message, penguin, args) => {
    message.outgoing(penguin, {
        action: 'navigation:join_room',
        params: [903, 4, 38]
    }, true);
    message.outgoing(penguin, {
        action: 'game:over',
        params: [parseInt(args[0]), 407, 692]
    }, true);
}
