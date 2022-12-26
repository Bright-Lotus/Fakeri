const { Colors } = require('../../../emums/colors');
const { Icons } = require('../../../emums/icons');

module.exports = {
    dialog: {
        name: 'evilHint',
        embedColor: Colors.NoraColor,
        step1: {
            name: 'Nora',
            message: 'Que bueno que vienes, **{displayName}**.',
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: '🛒',
                },
                option2: {
                    text: 'Que paso?!',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Nora',
            message: 'Si, si, la tienda',
            specialFunction: {
                name: 'openShop',
            },
        },
        step2option2: {
            name: 'Nora',
            message: 'Acerca de los regalos, pude descubrir mas',
            options: {
                option1: {
                    text: 'Que descubriste?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step3option1: {
            name: 'Nora',
            message: 'Las muestras parecen decir algo, lo pude decifrar:\nLos "drops" solo suceden cuando algo va a pasar, un acontencimiento grande o algo\n\nSolo pude llegar ahi! Pero estoy tan cerca...',
            options: {
                option1: {
                    text: 'Ya, ya se que hacer',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Nora/default',
            },
        },
        step4option1: {
            name: 'Nora',
            message: '**{displayName}**! Solo necesito una muestra esta vez',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Nora',
                quest: {
                    mission: 'Participa en un drop',
                    description: 'Un acontencimiento grande?! Que sera?! Sera algo malo?!',
                    goal: 1,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: [ 'Nora/giftQuest4Completed' ],
                    },
                    rewards: {
                        gold: 30,
                        xpBonus: 1,
                        stars: 0,
                    },
                    type: 7,
                },
            },
        },
    },
};