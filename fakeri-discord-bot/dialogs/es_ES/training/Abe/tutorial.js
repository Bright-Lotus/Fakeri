const { chatInputApplicationCommandMention } = require('discord.js');
const { Colors } = require('../../../../emums/colors');
const { CommandIds } = require('../../../../emums/commandIds');
const { Icons } = require('../../../../emums/icons');

module.exports = {
    dialog: {
        name: 'postRegisterTutorial',
        embedColor: Colors.AbeColor,
        step1: {
            name: 'Abe',
            message: 'Te he estado esperando...',
            options: {
                option1: {
                    text: '¿A mi?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Abe',
            message: 'Se que quieres que te entrene',
            options: {
                option1: {
                    text: 'Como sabes',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step3option1: {
            name: 'Abe',
            message: 'No preguntes\nPero primero quiero ver tu poder',
            options: {
                option1: {
                    text: 'Pero...',
                    emoji: Icons.SpeakBtn,
                },
                option2: {
                    text: 'Entiendo',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option1: {
            name: 'Abe',
            message: 'Sin peros\nQuiero que hagas exactamente lo que te digo',
            options: {
                option1: {
                    text: 'Comprendo',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Abe/attackHelpDialog',
            },
        },
        step4option2: {
            name: 'Abe',
            message: `Asi me gusta\n\n***Usa ${chatInputApplicationCommandMention('training', CommandIds.Training)} para hablar con Abe de nuevo***`,
            options: {
                option1: {
                    text: 'Ya mismo',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Abe/attackHelpDialog',
            },
        },
        step5option1: {
            name: 'Abe',
            message: 'El dialogo ha terminado',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Abe',
                quest: {
                    mission: 'Asesina monstruos',
                    description: 'Demuestra tu poder',
                    goal: 3,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: ['Abe/eliteEnemies'],
                    },
                    rewards: {
                        gold: 10,
                        xpBonus: 1,
                    },
                    type: 8,
                },
            },
        },
    },
};