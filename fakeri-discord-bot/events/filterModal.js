const { Events } = require('discord.js');
const { targetHandler } = require('../handlers/targetHandler.js');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId.includes('filterModal')) {
            const regex = new RegExp(`[${interaction.fields.getTextInputValue('userFilter')}]`, 'g');
            interaction.values = [interaction.customId];
            console.log('🚀 ~ file: filterModal.js:12 ~ execute ~ regex', interaction.values);
            await targetHandler(interaction, { filter: true, match: regex });
        }
    },
};