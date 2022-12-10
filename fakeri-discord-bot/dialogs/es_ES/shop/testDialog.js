module.exports = {
    dialog: {
        name: 'testDialog',
        embedColor: '#C600FF',
        step1: {
            name: 'Nora',
            message: 'Welcome be your majesty',
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: '🛒',
                },
            },
        },
        step2option1: {
            name: 'Nora',
            message: 'Esto es lo que tengo actualmente',
            specialFunction: {
                name: 'giveQuest',
                questCharacter: 'Nora',
                quest: {
                    mission: 'Envia mensajes en #general',
                    description: 'Conoce al pueblo',
                    goal: 100,
                    position: 1,
                    rewards: {
                        gold: 100,
                        xpBonus: 1,
                    },
                    targetChannel: '1032013306631827600',
                    type: 1,
                },
            },
        },
    },
};