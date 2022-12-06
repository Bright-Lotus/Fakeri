const { giftsDrop } = require('../handlers/dropHandler');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await giftsDrop(client);
		setInterval(async () => {
			await giftsDrop(client);
		}, (36e5 * 24));
		console.log(`Thy bot shalt obey thou commands! Logged in as ${client.user.tag}`);
	},
};