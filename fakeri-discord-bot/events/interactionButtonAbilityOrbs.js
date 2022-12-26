const { inventoryExecute } = require('../commands/inventory.js');
const { EventErrors, ErrorEmbed } = require('../errors/errors.js');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, bold, underscore, formatEmoji } = require('discord.js');
const { Icons } = require('../emums/icons.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId.includes('equippedOrb1-btn-')) {
            await interaction.deferReply();
            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));

            const abilityId = interaction.customId.split('-')[2];
            if (equipment.exists() && equipped.exists()) {
                const abilityOrbEquipped = equipment.data().abilityOrbs[`abilityOrb${abilityId}`];
                const abilityOrbEmbed = new EmbedBuilder()
                    .setTitle(underscore(bold(abilityOrbEquipped.name)))
                    .setColor('Aqua')
                    .setDescription(`${abilityOrbEquipped.desc}\n\n**Mana requerido:** ${abilityOrbEquipped.requiredMana} ${formatEmoji(Icons.Mana)}`);
                return interaction.editReply({ embeds: [abilityOrbEmbed] });
            }
        }
        if (!interaction.customId.includes('Button') || interaction.customId.includes('filterButton')) return;
        console.log(interaction.customId, 'loglogloglog');
        if (interaction.user.id != interaction.customId.split('/')[1]) {
            return interaction.reply({ embeds: [ErrorEmbed(EventErrors.NotOwnerOfPagination)], ephemeral: true });
        }
        inventoryExecute(interaction, 'abilityOrbs', { action: 'equip', orbPosition: interaction.customId.charAt(14) });
    },
};