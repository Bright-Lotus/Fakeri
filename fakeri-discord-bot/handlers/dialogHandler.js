const fs = require('node:fs');
const path = require('node:path');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, userMention, bold } = require('discord.js');
const { execute } = require('./shopHandler');
const { updateDoc, doc, setDoc } = require('firebase/firestore');

const { getFirestore } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function dialogHandler(dialogName, step, interaction, option, category, args) {
    const dialogPath = path.join(__dirname, '..', 'dialogs', 'es_ES', category);
    const dialogFiles = fs.readdirSync(dialogPath).filter(file => file.endsWith('.js'));

    for (const file of dialogFiles) {
        const filePath = path.join(dialogPath, file);
        const dialog = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        const row = new ActionRowBuilder();

        if (dialog?.dialog?.name == dialogName) {
            console.log(`Executing dialog ${dialogName} with step ${step}`);

            const dialogEmbed = new EmbedBuilder();
            if (step == 1) {
                let embedMessage = dialog.dialog.step1.message;
                let displayName = interaction.member.displayName;
                if (interaction.user.id == '407225705051455491') {
                    displayName = 'Ashe';
                }
                if (embedMessage.includes('{displayName}')) {
                    embedMessage = embedMessage.replace('{displayName}', displayName);
                }
                dialogEmbed
                    .setTitle(dialog.dialog.step1.name)
                    .setDescription(embedMessage)
                    .setColor(dialog.dialog.embedColor);

                if (dialog?.dialog[ `step${step}` ]?.options) {
                    for (const [ key, value ] of Object.entries(dialog.dialog[ `step${step}` ].options)) {
                        if (value.text.includes('{displayName}')) {
                            value.text = value.text.replace('{displayName}', displayName);
                        }
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`dialog-${dialog.dialog.name}-step${step}-${key}-${category}-${interaction.user.id}`)
                                .setLabel(value.text)
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji(value.emoji),
                        );
                    }
                }

                if (dialog?.dialog[ `step${step}` ]?.options) {
                    if (args?.replied) {
                        return interaction.followUp({ embeds: [ dialogEmbed ], components: [ row ], ephemeral: dialog.dialog?.ephemeral || false });
                    }
                    return interaction.reply({ embeds: [ dialogEmbed ], components: [ row ], ephemeral: dialog.dialog?.ephemeral || false });
                }
                else {
                    if (args?.replied) {
                        return interaction.followUp({ embeds: [ dialogEmbed ], ephemeral: dialog.dialog?.ephemeral || false });
                    }
                    return interaction.reply({ embeds: [ dialogEmbed ], ephemeral: dialog.dialog?.ephemeral || false });
                }
            }
            else {
                let embedMessage = dialog.dialog[ `step${step}option${option}` ].message;
                if (embedMessage.includes('{displayName}')) {
                    embedMessage = embedMessage.replace('{displayName}', interaction.member.displayName);
                }
                dialogEmbed
                    .setTitle(dialog.dialog[ `step${step}option${option}` ].name)
                    .setDescription(dialog.dialog[ `step${step}option${option}` ].message)
                    .setColor(dialog.dialog.embedColor);

                if (dialog?.dialog[ `step${step}option${option}` ]?.options) {
                    for (const [ key, value ] of Object.entries(dialog.dialog[ `step${step}option${option}` ].options)) {
                        if (value.text.includes('{displayName}')) {
                            value.text = value.text.replace('{displayName}', interaction.member.displayName);
                        }
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`dialog-${dialog.dialog.name}-step${step}-${key}-${category}-${interaction.user.id}`)
                                .setLabel(value.text)
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji(value.emoji),
                        );
                    }
                }

                if (dialog?.dialog[ `step${step}option${option}` ]?.msgColor) {
                    dialogEmbed.setColor(dialog?.dialog[ `step${step}option${option}` ]?.msgColor);
                }


                if (dialog?.dialog[ `step${step}option${option}` ]?.options) {
                    switch (dialog?.dialog[ `step${step}option${option}` ]?.specialFunction?.name) {
                        case 'openShop': {
                            const shopMessage = await execute('open', interaction, 1, []);
                            interaction.channel.send(shopMessage);
                            if (dialog.dialog?.ephemeral) {
                                if (interaction?.deferred || interaction?.replied) { return interaction.followUp({ embeds: [ dialogEmbed ], components: [ row ], ephemeral: true }); }
                                else { return interaction.reply({ embeds: [ dialogEmbed ], components: [ row ], ephemeral: true }); }
                            }
                            else {
                                return interaction.channel.send({ embeds: [ dialogEmbed ], components: [ row ] });
                            }
                        }
                        case 'continueDialogInAnotherChannel': {
                            const targetChannels = dialog?.dialog[ `step${step}option${option}` ]?.specialFunction.targetChannels.split('|');
                            targetChannels.forEach(channelID => {
                                interaction.guild.channels.fetch(channelID)
                                    .then((channel) => {
                                        return channel.send({ content: userMention(interaction.user.id), embeds: [ dialogEmbed ], components: [ row ] });
                                    })
                                    .catch(() => console.log('Access denied'));
                            });
                            break;
                        }
                        case 'setActiveDialog': {
                            const target = dialog?.dialog[ `step${step}option${option}` ]?.specialFunction?.target;
                            const [ targetCharacter, targetDialog ] = [ target.split('/')[ 0 ], target.split('/')[ 1 ] ];
                            await updateDoc(doc(db, interaction.user.id, 'EventDialogProgression'), {
                                [ `${targetCharacter}.activeDialog` ]: targetDialog,
                            }, { merge: true });
                            if (dialog.dialog?.ephemeral) {
                                if (interaction?.deferred || interaction?.replied) { return interaction.followUp({ embeds: [ dialogEmbed ], components: [ row ], ephemeral: true }); }
                                else { return interaction.reply({ embeds: [ dialogEmbed ], components: [ row ], ephemeral: true }); }
                            }
                            else {
                                return interaction.channel.send({ embeds: [ dialogEmbed ], components: [ row ] });
                            }
                        }
                        case 'giveQuest': {
                            const targetQuest = dialog?.dialog[ `step${step}option${option}` ]?.specialFunction?.quest;
                            const targetCharacterQuest = dialog?.dialog[ `step${step}option${option}` ]?.specialFunction?.questCharacter;
                            const questEmbed = new EmbedBuilder()
                                .setTitle(`${targetCharacterQuest} te ha dado una nueva mision!`)
                                .setColor(dialog.dialog.embedColor)
                                .setDescription(bold(targetQuest.mission));
                            await setDoc(doc(db, `${interaction.user.id}/Quests${targetCharacterQuest}`), {
                                [ `quest${targetQuest.position}` ]: targetQuest,
                            });
                            await setDoc(doc(db, `${interaction.user.id}/EventQuestProgression/Weekly/${targetCharacterQuest}`), {
                                [ `mission${targetQuest.position}` ]: 0,
                            });
                            if (dialog.dialog?.ephemeral) {
                                if (interaction?.deferred || interaction?.replied) { return interaction.followUp({ embeds: [ dialogEmbed, questEmbed ], components: [ row ], ephemeral: true }); }
                                else { return interaction.reply({ embeds: [ dialogEmbed ], components: [ row ], ephemeral: true }); }
                            }
                            else {
                                return interaction.channel.send({ embeds: [ dialogEmbed, questEmbed ], components: [ row ] });
                            }
                        }
                        default:
                            if (dialog.dialog?.ephemeral) {
                                if (interaction?.deferred || interaction?.replied) { return interaction.followUp({ embeds: [ dialogEmbed ], components: [ row ], ephemeral: true }); }
                                else { return interaction.reply({ embeds: [ dialogEmbed ], components: [ row ], ephemeral: true }); }
                            }
                            else {
                                return interaction.channel.send({ embeds: [ dialogEmbed ], components: [ row ] });
                            }
                    }
                }
                // TODO: Figure out if this is needed
                else {
                    switch (dialog?.dialog[ `step${step}option${option}` ]?.specialFunction.name) {
                        case 'openShop': {
                            const shopMessage = await execute('open', interaction, 1, []);
                            interaction.channel.send(shopMessage);
                            return interaction.channel.send({ embeds: [ dialogEmbed ], ephemeral: dialog.dialog?.ephemeral || false });
                        }
                        case 'continueDialogInAnotherChannel': {
                            const targetChannels = dialog?.dialog[ `step${step}option${option}` ]?.specialFunction.targetChannels.split('|');
                            targetChannels.forEach(channelID => {
                                interaction.guild.channels.fetch(channelID)
                                    .then((channel) => {
                                        if (dialog.dialog?.ephemeral) {
                                            if (interaction?.deferred || interaction?.replied) { return interaction.followUp({ embeds: [ dialogEmbed ], ephemeral: true }); }
                                            else { return interaction.reply({ embeds: [ dialogEmbed ], ephemeral: true }); }
                                        }
                                        else { return channel.send({ content: userMention(interaction.user.id), embeds: [ dialogEmbed ] }); }
                                    })
                                    .catch(() => console.log('Access denied'));
                            });
                            break;
                        }
                        case 'setActiveDialog': {
                            const target = dialog?.dialog[ `step${step}option${option}` ]?.specialFunction?.target;
                            const [ targetCharacter, targetDialog ] = [ target.split('/')[ 0 ], target.split('/')[ 1 ] ];
                            await updateDoc(doc(db, interaction.user.id, 'EventDialogProgression'), { [ `${targetCharacter}.activeDialog` ]: targetDialog }, { merge: true });
                            if (dialog.dialog?.ephemeral) {
                                if (interaction?.deferred || interaction?.replied) { return interaction.followUp({ embeds: [ dialogEmbed ], ephemeral: true }); }
                                else { return interaction.reply({ embeds: [ dialogEmbed ], ephemeral: true }); }
                            }
                            else { return interaction.channel.send({ embeds: [ dialogEmbed ] }); }
                        }
                        case 'giveQuest': {
                            const targetQuest = dialog?.dialog[ `step${step}option${option}` ]?.specialFunction?.quest;
                            const targetCharacterQuest = dialog?.dialog[ `step${step}option${option}` ]?.specialFunction?.questCharacter;
                            const questEmbed = new EmbedBuilder()
                                .setTitle(`${targetCharacterQuest} te ha dado una nueva mision!`)
                                .setColor(dialog.dialog.embedColor)
                                .setDescription(bold(targetQuest.mission));
                            await setDoc(doc(db, `${interaction.user.id}/Quests${targetCharacterQuest}`), {
                                [ `quest${targetQuest.position}` ]: targetQuest,
                            });
                            await setDoc(doc(db, `${interaction.user.id}/EventQuestProgression/Weekly/${targetCharacterQuest}`), {
                                [ `mission${targetQuest.position}` ]: 0,
                            });
                            if (dialog.dialog?.ephemeral) {
                                if (interaction?.deferred || interaction?.replied) { return interaction.followUp({ embeds: [ dialogEmbed, questEmbed ], ephemeral: true }); }
                                else { return interaction.reply({ embeds: [ dialogEmbed ], ephemeral: true }); }
                            }
                            else {
                                return interaction.channel.send({ embeds: [ dialogEmbed, questEmbed ] });
                            }
                        }
                    }
                    if (dialog.dialog?.ephemeral) {
                        if (interaction?.deferred || interaction?.replied) { return interaction.followUp({ embeds: [ dialogEmbed ], ephemeral: true }); }
                        else { return interaction.reply({ embeds: [ dialogEmbed ], ephemeral: true }); }
                    }
                    else { return interaction.channel.send({ embeds: [ dialogEmbed ] }); }
                }
            }

        }
        else {
            console.log(`[WARNING] The dialog at ${filePath} doesn't match the required dialog name\nREQUIRED: ${dialogName}\nFOUND: ${dialog?.dialog?.name}`);
        }
    }
}

module.exports = { dialogHandler };