const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, chatInputApplicationCommandMention } = require('discord.js');
const { getFirestore, getDoc, doc } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { pagination } = require('../handlers/paginationHandler.js');
const { CommandIds } = require('../emums/commandIds.js');
const { Icons } = require('../emums/icons.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Muestra tu inventario'),
    async execute(interaction, category) {
        await inventory(interaction, category);
    },
    inventoryExecute: async function(interaction, category) {
        await inventory(interaction, category);
    },
};

async function inventory(interaction, category) {
    const playerInfo = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
    await interaction.deferReply();

    if (playerInfo.exists()) {
        if (!category) {
            switch (playerInfo.data().class) {
                case 'warrior':
                    category = 'swords';
                    break;
                case 'enchanter':
                    category = 'wands';
                    break;
                case 'archer':
                    category = 'bows';
                    break;
                default:
                    break;
            }
        }
        const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
        const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));
        if (equipment.exists()) {
            const items = equipment.data()[category];
            if (items.amount < 1) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('No tienes nada en tu inventario')
                            .setDescription(`Puedes usar ${chatInputApplicationCommandMention('shop', CommandIds.Shop)} para comprar objetos.`)
                            .setColor('Red'),
                    ],
                });
            }
            const itemsArray = Object.values(items).filter(element => (typeof element != 'number'));
            const itemRow = new ActionRowBuilder();
            const categories = ['abilityOrbs', 'swords', 'armorPlates'].filter(element => element != category);
            const categoriesButton = { abilityOrbs: 'Orbes de Habilidad', swords: 'Espadas', armorPlates: 'Armaduras', abilityOrbsEmoji: Icons.AbilityOrb, swordsEmoji: Icons.ATK, armorPlatesEmoji: Icons.Armor }
            console.log(categories);
            const categoryRow = new ActionRowBuilder();
            categories.forEach(elmnt => {
                categoryRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${elmnt}-view-btn`)
                        .setEmoji(`${categoriesButton[`${elmnt}Emoji`]}`)
                        .setStyle(ButtonStyle.Primary)
                        .setLabel(categoriesButton[elmnt]),
                );
            });
            if (equipped.exists()) {
                if (category == 'swords') {
                    if (equipped.data().sword?.id) {
                        console.log('Algo equipado');
                        const sword = equipment.data().swords[`sword${equipped.data().sword.id}`];
                        itemRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId('equippedSword-btn')
                                .setEmoji('🪓')
                                .setStyle(ButtonStyle.Primary)
                                .setLabel(sword.name),
                        );
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
                if (category == 'abilityOrbs') {
                    if (equipped.data().abilityOrbs?.orb1) {
                        const abilityOrbSlot1 = equipment.data().abilityOrbs[`abilityOrb${equipped.data().abilityOrbs.orb1}`];
                        itemRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId('equippedOrb1-btn')
                                .setEmoji(`${Icons.AbilityOrb}`)
                                .setStyle(ButtonStyle.Primary)
                                .setLabel(abilityOrbSlot1.name),
                        );
                    }
                    else {
                        itemRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId('equippedOrb1-btn')
                                .setEmoji('❎')
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel('Nada equipado'),
                        );
                    }

                    if (equipped.data().abilityOrbs?.orb2) {
                        const abilityOrbSlot2 = equipment.data().abilityOrbs[`abilityOrb${equipped.data().abilityOrbs.orb2}`];
                        itemRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId('equippedOrb2-btn')
                                .setEmoji(`${Icons.AbilityOrb}`)
                                .setStyle(ButtonStyle.Primary)
                                .setLabel(abilityOrbSlot2.name),
                        );
                    }
                    else {
                        itemRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId('equippedOrb2-btn')
                                .setEmoji('❎')
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel('Nada equipado'),
                        );
                    }
                }
            }
            await pagination(`${category}Inventory`, itemsArray, 1, interaction.user, { class: playerInfo.data().class }).then(results => {
                if (category == 'abilityOrbs') {
                    return interaction.editReply({ embeds: [results.embed], components: [results.paginationRow, itemRow, results.selectMenuRow, results.selectMenuOrb2Row, categoryRow] });
                }
                return interaction.editReply({ embeds: [results.embed], components: [results.paginationRow, itemRow, results.selectMenuRow, categoryRow] });
            });
            console.log(equipment.data()[category]);
        }
    }
}