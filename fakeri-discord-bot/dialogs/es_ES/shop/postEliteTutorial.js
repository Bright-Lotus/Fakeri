const { Colors } = require('../../../emums/colors');
const { Icons } = require('../../../emums/icons');

module.exports = {
    dialog: {
        name: 'postEliteTutorial',
        embedColor: Colors.NoraColor,
        step1: {
            name: 'Nora',
            message: '...',
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: '🛒',
                },
                option2: {
                    text: 'Que pasa?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Nora',
            message: 'Compra algo',
            specialFunction: {
                name: 'openShop',
            },
        },
        step2option2: {
            name: 'Nora',
            message: '...Quieres saber mas...?',
            options: {
                option1: {
                    text: 'Acerca de...?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step3option1: {
            name: 'Nora',
            message: '...Elite',
            options: {
                option1: {
                    text: 'Y por que tan misterioso?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option1: {
            name: 'Nora',
            message: 'Nada, queria ponerle suspenso',
            options: {
                option1: {
                    text: '...Bueno, cuentame entonces',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step5option1: {
            name: 'Nora',
            message: 'Esta bien\nLos Elite mutan gracias a una magia poderosa y maligna',
            options: {
                option1: {
                    text: 'Uhhh, si, sabia lo de la magia',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step6option1: {
            name: 'Nora',
            message: 'Ah... Umm... Bueno esta bien mira solo quiero que me traigas uno de los regalos esos que caen del cielo',
            options: {
                option1: {
                    text: '¿Para que?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step7option1: {
            name: 'Nora',
            message: 'NO TE IMPORTA, solo hazlo',
            options: {
                option1: {
                    text: 'Hmmm, no.',
                    emoji: Icons.SpeakBtn,
                },
                option2: {
                    text: 'Esta bien, lo hare',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Nora/default',
            },
        },
        step8option1: {
            name: 'Nora',
            message: '...Te dare oro, y... algo especial',
            options: {
                option1: {
                    text: 'Aun asi, no me interesa',
                    emoji: Icons.SpeakBtn,
                },
                option2: {
                    text: 'Esta bien, lo hare',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step8option2: {
            name: 'Nora',
            message: 'Asi me gusta',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Nora',
                quest: {
                    mission: 'Participa en un drop',
                    description: 'Nora quiere que recojas un regalo que cae del cielo',
                    goal: 1,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: ['Nora/giftDropTutorialCompleted'],
                    },
                    rewards: {
                        gold: 20,
                        xpBonus: 1,
                        stars: 0,
                    },
                    type: 7,
                },
            },
        },
        step9option1: {
            name: 'Nora',
            message: 'UGH, no me importa, solo hazlo!\nO si no... no te vendere nada nunca mas',
            options: {
                option1: {
                    text: 'Esta bien, esta bien... te traere uno',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step9option2: {
            name: 'Nora',
            message: 'Que bueno que nos entendemos',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Nora',
                quest: {
                    mission: 'Participa en un drop',
                    description: 'Nora quiere que recojas un regalo que cae del cielo',
                    goal: 1,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: ['Nora/giftDropTutorialCompleted'],
                    },
                    rewards: {
                        gold: 20,
                        xpBonus: 1,
                        stars: 0,
                    },
                    type: 7,
                },
            },
        },
        step10option1: {
            name: 'Nora',
            message: 'ugh, finalmente...',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Nora',
                quest: {
                    mission: 'Participa en un drop',
                    description: 'Nora quiere que recojas un regalo que cae del cielo',
                    goal: 1,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: ['Nora/giftDropTutorialCompleted'],
                    },
                    rewards: {
                        gold: 20,
                        xpBonus: 1,
                        stars: 0,
                    },
                    type: 7,
                },
            },
        },
    },
};