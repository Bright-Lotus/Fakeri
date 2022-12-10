const { giftsDrop } = require('../handlers/dropHandler');
const figlet = require('figlet');
const chalk = require('chalk');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await giftsDrop(client);
		setInterval(async () => {
			await giftsDrop(client);
		}, (36e5 * 24));
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