const { Colors } = require('../../../../emums/colors');
const { Icons } = require('../../../../emums/icons');

module.exports = {
    dialog: {
        name: 'eliteEnemies',
        embedColor: Colors.LyraColor,
        step1: {
            name: 'Lyra',
            message: 'Huh?\nAl final no eres tan debil como creia\nSi veo algo de potencial en ti\nSigueme...',
            options: {
                option1: {
                    text: 'Seguirla',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'continueDialogInAnotherChannel',
                // TODO: Set this channels to farm channel lvl 1
                targetChannels: '1056673122373353595|1056701598258176060',
            },
        },
        step2option1: {
            name: 'Lyra',
            message: 'De ahora en adelante\nSere yo tu instructora\nAprovechando que ya sabes atacar, te enseñare algo mas.',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
        },
        step3option1: {
            name: 'Lyra',
            message: 'Los enemigos que te encuentres en tu mision\nSon enemigos normales\nPero hay una especie...',
            options: {
                option1: {
                    text: 'Que especie?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option1: {
            name: 'Lyra',
            message: 'Los enemigos Elite.\nSon enemigos que no conocemos a gran detalle\nSolo sabemos que sufren una especie de mutacion.',
            options: {
                option1: {
                    text: 'Una mutacion?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step5option1: {
            name: 'Lyra',
            message: 'Si, una mutacion.\nNo sabemos la fuente, tenemos la sospecha que cierta magia podria estar involucrada.',
            options: {
                option1: {
                    text: 'Magia?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step6option1: {
            name: 'Lyra',
            message: 'Si, magia.\nLa magia es abundante en este mundo\nEl caso es que estos enemigos mejoran una area de su cuerpo.\nSiempre es aleatoria.',
            options: {
                option1: {
                    text: 'Y son peligrosos?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step7option1: {
            name: 'Lyra',
            message: 'Si, son peligrosos.\nPorque son mas fuertes que los enemigos normales.\nPERO, mi parte favorita, son los mas jugosos, los que mas recompensas dan.',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Nora/postEliteTutorial',
            },
        },
        step8option1: {
            name: 'Lyra',
            message: 'Pero no te preocupes, no son tan dificiles de derrotar.\nSolo debes tener cuidado con sus ataques especiales, los cuales todavia no sabemos como funcionan.',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Lyra/missionInProgress',
            },
        },
        step9option1: {
            name: 'Lyra',
            message: 'Ahora que ya sabes todo esto\nSolo sigue entrenando por ahora.\nCuando estes listo, te enseñare mas cosas',
            msgColor: '#FF0000',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Lyra',
                quest: {
                    mission: 'Asesina monstruos',
                    description: 'Entrena',
                    goal: 7,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: ['Lyra/chargeAttackTutorial'],
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