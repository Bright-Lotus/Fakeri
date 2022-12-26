const { Colors } = require('../../../../emums/colors');
const { Icons } = require('../../../../emums/icons');

module.exports = {
    dialog: {
        name: 'attackHelpDialog',
        embedColor: Colors.AbeColor,
        step1: {
            name: 'Abe',
            message: 'Te encuentras en necesidad de profunda ayuda...',
            options: {
                option1: {
                    text: 'uhm...',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Abe',
            message: 'Lo puedo sentir en ti',
            options: {
                option1: {
                    text: 'Creo que si',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step3option1: {
            name: 'Abe',
            message: 'No tengas preocupaciones, te ayudare',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step4option1: {
            name: 'Abe',
            message: 'Aquellos enemigos que se encuentran por alla plagan estas areas\nLa tarea que posees es ponerlos a descansar eternamente',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
            specialFunction: {
                name: 'continueDialogInAnotherChannel',
                // TODO: Set this channels to farm channel lvl 1 enchanter thread
                targetChannels: '1056673122373353595|1056701598258176060',
            },
        },
        step4option2: {
            name: 'Abe',
            message: 'Las areas que pisas en estos momentos se encuentran llenas de mana\n\n***Tienes mas Mana PER ATTACK en este hilo, todos los canales tienen su respectivo hilo***',
            options: {
                option1: {
                    text: 'Si puedo sentirlo',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step5option1: {
            name: 'Abe',
            message: 'Ve, y empieza una batalla con ese monstruo\n\n',
            options: {
                option1: {
                    text: 'Escribe "attack" en este canal y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step6option1: {
            name: 'Abe',
            message: 'Que esperas?\nDecide a quien atacar y atacalo!',
            options: {
                option1: {
                    text: 'Elige un enemigo del menu y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step7option1: {
            name: 'Abe',
            message: 'Ahora, estas comprometido en esta batalla, debes de atacar.',
            options: {
                option1: {
                    text: '"attack", selecciona un enemigo del menu de batallas activas y presiona aqui',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step8option1: {
            name: 'Abe',
            message: 'Bien hecho mi estudiante, con cada ataque obtienes mana, despues puedes usar este mana para **Orbes de Habilidad**\nHablaremos de eso despues',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
        },
        step9option1: {
            name: 'Abe',
            message: 'Ahora, debes de atacar a ese enemigo de la misma manera que te enseñe hasta que este en descanso eterno\nPero debido a la naturaleza de tu clase, tus ataques se demoraran mas.',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
        },
        step10option1: {
            name: 'Abe',
            message: 'Para eso tienes **Orbes de Habilidad**\n',
            options: {
                option1: {
                    text: 'Usa "ability", selecciona una y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step11option1: {
            name: 'Abe',
            message: 'Bien, ahora que la orbe esta preparada para uso\nUsala contra un enemigo',
            options: {
                option1: {
                    text: 'Selecciona un enemigo del menu de batallas activas y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step12opion1: {
            name: 'Abe',
            message: 'Bien, ya aprendiste todo, sigue asi.',
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Abe/missionInProgress',
            },
        },
    },
};