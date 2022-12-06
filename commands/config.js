const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, userMention, channelMention } = require('discord.js');
const { getFirestore, setDoc, doc, getDoc, increment, updateDoc } = require('firebase/firestore');

const { firebaseConfig } = require('../firebaseConfig.js');
const { initializeApp } = require('firebase/app');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Change the mortals\'s world.')
        .addSubcommand(subcmd =>
            subcmd.setName('farm')
                .setDescription('Creates a new monster spawn zone.')
                .addStringOption(option => option.setName('name').setDescription('Name of the channel').setRequired(true))
                .addIntegerOption(option => option.setName('required-level').setDescription('Level required to access the farm zone').setRequired(true))
                .addStringOption(option => option.setName('enemies').setDescription('Enemies of the farm zone (Max: 3)').setRequired(true))
                .addChannelOption(option => option.setName('category').setDescription('Category where the channel will be created').setRequired(true))
                .addStringOption(option =>
                    option.setName('template')
                        .setDescription('Used for additional channel decoration, Example: "│・『🏹』┋ {0}", {0} will be replaced with the name'),
                ),
        ),
    async execute(interaction) {
        await eventConfig(interaction);
    },
};

async function eventConfig(interaction) {
    if (interaction.user.id != '773971453392584755' && interaction.user.id != '949025108897448046' && interaction.user.id != '1011657604822474873') {
        const errorEmbed = ErrorEmbed(EventErrors.NotEnoughPermissions, `Solo ${userMention('773971453392584755')} y ${userMention('1011657604822474873')} pueden usar este comando!`);
        return interaction.reply({ embeds: [errorEmbed] });
    }
    await interaction.deferReply();
    if (!String.prototype.format) {
        String.prototype.format = function() {
            const args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
            });
        };
    }
    console.log(interaction.options.getString('template'));
    console.log(interaction.options.getChannel('category'));
    const template = (interaction.options.getString('template')) ? interaction.options.getString('template') : '{0}';
    let createdChannelID;
    await interaction.guild.channels.create({
        name: template.format(interaction.options.getString('name')),
        parent: interaction.options.getChannel('category'),
        type: ChannelType.GuildText,
        permissionsOverwrites: [{
            id: interaction.guildId,
            deny: [PermissionFlagsBits.ManageMessages],
            allow: [PermissionFlagsBits.SendMessages],
        }],
    }).then(channel => { createdChannelID = channel.id; });
    const channelsSnap = await getDoc(doc(db, interaction.guild.id, 'FarmChannels'));
    if (channelsSnap.exists()) {
        if (channelsSnap.data()?.channelCount) {
            await updateDoc(doc(db, `${interaction.guildId}/FarmChannels`), { ['channelCount']: increment(1) }, { merge: true });
            await setDoc(doc(db, `${interaction.guildId}/FarmChannels`), { [`channel${channelsSnap.data().channelCount + 1}`]: { enemies: interaction.options.getString('enemies').split(','), id: createdChannelID, minLvl: interaction.options.getInteger('required-level') } }, { merge: true });
        }
        else {
            await setDoc(doc(db, `${interaction.guildId}/FarmChannels`), { ['channel1']: { enemies: interaction.options.getString('enemies').split(','), id: createdChannelID, minLvl: interaction.options.getInteger('required-level') } }, { merge: true });
            await setDoc(doc(db, `${interaction.guildId}/FarmChannels`), { ['channelCount']: 1 }, { merge: true });

        }
    }
    const embed = new EmbedBuilder()
        .setTitle('Canal creado exitosamente!')
        .setDescription(`Con los enemigos [${interaction.options.getString('enemies')}]\n${channelMention(createdChannelID)}`)
        .setColor('Green');
    interaction.editReply({ embeds: [embed] });
}
