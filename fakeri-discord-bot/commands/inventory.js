const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, chatInputApplicationCommandMention, formatEmoji, bold } = require('discord.js');
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
    inventoryExecute: async function(interaction, category, args) {
        await inventory(interaction, category, args);
    },
};

async function inventory(interaction, category, args) {
    const playerInfo = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
    await interaction.deferReply();
    let classSignatureWeapon = 'luisin';

    if (playerInfo.exists()) {
        switch (playerInfo.data().class) {
            case 'warrior':
                classSignatureWeapon = 'swords';
                break;
            case 'enchanter':
                classSignatureWeapon = 'wands';
                break;
            case 'archer':
                classSignatureWeapon = 'bows';
                break;
            default:
                break;
        }
        if (!category) {
            category = classSignatureWeapon;
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
            // TODO: Maybe implement ability orbs for Archer and Warriors
            let categories = [ classSignatureWeapon, 'armorPlates' ];
            if (playerInfo.data().class == 'enchanter') {
                categories.push('abilityOrbs');
            }
            categories = categories.filter(element => element != category);
            const categoriesButton = {
                abilityOrbs: 'Orbes de Habilidad',
                swords: 'Espadas',
                wands: 'Varitas',
                bows: 'Arcos',
                armorPlates: 'Armaduras',
                abilityOrbsEmoji: Icons.AbilityOrb,
                swordsEmoji: Icons.ATK,
                armorPlatesEmoji: Icons.Armor,
                wandsEmoji: Icons.Wands,
                bowsEmoji: Icons.Bows,
            };
            console.log(categories);
            const categoryRow = new ActionRowBuilder();
            const orbsRow = new ActionRowBuilder();
            const orbEquipRow = new ActionRowBuilder();
            const currentlyEquippedEmbed = new EmbedBuilder().setTitle(`Actualmente equipado en ranura ${args?.orbPosition || 0}`).setColor('Aqua');
            categories.forEach(elmnt => {
                categoryRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${elmnt}-view-btn`)
                        .setEmoji(`${categoriesButton[elmnt + 'Emoji']}`)
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
                if (category == 'bows') {
                    if (equipped.data().bow?.id) {
                        console.log('Algo equipado');
                        const bow = equipment.data().bows[`bow${equipped.data().bow.id}`];
                        itemRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId('equippedBow-btn')
                                .setEmoji('🏹')
                                .setStyle(ButtonStyle.Primary)
                                .setLabel(bow.name),
                        );
                    }
                    else {
                        itemRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId('equippedBow-btn')
                                .setEmoji('❎')
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel('Nada equipado'),
                        );
                    }
                }
                if (category == 'armorPlates') {
                    if (equipped.data().armorPlate?.id) {
                        console.log('Algo equipado');
                        const armorPlate = equipment.data().armorPlates[`armorPlate${equipped.data().armorPlate.id}`];
                        itemRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId('equippedArmorPlate-btn')
                                .setEmoji('🛡️')
                                .setStyle(ButtonStyle.Primary)
                                .setLabel(armorPlate.name),
                        );
                    }
                    else {
                        itemRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId('equippedArmorPlate-btn')
                                .setEmoji('❎')
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel('Nada equipado'),
                        );
                    }
                }
                if (category == 'wands') {
                    if (equipped.data().wand?.id) {
                        console.log('Algo equipado');
                        const wand = equipment.data().wands[`wand${equipped.data().wand.id}`];
                        itemRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId('equippedSword-btn')
                                .setEmoji('🪄')
                                .setStyle(ButtonStyle.Primary)
                                .setLabel(wand.name),
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
                    // TODO: Maybe implement ability orbs for Archers and Warriors

                    if (equipped.data().abilityOrbs?.[`orb${args?.orbPosition || -1}`]) {
                        const orbEquippedInSlot = equipment.data().abilityOrbs[`abilityOrb${equipped.data().abilityOrbs?.['orb' + args?.orbPosition || -1]}`];
                        currentlyEquippedEmbed.addFields(
                            {
                                name: `__${orbEquippedInSlot.name}__ | ID: ${orbEquippedInSlot.id}`,
                                value: orbEquippedInSlot.desc + `\n\n${bold('Mana requerido:')} ${orbEquippedInSlot.requiredMana} ${formatEmoji(Icons.Mana)}`,
                            },
                        );
                    }
                    else {
                        currentlyEquippedEmbed.setDescription('No tienes nada actualmente equipado en esta ranura!');
                    }

                    for (let i = 1; i < 6; i++) {
                        if (equipped.data().abilityOrbs?.[`orb${i}`]) {
                            orbsRow.addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`orbButtonView${i}/${interaction.user.id}`)
                                    .setEmoji(Icons.AbilityOrb)
                                    .setStyle((i != 5) ? ButtonStyle.Primary : ButtonStyle.Success),
                            );
                        }
                        else {
                            orbsRow.addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`orbButtonView${i}/${interaction.user.id}`)
                                    .setEmoji('❎')
                                    .setStyle((i != 5) ? ButtonStyle.Secondary : ButtonStyle.Danger),
                            );

                        }

                        orbEquipRow.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`orbButtonEquip${i}/${interaction.user.id}`)
                                .setEmoji('🔃')
                                .setStyle((i != 5) ? ButtonStyle.Primary : ButtonStyle.Success),
                        );
                    }
                }
            }
            const classStr = (playerInfo.data().class == 'enchanter' && category != 'swords') ? 'Enchanter' : '';
            const functionArgs = {
                class: playerInfo.data().class,
            };
            console.log(args, functionArgs, category);
            if (args?.orbPosition) {
                functionArgs.orbPosition = args.orbPosition;
            }
            console.log(`${category}Inventory${classStr}`);
            await pagination(`${category}Inventory${classStr}${args?.action?.toUpperCase() || ''}`, itemsArray, 1, interaction.user, functionArgs).then(results => {
                if (category == 'abilityOrbs') {
                    if (args?.action == 'equip') {
                        console.log(results.paginationRow.components, results.selectMenuRow.components);
                        return interaction.editReply({ embeds: [currentlyEquippedEmbed, results.embed], components: [results.paginationRow, results.selectMenuRow] });
                    }
                    if (classStr == 'Enchanter') {
                        return interaction.editReply({ embeds: [results.embed], components: [results.paginationRow, orbsRow, orbEquipRow, categoryRow] });
                    }
                    return interaction.editReply({ embeds: [results.embed], components: [results.paginationRow, itemRow, results.selectMenuRow, results.selectMenuOrb2Row, categoryRow] });
                }
                return interaction.editReply({ embeds: [results.embed], components: [results.paginationRow, itemRow, results.selectMenuRow, categoryRow] });
            });
            console.log(equipment.data()[category]);
        }
    }
}