const { Colors } = require('../../../emums/colors');

module.exports = {
    dialog: {
        name: 'shopCmd',
        embedColor: Colors.NoraColor,
        step1: {
            name: 'Nora',
            message: 'Hola **{displayName}**, espero vengas a comprar algo.',
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: '🛒',
                },
            },
        },
        step2option1: {
            name: 'Nora',
            message: 'Esto es lo que tengo actualmente',
            specialFunction: {
                name: 'openShop',
            },
        },
    },
};