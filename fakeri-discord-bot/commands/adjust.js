const { SlashCommandBuilder, TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adjust')
        .setDescription('Ajusta las stats de un item')
        .addStringOption(option => option.setName('category').setDescription('Categoria del item')
            .addChoices(
                { name: 'Espadas', value: 'swords' },
                { name: 'Arcos', value: 'bows' },
                { name: 'Armaduras', value: 'armorPlates' },
                { name: 'Varitas', value: 'wands' },
                { name: 'Orbes', value: 'abilityOrbs' },
            ).setRequired(true))
        .addStringOption(option => option.setName('ajuste').setDescription('Ajuste a ser aplicado al item')
            .addChoices(
                { name: 'Buffear', value: 'buff' },
                { name: 'Nerfear', value: 'nerf' },
            ).setRequired(true))
        .addStringOption(option => option.setName('nombre').setDescription('Nombre del item')
            .setRequired(true)),
    async execute(interaction) {
        adjust(interaction);
    },
};

function adjust(interaction) {
    const modal = new ModalBuilder()
        .setCustomId(`adjust-item-${interaction.options.getString('category')}-${interaction.options.getString('nombre')}-${interaction.options.getString('ajuste')}`)
        .setTitle(`Ajustando Item: ${interaction.options.getString('nombre')}`);

    const message = new TextInputBuilder();

    switch (interaction.options.getString('category')) {
        case 'swords': {
            message.setCustomId('adjustValues')
                .setLabel(interaction.options.getString('ajuste').toUpperCase())
                .setRequired(true)
                .setPlaceholder('atk: Adjust by Amount, spd: Adjust by Amount')
                .setStyle(TextInputStyle.Short);
            break;
        }
    }

    const row = new ActionRowBuilder().addComponents(message);
    modal.addComponents(row);
    interaction.showModal(modal);
}