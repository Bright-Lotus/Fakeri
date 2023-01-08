const { getFirestore, doc, getDocs, collection, updateDoc, getDoc, increment } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, bold, underscore, formatEmoji } = require('discord.js');
const { goldManager } = require('../handlers/goldHandler.js');
const { EventErrors, ErrorEmbed } = require('../errors/errors.js');
const { Icons } = require('../emums/icons.js');
const { Utils } = require('../utils.js');
const { Colors } = require('../emums/colors.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isSelectMenu()) return;
        if (!interaction.customId.includes('shopModal-selectMenu')) return;
        await interaction.deferReply();
        if (interaction.user.id != interaction.customId.split('-')[ 2 ]) {
            return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
        }
        const itemId = interaction.values[ 0 ].split('-')[ 3 ];
        const category = interaction.values[ 0 ].split('-')[ 4 ];
        let item;
        const shopInventory = await getDocs(collection(db, '/Event/Shop/ShopInventory'));
        shopInventory.forEach(async document => {
            item = document.data()[ category ][ `${category.slice(0, -1)}${itemId}` ];
        });
        const filter = msg => (msg.content.toLowerCase().includes('confirmar') && msg.author.id == interaction.user.id || msg.content.toLowerCase().includes('rechazar') && msg.author.id == interaction.user.id);
        let itemStr;
        const playerInfo = (await getDoc(doc(db, interaction.user.id, 'PlayerInfo'))).data();
        const playerClass = playerInfo.class;
        const playerGold = playerInfo.gold;
        const playerLvl = playerInfo.playerLvl;
        let perksStr = `\n\n***${item?.perks?.perkName || 'Ninguno'}***\n${item?.perks?.perkDesc || 'Este objeto no tiene ningun perk'}\n\n`;
        for (let index = 0; index < Object.values(item?.perks || []).length; index++) {
            const perk = item?.perks[ `perk${index + 1}` ];
            if (index == 0) { perksStr = `\n\n**${perk?.perkName}**\n${perk?.perkDesc}\n\n`; }
            else { perksStr += `\n\n**${perk?.perkName}`; }
        }
        switch (playerClass) {
            case 'archer':
                itemStr = `\n\n\n***Stats***\n\n**+${item?.stats?.atk}** - ATK\n**+${item.stats?.spd}** - SPD\n\n**Perks**${perksStr}**Price:** ${item.price} 🪙 ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${item.minLvl || 1} ${Icons.Level} ${(playerLvl < item.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                break;

            case 'warrior':
                itemStr = `\n\n\n***Stats***\n\n**+${item?.stats?.atk}** - ATK\n**+${item.stats?.spd}** - SPD\n\n**Perks**${perksStr}**Price:** ${item.price} 🪙 ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${item.minLvl || 1} ${Icons.Level} ${(playerLvl < item.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                // eslint-disable-next-line no-unused-vars
                break;

            case 'enchanter':
                itemStr = `\n\n\n***Stats***\n\n**+${item.stats?.magicStrength}** - MAGIC STR\n**+${item.stats?.mana}** - MANA\n\n**Perks**${perksStr}**Price:** ${item.price} 🪙 ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${item.minLvl || 1} ${Icons.Level} ${(playerLvl < item.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
                break;

            default:
                break;
        }
        if (category == 'armorPlates') {
            itemStr = `\n\n\n***Stats***\n\n**+${item.stats.armor}** - Armor\n**+${item.stats.magicDurability}** - Magic DURABILITY\n\n**Perks**${perksStr}**Price:** ${item.price} 🪙 ${(playerGold < item.price) ? formatEmoji(Icons.NotEnoughGold) : ''}\n**Minimum Level:** ${item.minLvl || 1} ${Icons.Level} ${(playerLvl < item.minLvl) ? formatEmoji(Icons.NotEnoughLevel) : ''}`;
        }
        else if (category == 'abilityOrbs') {
            itemStr = `${Utils.FormatDescription(item.desc, item)}` + `\n\n${bold('Mana requerido:')} ${item.requiredMana} ${formatEmoji(Icons.Mana)}`;
        }
        else if (category == 'consumables') {
            itemStr = `${bold(item.type.toUpperCase())}\n(+) ${item.amount}\n\n**Precio:** ${item.price} ${Icons.Gold}`;
        }
        const confirmationEmbed = new EmbedBuilder()
            .setTitle('Nora')
            .setColor('#C600FF')
            .setDescription('Vas a comprar eso?');
        const itemEmbed = new EmbedBuilder()
            .setTitle('__' + item.name + '__')
            .setColor('#C600FF')
            .setDescription(itemStr);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`buyInfoBtnAccept-${category}|${category.slice(0, -1)}${itemId}-/${interaction.user.id}`)
                .setLabel('Confirmar compra')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Success),
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('buyInfoBtnReject')
                .setLabel('Rechazar compra')
                .setEmoji('⛔')
                .setStyle(ButtonStyle.Danger),
        );
        interaction.editReply({ embeds: [ confirmationEmbed, itemEmbed ], components: [ row, row2 ], fetchReply: true })
            .then(() => {
                interaction.channel.awaitMessages({ filter, max: 1, time: 20000, errors: [ 'time' ] })
                    .then(async collected => {
                        if (collected.first().content.toLowerCase() == 'confirmar') {
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

                                    const docSnap = await getDoc(doc(db, collected.first().author.id, 'PlayerInfo/Inventory/Equipment'));
                                    let itemAmount;
                                    if (docSnap.exists()) {
                                        if (!docSnap?.data()?.[ `${category}` ]) {
                                            await updateDoc(doc(db, collected.first().author.id, 'PlayerInfo/Inventory/Equipment'), {
                                                [ category ]: { amount: 0 },
                                            }, { merge: true });
                                        }
                                        itemAmount = docSnap.data()[ `${category}` ]?.amount || 0;
                                    }
                                    console.log(itemAmount);

                                    item = { ...item, id: itemAmount + 1 };
                                    if (category == 'consumables') {
                                        await updateDoc(doc(db, collected.first().author.id, 'PlayerInfo/Inventory/Equipment'), {
                                            [ category ]: { ...docSnap.data()?.[ `${category}` ], amount: itemAmount + 1, [ `${category.slice(0, -1)}${itemAmount + 1}` ]: item },
                                        }, { merge: true });
                                        await updateDoc(doc(db, collected.first().author.id, 'PlayerInfo/Inventory/Equipment'), {
                                            [ `${category}.${category.slice(0, -1)}${itemAmount + 1}.consumableAmount` ]: increment(1),
                                        }, { merge: true });
                                    }
                                    else {
                                        await updateDoc(doc(db, collected.first().author.id, 'PlayerInfo/Inventory/Equipment'), {
                                            [ category ]: { ...docSnap.data()?.[ `${category}` ], amount: itemAmount + 1, [ `${category.slice(0, -1)}${itemAmount + 1}` ]: item },
                                        }, { merge: true });
                                    }
                                    collected.first().reply({ embeds: [ goldEmbed, thanksEmbed ], components: [ dialogEnd ] });
                                    const infoEmbed = new EmbedBuilder()
                                        .setTitle('Informacion')
                                        .setDescription('Debido a los siguientes tres tontitos que no quisieron leer o no tuvieron suficiente IQ para entender, ahora **ya es posible usar los botones para confirmar o rechazar tu compra:**\n- **Contodorespeto (En especial este)**\n- Erziok\n- Joang\n\nSolo hazle clic a los botones respectivos!')
                                        .setColor('Red');
                                    interaction.followUp({ embeds: [ infoEmbed ], ephemeral: true });
                                    return;
                                }).catch(error => {
                                    if (error.errorCode == EventErrors.NotEnoughGold) {
                                        const goldErrorEmbed = new EmbedBuilder()
                                            .setTitle('Nora')
                                            .setColor('#C600FF')
                                            .setDescription('Compra algo mas barato o vuelve cuando tengas mas oro!!');
                                        return collected.first().reply({ embeds: [ error.errorEmbed, goldErrorEmbed ] });
                                    }
                                });
                        }
                        else {
                            const rejectedEmbed = new EmbedBuilder()
                                .setTitle('Nora')
                                .setColor('#C600FF')
                                .setDescription('Mira lo que te gusta y seleccionalo!\nY deja de desperdiciar mi tiempo.');
                            return collected.first().reply({ embeds: [ rejectedEmbed ] });
                        }
                    }).catch(() => {
                        const rejectedEmbed = new EmbedBuilder()
                            .setTitle('Nora')
                            .setColor('#C600FF')
                            .setDescription('Mira lo que te gusta y seleccionalo!\nY deja de desperdiciar mi tiempo.');
                        return interaction.followUp({ embeds: [ rejectedEmbed ] });
                    });
            });
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    },
};