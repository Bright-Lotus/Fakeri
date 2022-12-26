const { EmbedBuilder, bold } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId.includes('goldBtn')) {
            const gold = interaction.customId.split('-')[1];
            const goldEmbed = new EmbedBuilder()
                .setTitle('Oro')
                .setColor('Yellow')
                .setDescription(`Oro actual: ${bold(new Intl.NumberFormat().format(gold))} 🪙`);
            interaction.reply({ embeds: [goldEmbed] });
        }
        if (interaction.customId.includes('eventPointsBtn')) {
            const eventPts = interaction.customId.split('-')[1];
            const eventPtsEmbed = new EmbedBuilder()
                .setTitle('Puntos del evento!')
                .setColor('Yellow')
                .setFooter({ text: 'Recuerda que tus puntos del evento son la cantidad total de XP acumulada!' })
                .setDescription(`Puntos actuales: ${bold(new Intl.NumberFormat().format(eventPts))}`);
            interaction.reply({ embeds: [eventPtsEmbed] });
        }
    },
};