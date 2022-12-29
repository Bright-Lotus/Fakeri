const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { EventErrors, ErrorEmbed } = require('../errors/errors.js');
const { dialogHandler } = require('../handlers/dialogHandler.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.customId.includes('dialog')) return;
        if (interaction.user.id != interaction.customId.split('-')[5]) {
            return interaction.reply({ embeds: [ErrorEmbed(EventErrors.NotOwnerOfDialog)], ephemeral: true });
        }
        const dialogDetails = interaction.customId.split('-');
        const dialogName = dialogDetails[1];
        const dialogStep = dialogDetails[2];
        const optionChoosen = dialogDetails[3];
        const category = dialogDetails[4];
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('selected')
                    .setLabel(interaction.component.label)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('➡️')
                    .setDisabled(true),
            );
        await interaction.update({ components: [ row ] });
        console.log(dialogStep.match(/\d+/g), (Number(dialogStep.charAt(4)) + 1), 'dialogdebug');
        dialogHandler(dialogName, (Number(dialogStep.match(/\d+/g)[0]) + 1), interaction, optionChoosen.charAt(6), category);
    },
};