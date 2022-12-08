const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Creates a new player profile on the event.'),
    async execute(interaction) {
        register(interaction);
    },
};

async function register(interaction) {
    await interaction.deferReply();
    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('class-select')
                .setPlaceholder('Choose your class')
                .addOptions(
                    {
                        label: 'Warrior 🗡️',
                        description: 'The most bloodthirsty on the battlefield!',
                        value: 'Warrior',
                    },
                    {
                        label: 'Enchanter 🪄',
                        description: 'Good for support but also deals damage with spells!',
                        value: 'Enchanter',
                    },
                    {
                        label: 'Archer 🏹',
                        description: 'Always waiting for the best shot...',
                        value: 'Archer',
                    },
                ),
        );
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    const classEmbed = new EmbedBuilder()
        .setTitle('Let\'s find your destined path!')
        .setDescription('Warrior | Archer | Enchanter')
        .setFooter({ text: 'Mana is the same for Warrior and Archer', iconURL: 'https://art.pixilart.com/bc43f3f21769f5f.png' })
        .setColor('#ffffff');

    const warriorEmbed = new EmbedBuilder()
        .setTitle('Warrior 🗡️')
        .setDescription('**Stats:**\nMore base ATK\nMore base HP\nLess base Speed\n\n**Ability:** Activate to gain +50% - 100% AD (based in player level) for 3 - 5 (based in ability level) attacks.')
        .setColor('#F83636');

    const archerEmbed = new EmbedBuilder()
        .setTitle('Archer 🏹')
        .setDescription('**Stats:**\nRegular base ATK\nLess base HP\nMore base Speed\nCan attack from different channels\n\n**Ability:** Prepare an attack for 2 turns, deal 20% (10 + 10% ATK) bonus damage on your next two attacks and gain 20% Speed for 5 attacks.')
        .setColor('#37BC6C');

    const enchanterEmbed = new EmbedBuilder()
        .setTitle('Enchanter 🪄')
        .setDescription('**Stats:**\nLess base ATK\nMore base HP\nLess base Speed\nMore base Mana\nHas 3 abilities and 1 ultimate\n\n**Abilities:**\nHeal player for 30% (10 + 1% Magic Power), increased by 20% if the Player is below 30% HP\nWork in progresss')
        .setColor('#00EAFF');

    interaction.editReply({ embeds: [classEmbed, warriorEmbed, archerEmbed, enchanterEmbed], components: [row] });
}