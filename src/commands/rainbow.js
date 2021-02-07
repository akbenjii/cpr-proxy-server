const colors = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    15,
    16,
    18,
    19,
    20
];

let loop;

module.exports = (message, penguin, args) => {
    if (args[0] == 'on') {
        if (loop) clearInterval(loop);
        let currentColorIndex = 1;
        loop = setInterval(() => {
            message.outgoing(penguin, {
                action: 'player:update_wearing',
                params: ['color', colors[currentColorIndex]]
            }, true);
            if (currentColorIndex == 17) {
                currentColorIndex = 0;
            } else {
                currentColorIndex++;
            }
        }, args[1]);
    } else if ((args[0] == 'off') && (loop)) {
        clearInterval(loop);
    }
}
