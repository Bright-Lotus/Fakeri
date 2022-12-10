const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const profile = require('./profile');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Perfil Evento')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        await profile(interaction, { contextMenu: true });
    },
};