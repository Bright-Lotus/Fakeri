const { Events } = require('discord.js');
const { contextMenuExecute } = require('../commands/profile');

module.exports = {
	name: Events.InteractionCreate,
	once: true,
    async execute(interaction) {
        if (!interaction.isUserContextMenuCommand()) return;
        contextMenuExecute(interaction, { contextMenu: true });
    },
};