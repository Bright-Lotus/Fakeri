const { SlashCommandBuilder } = require('discord.js');
const { dialogHandler } = require('../handlers/dialogHandler.js');
const { getFirestore, getDoc, doc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Enter the shop!'),
	async execute(interaction) {
		await dialog(interaction);
	},
};

async function dialog(interaction) {
	const activeDialog = await getDoc(doc(db, interaction.user.id, 'EventDialogProgression'));
	if (activeDialog.exists()) {
		if (activeDialog.data()?.Nora?.activeDialog != 'default') {
			await dialogHandler(activeDialog.data()?.Nora?.activeDialog, 1, interaction, '', 'shop');
		}
		else {
			await dialogHandler('shopCmd', 1, interaction, '', 'shop');
		}
	}
}
