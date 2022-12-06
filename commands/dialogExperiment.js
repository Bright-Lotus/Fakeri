const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { dialogHandler } = require('../handlers/dialogHandler.js');
const { goldManager } = require('../handlers/goldHandler.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Enter the shop!'),
	async execute(interaction) {
		await dialog(interaction);
	},
};

async function dialog(interaction) {
	// example gratia await goldManager('buy', 200, interaction.user).then(result => {
	// 	console.log(result);
	// }).catch(errorEmbed => {
	// 	console.log(errorEmbed);
	// 	interaction.reply({ embeds: [errorEmbed] });
	// });
	await dialogHandler('shopCmd', 1, interaction, '', 'shop');
}
