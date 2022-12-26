const { giftsDrop } = require('../handlers/dropHandler');
const figlet = require('figlet');
const chalk = require('chalk');
const { ActivityType } = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const botStatuses = [
			{ name: 'Aelram', type: ActivityType.Watching },
			{ name: 'El Evento', type: ActivityType.Competing },
			{ name: 'Comprenle a Nora!', type: ActivityType.Streaming },
		];

		// Choose a random status from botStatuses and set it to the client
		client.user.setPresence({ activities: [botStatuses[Math.floor(Math.random() * botStatuses.length)]] });
		await giftsDrop(client);
		setInterval(async (botClient) => {
			await giftsDrop(botClient);
		}, (36e5 * 24), client);
		figlet('Fakeri', {
			font: 'Graffiti',
			horizontalLayout: 'default',
			verticalLayout: 'default',
			width: 80,
			whitespaceBreak: true,
		}, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			console.log(chalk.blueBright(data));
			figlet('Online', {
				font: 'Graffiti',
				horizontalLayout: 'default',
				verticalLayout: 'default',
				width: 80,
				whitespaceBreak: true,
			}, (err, dataOnline) => {
				if (err) {
					console.error(err);
					return;
				}
				console.log(chalk.greenBright(dataOnline));
			});
		});
	},
};