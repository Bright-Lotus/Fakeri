const { Colors } = require('../../../../emums/colors');
const { Icons } = require('../../../../emums/icons');

module.exports = {
    dialog: {
        name: 'archerPerks',
        embedColor: Colors.ArissaColor,
        step1: {
            name: 'Arissa',
            message: '¡Creo que es hora de que te enseñe algo mas!',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
        },
        step2option1: {
            name: 'Arissa',
            message: 'Enseñarte a ser un arquero de verdad',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
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
            message: 'Cada zona tiene su propio nivel requerido de poder para estar en ella\nPero al ser un arquero, puedes usar tu especialidad para saltar zonas\n\n***Tu nivel de poder es simplemente tu nivel de jugador\nSolo puedes entrar a zonas hasta 5 niveles superiores a ti***',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
        },
        step4option1: {
            name: 'Arissa',
            message: 'Esta zona requiere nivel de poder 1, ¡Ven, vamos a la de nivel 5!',
            options: {
                option1: {
                    text: 'Ir',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step5option1: {
            name: 'Arissa',
            message: '¡Bien! No cambia nada el como atacas, pero siempre vas a tener un ataque de ventaja hasta que tu enemigo pueda atacarte',
            options: {
                option1: {
                    text: 'Me parece bien',
                    emoji: Icons.SpeakBtn,
                },
            },
            specialFunction: {
                name: 'continueDialogInAnotherChannel',
                // TODO: Set this channels to farm channel lvl 5
                targetChannels: '1056677411955159082|1056701778160267294',
            },
        },
        step6option1: {
            name: 'Arissa',
            message: '¡Aprovechando que estamos aqui! Puedes usar consumibles, son cosas o pociones que te pueden curar\nSolo usa "item" en cualquier zona de estas.',
            options: {
                option1: {
                    text: 'Entendido',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step7option1: {
            name: 'Arissa',
            message: 'Tambien quiero advertire de los enemigos Elite\nNo sabemos mucho de ellos',
            options: {
                option1: {
                    text: '¿Que son?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step8option1: {
            name: 'Arissa',
            message: '¡Monstruos! ¡Monstruos que han mutado gracias a una magia oscura!',
            options: {
                option1: {
                    text: '¿Que hacen?',
                    emoji: Icons.SpeakBtn,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Nora/postEliteTutorial',
            },
        },
        step9option1: {
            name: 'Arissa',
            message: '¡No sabemos! Solo sabemos que cada ciertos ataques hacen un ataque potenciado, ¡que hace mas daño!',
            options: {
                option1: {
                    text: 'Oh ya veo',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step10option1: {
            name: 'Arissa',
            message: 'Al menos... Dan mas recompensas\nTen cuidado con ellos, y tal vez deberias hablar con Nora.',
            options: {
                option1: {
                    text: 'Entendido',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step11option1: {
            name: 'Arissa',
            message: 'Arissa se ha ido',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Arissa',
                quest: {
                    mission: 'Asesina monstruos',
                    description: 'Continua entrenando',
                    goal: 15,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: [ 'Arissa/noMission' ],
                    },
                    rewards: {
                        gold: 100,
                        xpBonus: 1,
                        stars: 1,
                    },
                    type: 8,
                },
            },
        },
    },
};