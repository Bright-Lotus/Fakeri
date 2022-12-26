const { SlashCommandBuilder, EmbedBuilder, userMention, bold, hyperlink } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const version = process.env.BOT_VERSION;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('credits')
		.setDescription('Creditos a los que ayudaron creando a Fakeri!'),
	async execute(interaction) {
        const creditEmbed = new EmbedBuilder()
            .setTitle('Creditos!')
            .setDescription(`Bot hecho en JavaScript con ${hyperlink('Discord.JS', 'https://discordjs.guide/')}!`)
            .addFields(
                { name: bold('Desarrolladora principal'), value: `${userMention('1011657604822474873')}\n\n- Codigo\n- Multimedia 3D`, inline: true },
                { name: bold('Supervisor creativo'), value: `${userMention('743521074884640809')}\n\n- Revisor de ideas y conceptos\n- Opiniones acerca de ideas y conceptos\n**- Nombre del Bot**`, inline: true },
                { name: bold('Herramientas usadas'), value: '\n\n- Visual Studio Code\n- Blender 3.3.1\n- Adobe Photoshop 2023' },
            )
            .setFooter({ text: `Bot version: ${version}` })
            .setColor('Gold');
        return interaction.reply({ embeds: [creditEmbed] });
    },
};