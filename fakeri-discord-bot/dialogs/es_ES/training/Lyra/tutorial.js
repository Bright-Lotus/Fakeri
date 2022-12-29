const { chatInputApplicationCommandMention } = require('discord.js');
const { Colors } = require('../../../../emums/colors');
const { CommandIds } = require('../../../../emums/commandIds');
const { Icons } = require('../../../../emums/icons');

module.exports = {
    dialog: {
        name: 'postRegisterTutorial',
        embedColor: Colors.LyraColor,
        step1: {
            name: 'Lyra',
            message: '¿Quien eres?',
            options: {
                option1: {
                    text: '{displayName}',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step2option1: {
            name: 'Lyra',
            message: '¿Y que vienes a hacer aqui?',
            options: {
                option1: {
                    text: 'Vengo a aprender',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step3option1: {
            name: 'Lyra',
            message: 'No puedo enseñarle a un debil como tu',
            options: {
                option1: {
                    text: '¡No soy debil!',
                    emoji: Icons.SpeakBtn,
                },
                option2: {
                    text: 'Te puedo demostrar que no soy debil',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option1: {
            name: 'Lyra',
            message: 'No te creo\nClaramente lo eres...\nDemuestrame lo contrario',
            options: {
                option1: {
                    text: '¡Lo hare!',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step4option2: {
            name: 'Lyra',
            message: `Esta bien, demuestramelo.\nSi necesitas ayuda, habla conmigo de nuevo\n\n***Usa ${chatInputApplicationCommandMention('training', CommandIds.Training)} para hablar con Lyra de nuevo***`,
            options: {
                option1: {
                    text: 'Esta bien',
                    emoji: Icons.AcceptQuest,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Lyra/attackHelpDialog',
            },
        },
        step5option1: {
            name: 'Lyra',
            message: 'El dialogo ha terminado',
            msgColor: '#FF0000',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Lyra',
                quest: {
                    mission: 'Asesina monstruos',
                    description: 'Prueba tu poder',
                    goal: 3,
                    position: 0,
                    onComplete: {
                        function: 'setActiveDialog',
                        targets: ['Lyra/eliteEnemies'],
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