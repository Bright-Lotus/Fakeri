const { getDoc, doc, getFirestore, collection, getDocs, updateDoc, increment } = require('firebase/firestore');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const { execute } = require('../handlers/shopHandler.js');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { pagination } = require('../handlers/paginationHandler.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, bold, underscore } = require('discord.js');
const { inventoryExecute } = require('../commands/inventory.js');
const { Colors } = require('../emums/colors.js');
const { goldManager } = require('../handlers/goldHandler.js');
const { Icons } = require('../emums/icons.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function equippedButton(interaction, playerClass) {
    const itemRow = new ActionRowBuilder();
    const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));
    const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
    if (equipped.exists()) {
        if (playerClass == 'warrior') {
            if (equipped.data().sword?.id) {
                console.log('Algo equipado');
                if (equipment.exists()) {
                    const sword = equipment.data().swords[ `sword${equipped.data().sword.id}` ];
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
        else if (playerClass == 'archer') {
            if (equipped.data().bow?.id) {
                console.log('Algo equipado');
                const bow = equipment.data().bows[ `bow${equipped.data().bow.id}` ];
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
        else if (playerClass == 'enchanter') {
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
    return itemRow;
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId.includes('buyInfoBtnAccept')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }
            const idSplit = interaction.customId.split('-')[ 1 ].split('|');
            const itemId = idSplit[ 1 ];
            const shopInventory = await getDocs(collection(db, '/Event/Shop/ShopInventory'));
            let item;
            shopInventory.forEach(async document => {
                item = document.data()[ idSplit[ 0 ] ][ itemId ];
            });
            const category = idSplit[ 0 ];
            console.log(idSplit, itemId, item);
            await goldManager('buy', item.price, interaction.user)
                .then(async result => {
                    const buyResponses = [
                        'Pff, disfruta',
                        'OYE ME PAGASTE MENOS DE LO QUE ERA\n...\nAh no olvidalo',
                        'Ya te puedes ir!\nO compra algo mas entonces',
                        'Considera comprar otras cosas tambien, necesito dinero',
                        '...',
                        'Uhhhhh, gracias',
                    ];
                    const thanksEmbed = new EmbedBuilder()
                        .setTitle('Nora')
                        .setColor(Colors.NoraColor)
                        .setDescription(buyResponses[ Math.floor(Math.random() * buyResponses.length) ]);
                    const dialogEnd = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('end')
                            .setLabel('Dialog has ended')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('🛑'),
                    );

                    const goldEmbed = new EmbedBuilder()
                        .setTitle('La compra ha sido exitosa')
                        .setAuthor({ name: 'Banco Aelram ◑ Factura' })
                        .setDescription(`${bold('Has comprado ' + underscore(item.name) + ' por ' + underscore(item.price) + ' oro')}\nOro restante: ${result}`)
                        .setColor('Gold');

                    const docSnap = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
                    let itemAmount;
                    if (docSnap.exists()) {
                        if (!docSnap?.data()?.[ `${category}` ]) {
                            await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                                [ category ]: { amount: 0 },
                            }, { merge: true });
                        }
                        itemAmount = docSnap.data()[ `${category}` ]?.amount || 0;
                    }
                    console.log(itemAmount);

                    item = { ...item, id: itemAmount + 1 };
                    if (category == 'consumables') {
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                            [ category ]: { ...docSnap.data()?.[ `${category}` ], amount: itemAmount + 1, [ `${category.slice(0, -1)}${itemAmount + 1}` ]: item },
                        }, { merge: true });
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                            [ `${category}.${category.slice(0, -1)}${itemAmount + 1}.consumableAmount` ]: increment(1),
                        }, { merge: true });
                    }
                    else {
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                            [ category ]: { ...docSnap.data()?.[ `${category}` ], amount: itemAmount + 1, [ `${category.slice(0, -1)}${itemAmount + 1}` ]: item },
                        }, { merge: true });
                    }
                    await interaction.reply({ embeds: [ goldEmbed, thanksEmbed ], components: [ dialogEnd ] });
                    console.log('wut');
                }).catch(error => {
                    if (error.errorCode == EventErrors.NotEnoughGold) {
                        const goldErrorEmbed = new EmbedBuilder()
                            .setTitle('Nora')
                            .setColor('#C600FF')
                            .setDescription('Compra algo mas barato o vuelve cuando tengas mas oro!!');
                        return interaction.reply({ embeds: [ error.errorEmbed, goldErrorEmbed ] });
                    }
                });

            return;
        }
        if (interaction.customId.includes('buyInfoBtnReject')) {
            const rejectedEmbed = new EmbedBuilder()
                .setTitle('Nora')
                .setColor('#C600FF')
                .setDescription('Mira lo que te gusta y COMPRALO!\nY deja de desperdiciar mi tiempo!');
            return interaction.reply({ embeds: [ rejectedEmbed ] });
        }
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
        if (interaction.customId.includes('wandsInventoryEnchanterModal')) {
            console.log('its reacghin here');
            const playerInfo = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
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
            }
            const categories = [ classSignatureWeapon, 'armorPlates' ];
            if (playerInfo.data().class == 'enchanter') {
                categories.push('abilityOrbs');
            }
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
            categories.forEach(elmnt => {
                categoryRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`${elmnt}-view-btn`)
                        .setEmoji(`${categoriesButton[elmnt + 'Emoji']}`)
                        .setStyle(ButtonStyle.Primary)
                        .setLabel(categoriesButton[elmnt]),
                );
            });
            const itemRow = await equippedButton(interaction, playerInfo.data().class);

            const idSplit = interaction.customId.split('-');
            const page = Number(idSplit[ 1 ].match(/\d+/g)[ 0 ]);

            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (equipment.exists()) {
                const items = equipment.data().wands;
                const itemsArray = Object.values(items).filter(element => (typeof element != 'number'));
                await pagination('wandsInventoryEnchanter', itemsArray, page, interaction.user).then(results => {
                    interaction.update({ embeds: [ results.embed ], components: [ results.paginationRow, itemRow, results.selectMenuRow, categoryRow ] });
                });
            }
            return;
        }
        if (interaction.customId.includes('inventoryBowsModal')) {
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
        if (interaction.customId.includes('consumablesModal')) {
            const idSplit = interaction.customId.split('-');
            const page = Number(idSplit[ 1 ].match(/\d+/g)[ 0 ]);

            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (equipment.exists()) {
                const items = equipment.data().consumables;
                const itemsArray = Object.values(items).filter(element => (typeof element != 'number'));
                await pagination('consumables', itemsArray, page, interaction.user).then(results => {
                    interaction.update({ embeds: [ results.embed ], components: [ results.paginationRow, results.selectMenuRow ] });
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
        if (interaction.customId.includes('leaderboardModal')) {
            const players = await getDoc(doc(db, 'Event/Players'));
            const usersArray = [];
            if (players.exists()) {
                for await (const player of players.data().members) {
                    const playerInfo = await (await getDoc(doc(db, player.id, 'PlayerInfo'))).data();
                    await interaction.client.users.fetch(player.id).then(usr => {
                        usersArray.push({
                            id: usr.id,
                            eventPts: playerInfo.eventPoints,
                            name: usr.username,
                            playerHp: playerInfo.stats.hp,
                            playerMaxHp: playerInfo.stats.maxHp,
                            isPlayer: (interaction.user.id == player.id),
                            lvl: playerInfo.playerLvl,
                        });
                    });
                }
                const sortedArray = usersArray.sort((a, b) => {
                    return b.eventPts - a.eventPts;
                });
                console.log(sortedArray);
                await pagination('leaderboard', sortedArray, interaction.customId.split('-')[ 1 ].charAt(4), interaction.user, { arraySorted: true }).then(results => {
                    interaction.update({ embeds: [ results.embed ], components: [ results.paginationRow ] });
                });
                return;
            }
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