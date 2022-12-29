const { Colors } = require('../../../../emums/colors');
const { Icons } = require('../../../../emums/icons');

module.exports = {
    dialog: {
        name: 'attackHelpDialog',
        embedColor: Colors.ArissaColor,
        step1: {
            name: 'Arissa',
            message: '¡Oh! ¿Necesitas mi ayuda?',
            options: {
                option1: {
                    text: 'Si',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Arissa',
            message: '¿Si estas viendo a esos enemigos verdad? ¡Ten cuidado!',
            options: {
                option1: {
                    text: 'Si',
                    emoji: Icons.SpeakBtn,
                },
            },
            specialFunction: {
                name: 'continueDialogInAnotherChannel',
                // TODO: Set this channels to farm channel lvl 1
                targetChannels: '1056673122373353595|1056701598258176060',
            },
        },
        step3option1: {
            name: 'Arissa',
            message: '¡Ese es tu objetivo cariño!',
            options: {
                option1: {
                    text: 'Entiendo',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option1: {
            name: 'Arissa',
            message: 'Enfrentate a uno, estare aqui.',
            options: {
                option1: {
                    text: 'Escribe "attack" en este canal y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step5option1: {
            name: 'Arissa',
            message: '¡Bien bien bien! ¡Decide a quien atacar y hazlo!',
            options: {
                option1: {
                    text: 'Elige un enemigo del menu y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step6option1: {
            name: 'Arissa',
            message: '¡Bien hecho! ¡Ahora es el momento de atacar!',
            options: {
                option1: {
                    text: '"attack", elige a un enemigo del menu de batallas activas y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step7option1: {
            name: 'Arissa',
            message: '¡Esplendido! ¡Asi es que debes de atacar siempre! ¡Sigue asi!',
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Arissa/missionInProgress',
            },
        },
    },
};