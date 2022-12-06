const fs = require('node:fs');
const path = require('node:path');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { execute } = require('./shopHandler');

async function dialogHandler(dialogName, step, interaction, option, category) {
    const dialogPath = path.join(__dirname, '..', 'dialogs', 'en_US', category);
    const dialogFiles = fs.readdirSync(dialogPath).filter(file => file.endsWith('.js'));

    for (const file of dialogFiles) {
        const filePath = path.join(dialogPath, file);
        const dialog = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        const row = new ActionRowBuilder();

        console.log(dialog.dialog);
        if (dialog?.dialog?.name == dialogName) {
            console.log('Executing dialog...');

            const dialogEmbed = new EmbedBuilder();
            if (step == 1) {
                dialogEmbed
                    .setTitle(dialog.dialog.step1.name)
                    .setDescription(dialog.dialog.step1.message)
                    .setColor(dialog.dialog.embedColor);

                if (dialog?.dialog[`step${step}`]?.options) {
                    for (const [key, value] of Object.entries(dialog.dialog[`step${step}`].options)) {
                        console.log(key);
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`dialog-${dialog.dialog.name}-step${step}-${key}-${category}-${interaction.user.id}`)
                                .setLabel(value.text)
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji(value.emoji),
                        );
                    }
                }

                if (dialog?.dialog[`step${step}`]?.options) {
                    return interaction.reply({ embeds: [dialogEmbed], components: [row] });
                }
                else {
                    return interaction.reply({ embeds: [dialogEmbed] });
                }
            }
            else {
                dialogEmbed
                    .setTitle(dialog.dialog[`step${step}option${option}`].name)
                    .setDescription(dialog.dialog[`step${step}option${option}`].message)
                    .setColor(dialog.dialog.embedColor);

                if (dialog?.dialog[`step${step}option${option}`]?.options) {
                    for (const [key, value] of Object.entries(dialog.dialog[`step${step}option${option}`].options)) {
                        console.log(value);
                        row.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`dialog-${dialog.dialog.name}-step${step}-${key}-${category}-${interaction.user.id}`)
                                .setLabel(value.text)
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji(value.emoji),
                        );
                    }
                }


                if (dialog?.dialog[`step${step}option${option}`]?.options) {
                    return interaction.channel.send({ embeds: [dialogEmbed], components: [row] });
                }
                else {
                    if (dialog?.dialog[`step${step}option${option}`]?.specialFunction?.openShop) {
                        console.log(dialogEmbed, 'log45');
                        const shopMessage = await execute('open', interaction, 1, []);
                        interaction.channel.send(shopMessage);
                        return interaction.channel.send({ embeds: [dialogEmbed] });
                    }
                    return interaction.channel.send({ embeds: [dialogEmbed] });
                }
            }

        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

module.exports = { dialogHandler };