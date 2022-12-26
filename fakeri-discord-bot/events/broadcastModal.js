const { Events, EmbedBuilder, userMention, roleMention } = require('discord.js');
const { Colors } = require('../emums/colors');
const { ErrorEmbed, EventErrors } = require('../errors/errors');
// TODO: Probably get this from the database
const broadcastChannels = ['1032013306631827546', '1049703237336444968', '1056685534526844938', '1056699246109270127'];

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        // If the interaction isn't a modal submit, return
        if (!interaction.isModalSubmit()) return;
        if (!interaction.customId.includes('broadcast-')) return;
        // If the user isn't Luis or Ze, return
        if (interaction.user.id != '773971453392584755' && interaction.user.id != '949025108897448046' && interaction.user.id != '1011657604822474873' && interaction.user.id != '743521074884640809') {
            const errorEmbed = ErrorEmbed(EventErrors.NotEnoughPermissions, `Solo ${userMention('773971453392584755')} y ${userMention('1011657604822474873')} pueden usar este comando!`);
            return interaction.reply({ embeds: [errorEmbed] });
        }
        // Deferring the reply
        // Returns a "Bot is thinking..." message
        await interaction.deferReply();
        // Getting the message from the modal
        const message = interaction.fields.getTextInputValue('broadcastMessage');
        // Getting the newsletter from the customId
        const newsletter = interaction.customId.split('-')[ 1 ];
        let embedColor = 'luis <3';
        switch (newsletter) {
            case 'El Observador':
                embedColor = Colors.ElObservador;
                break;
            case 'El Mega Observador':
                embedColor = Colors.ElObservadorPlus;
                break;
            case 'UFOLogy':
                embedColor = Colors.UFOLogy;
                break;
            case 'everyone':
                embedColor = 'Random';
                break;
        }
        // Sending the message to the channels
        broadcastChannels.forEach(channel => {
            interaction.client.channels.fetch(channel).then(async textChannel => {
                // Get the role from the guild
                const pingRole = await textChannel.guild.roles.cache.find(role => role.name.toLowerCase().includes(newsletter.toLowerCase()));
                const messageEmbed = new EmbedBuilder()
                    .setTitle(`${(newsletter == 'everyone') ? 'Alcaldia' : newsletter}`)
                    .setColor(embedColor)
                    .setAuthor({ name: 'Noticia Nueva' })
                    .setDescription(message);
                // Send the message pinging the role or everyone if the newsletter specifies so
                textChannel.send({ content: (newsletter != 'everyone') ? roleMention(pingRole.id) : '@everyone', embeds: [messageEmbed] });
            });
        });
        // Reply to the interaction saying that the messages were sent
        interaction.editReply('Mensajes enviados!');
    },
};