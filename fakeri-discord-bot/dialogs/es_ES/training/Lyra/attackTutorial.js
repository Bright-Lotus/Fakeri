const { Colors } = require('../../../../emums/colors');
const { Icons } = require('../../../../emums/icons');

module.exports = {
    dialog: {
        name: 'attackTutorial',
        embedColor: Colors.LyraColor,
        step1: {
            name: 'Lyra',
            message: 'Necessitas ayuda en tu mision.',
            options: {
                option1: {
                    text: 'Si',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Lyra',
            message: 'Mira bien, ves ese grupo de enemigos?',
            options: {
                option1: {
                    text: 'Si los veo',
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
            name: 'Lyra',
            message: 'Bueno, esos son los enemigos que tienes que derrotar!\nMe parecen perfectos para un debil como tu!',
            options: {
                option1: {
                    text: 'Escribe "attack" en este canal y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step4option1: {
            name: 'Lyra',
            message: 'Que esperas?!\nElige el que quieras atacar y atacalo!',
            options: {
                option1: {
                    text: 'Elige un enemigo del menu y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step5option1: {
            name: 'Lyra',
            message: 'Ahora es tu momento!\nProcura no morir!',
            options: {
                option1: {
                    text: 'Usa el comando "attack" de nuevo y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step6option1: {
            name: 'Lyra',
            message: 'Golpealo con todas tus fuerzas!\nAunque sean pocas',
            options: {
                option1: {
                    text: 'Selecciona el enemigo del menu de batallas activas y presiona este boton',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step7option1: {
            name: 'Lyra',
            message: 'Huh, golpe bueno para alguien como tu!\nAsi es como debes atacar\nSigue atacando de esa manera hasta que ese tonto enemigo muera!\nTambien puedes usar consumibles, solo usa "item", compra unos en la tienda si quieres.',
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Lyra/missionInProgress',
            },
        },
    },
};