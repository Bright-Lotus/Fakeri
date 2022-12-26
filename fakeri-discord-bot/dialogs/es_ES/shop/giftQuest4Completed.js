const { Colors } = require('../../../emums/colors');
const { Icons } = require('../../../emums/icons');

module.exports = {
    dialog: {
        name: 'giftQuest4Completed',
        embedColor: Colors.NoraColor,
        step1: {
            name: 'Nora',
            message: '\\*tarareo\\*',
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: '🛒',
                },
                option2: {
                    text: 'Algo nuevo acerca de los regalos?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Nora',
            message: '\\*Tarareo continua\\*',
            specialFunction: {
                name: 'openShop',
            },
        },
        step3option2: {
            name: 'Nora',
            message: 'Si, tengo algo nuevo',
            options: {
                option1: {
                    text: 'Que es?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option1: {
            name: 'Nora',
            message: 'El acontecimiento...\nEs algo terrible, ameneza con destruir el pueblo\nTodo Aelram',
            options: {
                option1: {
                    text: 'QUE?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step5option1: {
            name: 'Nora',
            message: 'Si, es terrible\nEl regalo no quiere decir mas!!\nPor ahora solo sabemos eso del acontecimiento\nDeberemos estar preparado',
            options: {
                option1: {
                    text: 'Destruir todo dices...',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step6option1: {
            name: 'Nora',
            message: 'Uhhh no todo...\nCreo que solo el pueblo\nPero se justo como volvernos para poderosos',
            options: {
                option1: {
                    text: '...Esta relacionado con los regalos verdad?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step7option1: {
            name: 'Nora',
            message: 'Asi es, he estado estudiando su contenido\nEs una sustancia que te hace mas poderoso\nAfortunadamente...',
            options: {
                option1: {
                    text: 'Afortunadamente?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step8option1: {
            name: 'Nora',
            message: 'Logre crear un catalizador de esta sustancia\nHace que puedas absorber mas!\nLas misiones **{displayName**}...',
            options: {
                option1: {
                    text: 'Si me suenan',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step9option1: {
            name: 'Nora',
            message: 'Con las misiones te dare de este catalizador',
            options: {
                option1: {
                    text: 'Ugh, no me las puedes dar gratis?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step10option1: {
            name: 'Nora',
            message: 'No, no puedo\nNecesito GANANCIAS!',
            options: {
                option1: {
                    text: 'Esta bien, esta bien, necesitas algo de mi?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step11option1: {
            name: 'Nora',
            message: 'Creo que...\nYa extraje la mayor info de los regalos..\nPero quiero mas, traeme una muestra para ver si aun se puede sacar mas',
            options: {
                option1: {
                    text: 'Bueno...',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Nora/default',
            },
        },
        step12option1: {
            name: 'Nora',
            message: '...',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Nora',
                quest: {
                    mission: 'Participa en un drop',
                    description: 'Participa en un drop para conseguir una muestra de regalo',
                    goal: 1,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: [ 'Nora/default' ],
                    },
                    rewards: {
                        gold: 60,
                        xpBonus: 1,
                        stars: 0,
                    },
                    type: 7,
                },
            },
        },
    },
};