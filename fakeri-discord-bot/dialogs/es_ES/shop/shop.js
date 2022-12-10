module.exports = {
    dialog: {
        name: 'shopCmd',
        embedColor: '#C600FF',
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