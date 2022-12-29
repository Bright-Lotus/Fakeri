const { Colors } = require('../../../../emums/colors');
const { Icons } = require('../../../../emums/icons');

module.exports = {
    dialog: {
        name: 'noMission',
        embedColor: Colors.AbeColor,
        step1: {
            name: 'Abe',
            message: 'Es hora de que aprendas algo nuevo...',
            options: {
                option1: {
                    text: 'Que cosa',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Abe',
            message: 'Los enemigos elite\nEnemigos poseidos por la magia de la oscuridad',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
        },
        step3option1: {
            name: 'Abe',
            message: 'La magia esa los hace mutar, haciendolos mas fuertes en una area especifica',
            options: {
                option1: {
                    text: 'Entiendo',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option1: {
            name: 'Abe',
            message: 'Nora ha tratado de estudiarlos sin exito...\nPor ahora solo sabemos que cada tanto tienen un ataque mejorado que inflige mas daño',
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
        step5option1: {
            name: 'Abe',
            message: 'Estos tambien tienen alta cantidad de recompensas...\nTe dejo una nueva mision, tambien habla con Nora, dijo que queria hablar contigo',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.AcceptQuest,
                },
            },
        },
        step6option1: {
            name: 'Abe',
            message: 'Abe se ha ido',
            msgColor: '#FF0000',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Abe',
                quest: {
                    mission: 'Asesina monstruos',
                    description: 'Abe quiere que entrenes',
                    goal: 15,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: ['Abe/noMission'],
                    },
                    rewards: {
                        gold: 100,
                        xpBonus: 1,
                        stars: 0,
                    },
                    type: 8,
                },
            },
        },
    },
};