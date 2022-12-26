const { Colors } = require('../../../emums/colors');
const { Icons } = require('../../../emums/icons');

module.exports = {
    dialog: {
        name: 'giftAnalyzed',
        embedColor: Colors.NoraColor,
        step1: {
            name: 'Nora',
            message: '**{displayName}**, que significara tu nombre?',
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: '🛒',
                },
                option2: {
                    text: 'Al final que hiciste con el regalo?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Nora',
            message: 'Porfa compra algo necesito dinero',
            specialFunction: {
                name: 'openShop',
            },
        },
        step2option2: {
            name: 'Nora',
            message: 'Lo estudie\nTodavia no lo pude comprender a profundidad',
            options: {
                option1: {
                    text: 'Uhhh, no querras que te traiga otro verdad?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step3option1: {
            name: 'Nora',
            message: 'Te lo pido por favor... y no nunca pido favores...',
            options: {
                option1: {
                    text: '...Bueno, esta bien',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option1: {
            name: 'Nora',
            message: 'Necesito por lo menos 2 muestras ahora',
            options: {
                option1: {
                    text: 'Entendido',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Nora/default',
            },
        },
        step5option1: {
            name: 'Nora',
            message: '...Que esperas? Ve!',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Nora',
                quest: {
                    mission: 'Participa en drops',
                    description: 'Nora quiere que le lleves 2 muestras de los regalos',
                    goal: 2,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: ['Nora/giftDropQuest2Completed'],
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