const { chatInputApplicationCommandMention } = require('discord.js');
const { Colors } = require('../../../emums/colors');
const { CommandIds } = require('../../../emums/commandIds');
const { Icons } = require('../../../emums/icons');

// IMPORTANT
// LABEL BUTTON TEXT CAN ONLY HAVE 80 CHARACTER MAX
module.exports = {
    dialog: {
        name: 'postRegisterTutorial',
        embedColor: 'Blue',
        ephemeral: true,
        step1: {
            name: 'Tu',
            message: 'La piedra del Destino te ha dado poderes\nTe sientes mas fuerte que antes',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
        },
        step2option1: {
            name: 'Tu',
            message: 'De repente se te avalanza encima un monstruo',
            options: {
                option1: {
                    text: 'Pelear',
                    emoji: Icons.Attack,
                },
            },
        },
        step3option1: {
            name: 'Tu',
            message: 'Tratas de pelearle al monstruo pero el monstruo es mucho mas fuerte que tu',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
        },
        step4option1: {
            name: 'Tu',
            message: 'De las sombras sale una especie de rayo laser purpura que aniquila al monstruo',
            options: {
                option1: {
                    text: 'Siguiente',
                    emoji: Icons.NextBtn,
                },
            },
        },
        step5option1: {
            name: '???',
            msgColor: Colors.NoraColor,
            message: 'Tenemos que salir de aqui rapidamente',
            options: {
                option1: {
                    text: 'Quien eres?',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step6option1: {
            name: '???',
            msgColor: Colors.NoraColor,
            message: 'No importa ahora mismo.\nSalgamos de aqui!',
            options: {
                option1: {
                    text: 'Seguir a la persona desconocida',
                    emoji: Icons.NextBtn,
                },
            },
        },
        step7option1: {
            name: '???',
            msgColor: Colors.NoraColor,
            message: 'Logramos salir.\nAhora dime que hacias ahi?',
            options: {
                option1: {
                    text: 'Queria ver de que trataba la tal piedra esa',
                    emoji: Icons.SpeakBtn,
                },
            },
            specialFunction: {
                name: 'continueDialogInAnotherChannel',
                targetChannels: '1056670330652995594|1056699289570656256',
            },
        },
        step8option1: {
            name: '???',
            msgColor: Colors.NoraColor,
            message: 'Esta bien, escucha:\nLa piedra te dio mejoras, y un camino\nYo te puedo dar herramientas para tu trabajo.',
            options: {
                option1: {
                    text: 'Pero me vas a decir quien eres?',
                    emoji: Icons.SpeakBtn,
                },
                option2: {
                    text: 'Entiendo',
                    emoji: Icons.SpeakBtn,
                },
            },
        },
        step9option1: {
            name: '???',
            msgColor: Colors.NoraColor,
            message: 'No, por ahora no es relevante.\nMira, esta es mi tienda, te vendere algo para que empieces en tu camino ',
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: Icons.ShopBtn,
                },
            },
        },
        step9option2: {
            name: '???',
            msgColor: Colors.NoraColor,
            message: 'Esta es mi tienda, te vendere algo para que empieces en tu camino',
            options: {
                option1: {
                    text: 'Ver tienda',
                    emoji: Icons.ShopBtn,
                },
            },
            specialFunction: {
                name: 'setActiveDialog',
                target: 'Nora/default',
            },
        },
        step10option1: {
            name: '???',
            msgColor: Colors.NoraColor,
            message: `Mira algun item que puedas comprar y compralo!\nLos items de principiante son buenos para que empieces.\nPor ahora solo te digo eso, puedes usar ${chatInputApplicationCommandMention('training', CommandIds.Training)} para empezar de verdad tu camino.`,
            specialFunction: {
                name: 'openShop',
            },
        },
    },
};