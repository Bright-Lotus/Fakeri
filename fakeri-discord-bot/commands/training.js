const { SlashCommandBuilder } = require('discord.js');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { dialogHandler } = require('../handlers/dialogHandler');
const { firebaseConfig } = require('../firebaseConfig.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('training')
		.setDescription('Go to the training room!'),
	async execute(interaction) {
		await train(interaction);
	},
};

async function train(interaction) {
	const activeDialog = await getDoc(doc(db, interaction.user.id, 'EventDialogProgression'));
	const playerClass = await (await getDoc(doc(db, interaction.user.id, 'PlayerInfo'))).data().class;
	let instructor;
	switch (playerClass) {
		case 'warrior':
			instructor = 'Lyra';
			break;

		case 'enchanter':
			instructor = 'Abe';
			break;

		case 'archer':
			instructor = 'Arissa';
			break;
	}
	if (activeDialog.exists()) {
		if (activeDialog.data()?.[instructor]?.activeDialog != 'default') {
			console.log('🚀 ~ file: training.js:40 ~ train ~ (activeDialog.data()?.[instructor]?.activeDialog', (activeDialog.data()?.[instructor]?.activeDialog));
			await dialogHandler(activeDialog.data()?.[instructor]?.activeDialog, 1, interaction, '', `training/${instructor}`);
		}
		else {
			await dialogHandler('noMission', 1, interaction, '', `training/${instructor}`);
		}
	}
}