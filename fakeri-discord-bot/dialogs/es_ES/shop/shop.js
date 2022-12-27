const { Colors } = require('../../../emums/colors');

const shopResponses = [
    '...',
    'Saludos terricola',
    'Compra algo, **{displayName}**',
    '\\*tarareo\\*',
    'uhh...\nNo te ves bien',
    'Te ves como si no tuvieras dinero',
    'Tengo prisa, compra algo rapido',
];

module.exports = {
    dialog: {
        name: 'shopCmd',
        embedColor: Colors.NoraColor,
        step1: {
            name: 'Nora',
            message: shopResponses[Math.floor(Math.random() * shopResponses.length)],
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: '🛒',
                },
            },
        },
        step2option1: {
            name: 'Nora',
            message: 'Tengo esto por ahora',
            specialFunction: {
                name: 'openShop',
            },
        },
    },
};