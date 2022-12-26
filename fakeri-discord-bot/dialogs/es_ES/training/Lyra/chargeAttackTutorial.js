const { formatEmoji } = require('discord.js');
const { Colors } = require('../../../../emums/colors');
const { Icons } = require('../../../../emums/icons');

module.exports = {
    dialog: {
        name: 'chargeAttackTutorial',
        embedColor: Colors.LyraColor,
        step1: {
            name: 'Lyra',
            message: 'Estas aprendiendo bien, veo que si eres fuerte',
            options: {
                option1: {
                    text: 'Te lo dije!',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Lyra',
            message: 'Te voy a enseñar un ataque especial, bueno, mas bien, como hacer un ataque mas potente',
            options: {
                option1: {
                    text: 'Vamos!',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step3option1: {
            name: 'Lyra',
            message: 'Para hacer un ataque mas potente, debes cargarlo\nLa piedra te ha dado el poder de obtener mas fuerza',
            options: {
                option1: {
                    text: 'Escribe "charge" y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'continueDialogInAnotherChannel',
                // TODO: Set this channels to farm channel lvl 1
                targetChannels: '1056673122373353595|1056701598258176060',
            },
        },
        step4option1: {
            name: 'Lyra',
            message: 'Decide a quien atacar!',
            options: {
                option1: {
                    text: 'Elige un enemigo del menu y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step5option1: {
            name: 'Lyra',
            message: 'Te sientes mas fuerte?!\nAhora es el momento de atacar!',
            options: {
                option1: {
                    text: '"attack", selecciona a un enemigo y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step6option1: {
            name: 'Lyra',
            message: `Si te fijaste bien? El ataque fue mas poderoso\n\n***Un ataque cargado estara represantado por el emoji ${formatEmoji(Icons.BuffedAtk)}***`,
            options: {
                option1: {
                    text: 'Si, lo note',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step7option1: {
            name: 'Lyra',
            message: 'Sigue practicando, ah, y tal vez deberias hablar con Nora si no has hablado con ella todavia',
            options: {
                option1: {
                    text: 'Bueno',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Lyra/missionInProgress',
            },
        },
        step8option1: {
            name: 'Lyra',
            message: '...',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Lyra',
                quest: {
                    mission: 'Asesina monstruos',
                    description: 'Continua entrenando',
                    goal: 7,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: [ 'Lyra/chargeAttackTutorial' ],
                    },
                    rewards: {
                        gold: 50,
                        xpBonus: 1,
                        stars: 1,
                    },
                    type: 8,
                },
            },
        },
    },
};