const { Colors } = require('../../../../emums/colors');
const { Icons } = require('../../../../emums/icons');

module.exports = {
    dialog: {
        name: 'postRegisterTutorial',
        embedColor: Colors.ArissaColor,
        step1: {
            name: 'Arissa',
            message: 'Oh!\nUna nueva personita que quiere aprender de mi!\n ¿Cual es tu nombre?',
            options: {
                option1: {
                    text: '{displayName}',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Arissa',
            message: '¡Esplendido nombre!',
            options: {
                option1: {
                    text: 'Supongo que si',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step3option1: {
            name: 'Arissa',
            message: '¡Te voy a enseñar muy bien personita!',
            options: {
                option1: {
                    text: '¡Excelente!',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option1: {
            name: 'Arissa',
            message: '¿Podrias hacer algo por mi primero?\nMe gustaria ver tu nivel de poder primero!',
            options: {
                option1: {
                    text: 'Bueno',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option2: {
            name: 'Arissa',
            message: '¡¡Maravilloso!!',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Arissa/attackHelpDialog',
            },
        },
        step5option1: {
            name: 'Arissa',
            message: '¡¡¡Si necesitas ayuda solo ven a mi!!!',
            msgColor: '#FF0000',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Arissa',
                quest: {
                    mission: 'Asesina monstruos',
                    description: 'Prueba tu poder',
                    goal: 3,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: ['Arissa/archerPerks'],
                    },
                    rewards: {
                        gold: 20,
                        xpBonus: 1,
                        stars: 0,
                    },
                    type: 8,
                },
            },
        },
    },
};