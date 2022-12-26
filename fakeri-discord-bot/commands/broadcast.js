const { SlashCommandBuilder, TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('broadcast')
        .setDescription('Publica una noticia en el periodico!')
        .addStringOption(option => option.setName('periodico').setDescription('El Observador | El Mega Observador | UFOLogy')
        .setRequired(true)
            .addChoices(
                { name: 'El Observador', value: 'El Observador' },
                { name: 'El Mega Observador', value: 'El Mega Observador' },
                { name: 'UFOLogy', value: 'UFOLogy' },
                { name: 'Todos', value: 'everyone' },
            )),
    async execute(interaction) {
        broadcast(interaction);
    },
};

function broadcast(interaction) {
    const modal = new ModalBuilder()
        .setCustomId(`broadcast-${interaction.options.getString('periodico')}`)
        .setTitle(`Publicando en ${interaction.options.getString('periodico')}`);

    const message = new TextInputBuilder()
        .setCustomId('broadcastMessage')
        .setLabel('Noticia')
        .setRequired(false)
        .setPlaceholder('Breaking News')
        .setStyle(TextInputStyle.Paragraph);

    const row = new ActionRowBuilder().addComponents(message);
    modal.addComponents(row);
    interaction.showModal(modal);
}