const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, userMention, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
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
    if (interaction.user.id != '773971453392584755' && interaction.user.id != '949025108897448046' && interaction.user.id != '1011657604822474873' && interaction.user.id != '743521074884640809') {
        const errorEmbed = ErrorEmbed(EventErrors.NotEnoughPermissions, `Solo ${userMention('743521074884640809')} y ${userMention('1011657604822474873')} pueden usar este comando!`);
        return interaction.reply({ embeds: [errorEmbed] });
    }
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
            deny: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ViewChannel],
            allow: [PermissionFlagsBits.SendMessages],
        }],
    }).then(channel => { createdChannelID = channel.id; });
    const channelsSnap = await getDoc(doc(db, interaction.guild.id, 'FarmChannels'));
    let channelID = channelsSnap.data().channelCount + 1;
    if (channelsSnap.exists()) {
        if (channelsSnap.data()?.channelCount) {
            await updateDoc(doc(db, `${interaction.guildId}/FarmChannels`), { ['channelCount']: increment(1) }, { merge: true });
            await setDoc(doc(db, `${interaction.guildId}/FarmChannels`), { [`channel${channelID}`]: { enemies: interaction.options.getString('enemies').split(','), id: createdChannelID, minLvl: interaction.options.getInteger('required-level') } }, { merge: true });
        }
        else {
            channelID = 1;
            await setDoc(doc(db, `${interaction.guildId}/FarmChannels`), { [`channel${channelID}`]: { enemies: interaction.options.getString('enemies').split(','), id: createdChannelID, minLvl: interaction.options.getInteger('required-level') } }, { merge: true });
            await setDoc(doc(db, `${interaction.guildId}/FarmChannels`), { ['channelCount']: 1 }, { merge: true });

        }
    }
    const modal = new ModalBuilder()
        .setCustomId(`farmChannel-zoneBonuses-${interaction.options.getString('enemies')}-${createdChannelID}-${channelID}-${interaction.options.getInteger('required-level')}`)
        .setTitle('Bonuses de Canal');

    const bonus1Input = new TextInputBuilder()
        .setCustomId('zoneBonusSlot1')
        .setLabel('Bonus Ranura 1')
        .setRequired(false)
        .setPlaceholder('name: name, type: atk, amount: +50%')
        .setStyle(TextInputStyle.Short);
    const bonus2Input = new TextInputBuilder()
        .setCustomId('zoneBonusSlot2')
        .setLabel('Bonus Ranura 2')
        .setRequired(false)
        .setPlaceholder('name: name, type: atk, amount: +50%')
        .setStyle(TextInputStyle.Short);
    const bonus3Input = new TextInputBuilder()
        .setCustomId('zoneBonusSlot3')
        .setLabel('Bonus Ranura 3')
        .setRequired(false)
        .setPlaceholder('name: name, type: atk, amount: +50%')
        .setStyle(TextInputStyle.Short);
    const bonus4Input = new TextInputBuilder()
        .setCustomId('zoneBonusSlot4')
        .setLabel('Bonus Ranura 4')
        .setRequired(false)
        .setPlaceholder('name: name, type: atk, amount: +50%')
        .setStyle(TextInputStyle.Short);
    const bonus5Input = new TextInputBuilder()
        .setCustomId('zoneBonusSlot5')
        .setLabel('Bonus Ranura 5')
        .setRequired(false)
        .setPlaceholder('name: name, type: atk, amount: +50%')
        .setStyle(TextInputStyle.Short);
    const bonus1Row = new ActionRowBuilder().addComponents(bonus1Input);
    const bonus2Row = new ActionRowBuilder().addComponents(bonus2Input);
    const bonus3Row = new ActionRowBuilder().addComponents(bonus3Input);
    const bonus4Row = new ActionRowBuilder().addComponents(bonus4Input);
    const bonus5Row = new ActionRowBuilder().addComponents(bonus5Input);
    modal.addComponents(bonus1Row, bonus2Row, bonus3Row, bonus4Row, bonus5Row);
    await interaction.showModal(modal);
}
