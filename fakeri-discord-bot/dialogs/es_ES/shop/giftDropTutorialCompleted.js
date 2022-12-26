const { Colors } = require('../../../emums/colors');
const { Icons } = require('../../../emums/icons');

module.exports = {
    dialog: {
        name: 'giftDropTutorialCompleted',
        embedColor: Colors.NoraColor,
        step1: {
            name: 'Nora',
            message: '**{displayName}**, donde esta...?',
            options: {
                option1: {
                    text: 'E-el regalo?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Nora',
            message: 'Si...si, el regalo',
            options: {
                option1: {
                    text: 'Aqui tienes',
                    emoji: '🫳',
                },
            },
        },
        step3option1: {
            name: 'Nora',
            message: 'Heh',
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: '🛒',
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Nora/giftAnalyzed',
            },
        },
        step4option1: {
            name: 'Nora',
            message: 'Ah si, tengo esto',
            specialFunction: {
                name: 'openShop',
            },
        },
    },
};