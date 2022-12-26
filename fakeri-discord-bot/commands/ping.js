const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Mide la latencia del bot'),
	async execute(interaction) {
		ping(interaction);
	},
};

async function ping(interaction) {
	const latencyEmbed = new EmbedBuilder()
		.setColor('Blue')
		.setTitle('Pong! 🏓');
	const currentTime = Date.now();
	interaction.reply({ content: '_ _', ephemeral: true }).then(() => {
		latencyEmbed.addFields(
			{ name: 'Latencia Bot', value: `${Math.abs((currentTime - Date.now())) / 2} ms` },
			{ name: 'Latencia WebSocket', value: `${Math.round(interaction.client.ws.ping)} ms` },
		);
		interaction.editReply({ embeds: [ latencyEmbed ] });
	});
}
