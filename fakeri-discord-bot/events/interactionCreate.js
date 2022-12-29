const { Events, EmbedBuilder, userMention, time, TimestampStyles, codeBlock } = require('discord.js');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const chalk = require('chalk');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;
        const player = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
        if (!player.exists() && interaction.commandName != 'register' && interaction.commandName != 'config' && interaction.commandName != 'adjust') {
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
            if (interaction?.deferred || interaction?.replied) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Algo inesperado ha sucedido!')
                    .setDescription(`Si el error continua por favor contacta a ${userMention('1011657604822474873')}`);
                await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
            else {
                const errorEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Algo inesperado ha sucedido!')
                    .setDescription(`Si el error continua por favor contacta a ${userMention('1011657604822474873')}`);
                await interaction.reply({ embeds: [errorEmbed] });
            }
            const errorChannelEmbed = new EmbedBuilder().setColor('Red')
                .setTimestamp(new Date())
                .setTitle('Un error ha ocurrido!')
                .setDescription(`El siguiente error ha sucedido ${time(new Date(), TimestampStyles.RelativeTime)} ${time(new Date(), TimestampStyles.LongDateTime)}\n${codeBlock(error)}`);
            interaction.client.channels.fetch('1054804493201571912').then(channel => {
                channel.send({ embeds: [errorChannelEmbed] });
            });
        }
        console.log(chalk.cyan(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`));
    },
};