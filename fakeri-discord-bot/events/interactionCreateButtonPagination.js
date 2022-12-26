const { getDoc, doc, getFirestore } = require('firebase/firestore');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const { execute } = require('../handlers/shopHandler.js');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { pagination } = require('../handlers/paginationHandler.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { inventoryExecute } = require('../commands/inventory.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function equippedButton(interaction) {
    const itemRow = new ActionRowBuilder();
    const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));
    if (equipped.exists()) {
        if (equipped.data().sword?.id) {
            console.log('Algo equipado');
            const swordSnap = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (swordSnap.exists()) {
                const sword = swordSnap.data().swords[ `sword${equipped.data().sword.id}` ];
                itemRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId('equippedSword-btn')
                        .setEmoji('🪓')
                        .setStyle(ButtonStyle.Primary)
                        .setLabel(sword.name),
                );
            }
        }
        else {
            itemRow.addComponents(
                new ButtonBuilder()
                    .setCustomId('equippedSword-btn')
                    .setEmoji('❎')
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Nada equipado'),
            );
        }
    }
    return itemRow;
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId.includes('filterButton-abiilty-target')) {
            const filterModal = new ModalBuilder()
                .setCustomId(interaction.customId.replace('Button', 'Modal'))
                .setTitle('Filtrar');

            const filterUserInput = new TextInputBuilder()
                .setCustomId('userFilter')
                .setLabel('Busqueda')
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            const modalRow = new ActionRowBuilder().addComponents(filterUserInput);
            filterModal.addComponents(modalRow);
            console.log('mewoewer');
            await interaction.showModal(filterModal);
            return;
        }
        if (interaction.customId.includes('abilityOrbs-view-btn')) {
            await inventoryExecute(interaction, 'abilityOrbs');
            return;
        }
        if (interaction.customId.includes('-view-btn')) {
            await inventoryExecute(interaction, interaction.customId.split('-')[ 0 ]);
            return;
        }
        if (interaction.customId.includes('inventorySwordsModal')) {
            const itemRow = await equippedButton(interaction);

            const idSplit = interaction.customId.split('-');
            const page = Number(idSplit[ 1 ].match(/\d+/g)[ 0 ]);

            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (equipment.exists()) {
                const items = equipment.data().swords;
                const itemsArray = Object.values(items).filter(element => (typeof element != 'number'));
                await pagination('inventorySwords', itemsArray, page, interaction.user).then(results => {
                    interaction.update({ embeds: [ results.embed ], components: [ results.paginationRow, itemRow, results.selectMenuRow ] });
                });
            }
            return;
        }
        if (interaction.customId.includes('abilityOrbsModal')) {
            const idSplit = interaction.customId.split('-');
            console.log(idSplit);
            const page = Number(idSplit[ 1 ].match(/\d+/g)[ 0 ]);
            const enemyUnique = Number(idSplit[ 4 ]);

            const playerEquipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (playerEquipment.exists()) {
                const playerInfo = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
                if (playerInfo.exists()) {
                    const playerMana = playerInfo.data().stats.mana;
                    const abilityOrbs = playerEquipment.data().abilityOrbs;
                    const abilityOrbsArray = Object.values(abilityOrbs).filter(element => (typeof element != 'number'));
                    await pagination('abilityOrbs', abilityOrbsArray, page, interaction.user, { currentMana: playerMana, enemyUnique: enemyUnique }).then(results => {
                        interaction.update({ embeds: [ results.embed ], components: [ results.paginationRow, results.selectMenuRow ] });
                    });
                }
            }
            return;
        }
        if (!interaction.customId.includes('shopModal') || interaction.customId.includes('pageViewer')) return;
        const page = interaction.customId.split('-')[ 1 ];
        const category = interaction.customId.split('-')[ 2 ];

        // If the page includes page means it's from the pagination buttons
        // If not is from the change category buttons
        // These too don't have the ID check in the same position (ID is in index [2] in category change and [3] in pagination button)
        // The ID check is the ID of the user to make sure the creator of the original interaction
        // Is the same as the author of the interaction
        if (interaction.user.id != interaction.customId.split('-')[ `${(page.includes('page')) ? '3' : '2'}` ]) {
            return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfPagination) ], ephemeral: true });
        }
        console.log('🚀 ~ file: interactionCreateButtonPagination.js:110 ~ execute ~ page', page, category);


        if (!page.includes('page')) {
            const row = await execute('open', interaction, 1, [], page);
            return interaction.update(row);
        }
        else {
            const row = await execute('open', interaction, page.charAt(4), [], category);
            return interaction.update(row);
        }
    },
};