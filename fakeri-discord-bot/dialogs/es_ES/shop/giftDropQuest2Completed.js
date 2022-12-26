const { Colors } = require('../../../emums/colors');
const { Icons } = require('../../../emums/icons');

module.exports = {
    dialog: {
        name: 'giftDropQuest2Completed',
        embedColor: Colors.NoraColor,
        step1: {
            name: 'Nora',
            message: 'Hmm, si si... interesante...',
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: Icons.ShopBtn,
                },
                option2: {
                    text: 'Como va el analisis',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Nora',
            message: 'Oh, no te vi llegar',
            specialFunction: {
                name: 'openShop',
            },
        },
        step2option2: {
            name: 'Nora',
            message: 'Dificil, es algo muy raro, dificil de estudiar',
            options: {
                option1: {
                    text: 'Dejame adivinar, necesitas mas muestras',
                    emoji: '🛒',
                },
            },
        },
        step3option1: {
            name: 'Nora',
            message: 'Si, necesito mas muestras.\nTodas las muestras... decaen o algo, se vuelven inestables y se destruyen',
            options: {
                option1: {
                    text: 'Dime que llevas hasta ahora? Estamos llegando a algun lado?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option1: {
            name: 'Nora',
            message: 'Si, si, he estado trabajando en ello.\nEl origen del regalo.\nParece ser de otra dimension, una especie de plano astral',
            options: {
                option1: {
                    text: 'Es todo lo que llevas?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step5option1: {
            name: 'Nora',
            message: 'Ya te dije que es dificil de estudiar!!! Es todo lo que puedo decirte por ahora',
            options: {
                option1: {
                    text: '...Bueno, esta bien, traeme mas muestras',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Nora/default',
            },
        },
        step6option1: {
            name: 'Nora',
            message: 'Bien, bien. Nos entendemos',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Nora',
                quest: {
                    mission: 'Participa en mas drops',
                    description: 'Estaremos llegando a alguna conclusion?',
                    goal: 2,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: ['Nora/evilHint'],
                    },
                    rewards: {
                        gold: 50,
                        xpBonus: 1,
                        stars: 0,
                    },
                    type: 7,
                },
            },
        },
    },
};