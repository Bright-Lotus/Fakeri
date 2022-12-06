const { Events } = require('discord.js');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;
        const player = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
        if (!player.exists() && interaction.commandName != 'register') {
            return interaction.reply({ embeds: [ErrorEmbed(EventErrors.PlayerNotRegistered)] });
        }
        if (player.exists()) {
            if (player.data().dead && interaction.commandName != 'profile' && interaction.commandName != 'event' && interaction.commandName != 'register') {
                return interaction.reply({ embeds: [ErrorEmbed(EventErrors.PlayerIsDead)] });
            }
        }

        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    },
};