# Dialogs

Each file has to be in a object format
Example from shop.js

```js
module.exports = {
  dialog: {
    name: "shopCmd",
    embedColor: "#C600FF",
    step1: {
      name: "Nora",
      message: "Hola **{displayName}**, espero vengas a comprar algo.",
      options: {
        option1: {
          text: "Ver tienda",
          emoji: "🛒",
        },
      },
    },
    step2option1: {
      name: "Nora",
      message: "Esto es lo que tengo actualmente",
      specialFunction: {
        name: "openShop",
      },
    },
  },
};
```

The dialog name is the one who will be picked up by the dialog handler
The embedColor is the color of the embed
Each message can have a name, a message, options, and a different color than the embedColor (if you want to)

The name will be displayed as the title of the embed
And the message as the description of the embed

Each dialog can also have a "ephemeral" property, which will put the entire dialog in a ephemeral message.

### Warning
The button text can only have 80 characters, if you go over that, the bot will not send the message.
Since the the option text is the button text, you have to keep that in mind.

## Special Functions

A dialog message can have a special function, this is a function that will be executed when the user clicks on the option

### openShop Special Function

This calls the shopHandler and opens the shop
The function returns an embed which is sent to the user, this is the shop.
Then the dialog message is sent afterwards.

### continueDialogInAnotherChannel Special Function

```js
specialFunction: {
    name: 'continueDialogInAnotherChannel',
    targetChannels: '1032013306631827546|1049703237336444968',
},
```

The targetChannels property can have only two channels, separated by a pipe (|) character.
Because the event will be done in more than one server, the bot will have to know which channel to send the message to.
The bot will get the first channel, if it doesn't have access, it will get the second one.
Meaning the user is in server which the second channel is.

It then will send the dialog message to that channel and ping the user.

### giveQuest Special Function

```js
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

```

This function will give the user a quest, the questCharacter is the character who will give the quest.
So the quest is set on the Quests{Character} document on the database.
The quest object is the quest itself, it has a mission, description, goal, position, rewards, targetChannel, and type.
All of these will be explained in another documentation file.

### setActiveDialog Special Function

```js
specialFunction: {
    name: 'setActiveDialog',
    target: 'Nora/testDialog',
},

```

This will set the active dialog to be the target dialog, meaning the next time the user talks with the character it will use the new dialog.
The character is the one before the slash, and the dialog is the one after the slash.


## Dialog messages
```js
module.exports = {
    dialog: {
        name: 'postRegisterTutorial',
        embedColor: Colors.LyraColor,
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
            name: 'Lyra',
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
            name: 'Lyra',
            message: 'Asi me gusta',
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
                    position: 1,
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
```
This example from tutorial.js is a dialog that will be used when the user registers.
I will explain here how to use the steps and dialogs for future reference.

The dialog always have to have the step1 property with nothing else, just "step1".
The way the bot handles the dialogs is by the step number, so the step1 will be the first message, the step2 will be the second message, and so on.
The step property has to have a option1 added to it, this will tell the bot that this is the dialog message to send if that option is selected.

The options have to be in a options: {} object, and each option has to have a text and an emoji.