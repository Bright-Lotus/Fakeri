const { getFirestore, doc, setDoc, updateDoc, getDoc, increment, arrayUnion, Timestamp, addDoc, collection, deleteDoc, deleteField } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const { contextMenuExecute } = require('../commands/christmas.js');
const { EmbedBuilder, bold, underscore, formatEmoji, chatInputApplicationCommandMention, time, TimestampStyles } = require('discord.js');
const { attack } = require('../handlers/attackHandler.js');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const { healthManager } = require('../handlers/healthHandler.js');
const { Abilities } = require('../emums/abilities.js');
const { pagination } = require('../handlers/paginationHandler.js');
const { ability } = require('../handlers/abilityHandler.js');
const { dialogHandler } = require('../handlers/dialogHandler.js');
const { targetHandler } = require('../handlers/targetHandler.js');
const { Icons } = require('../emums/icons.js');
const { CommandIds } = require('../emums/commandIds.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isSelectMenu()) return;
        if (interaction.customId.includes('shopModal-selectMenu')) return;

        /*  The following if code snippet
        Checks if the creator of the components,
        Is the same as the one who triggered the interaction
            if (interaction.user.id != interaction.customId.split('/')[1]) {
                return interaction.reply({ embeds: [ErrorEmbed(EventErrors.NotOwnerOfInteraction)], ephemeral: true });
            }
        */
        // If the user selected an ability orb from the ability select menu
        if (interaction.customId.includes('abilityModal-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }
            // Target handler is for proccessing the target of the ability
            await targetHandler(interaction);
            return;
        }

        // This handles the target of the ally ability
        if (interaction.customId.includes('allyTarget-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }

            const idSplit = interaction.values[ 0 ].split('-');
            const target = idSplit[ 3 ];
            const abilityID = idSplit[ 4 ];

            await ability(abilityID, target, interaction.user).then(results => {
                const orbUsedEmbed = new EmbedBuilder()
                    .setTitle('Has usado la habilidad seleccionada!')
                    .setColor('Blue')
                    .setDescription(`Mana restante: **${results.manaRemaining}** ${formatEmoji(Icons.Mana)}`);
                interaction.reply({ embeds: [ orbUsedEmbed ], ephemeral: true });
            }).catch(results => {
                interaction.reply({ embeds: [ results.manaEmbed ], ephemeral: true });
            });
            return;
        }

        // Handling equiping a bow
        if (interaction.customId.includes('inventoryBowsModal-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }

            // Get the bow ID from the interaction values
            const bowID = interaction.values[ 0 ].split('-')[ 3 ];

            // Get the equipment of the user from the database
            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (equipment.exists()) {
                // Get the bow from the equipment
                const bow = equipment.data().bows[ `bow${bowID}` ];
                const bowStats = bow.stats;
                // Get the currently equipped bow
                // Should return a number, that number is the ID from the equipment
                const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));

                // This is for removing the stats of the currently equipped bow
                if (equipped.exists()) {
                    if (equipped.data().sword?.id) {
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            [ 'stats.atk' ]: increment(-Math.abs(bowStats.atk)),
                        }, { merge: true });

                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            [ 'stats.speed' ]: increment(-Math.abs(bowStats.spd)),
                        }, { merge: true });
                    }
                }
                // Sets the bow ID to the equipped bow
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                    [ 'bow' ]: { id: bowID },
                }, { merge: true });

                // Adds the stats of the bow to the player stats
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    [ 'stats.atk' ]: increment(bowStats.atk),
                }, { merge: true });

                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    [ 'stats.speed' ]: increment(bowStats.spd),
                }, { merge: true });

                // If the bow has perks, add them to the onAttack array
                if (bow?.perks) {
                    const itemPerks = [];
                    Object.values(bow.perks).forEach(async perk => {
                        itemPerks.push({ perkRatio: perk.ratio, perk: perk.perk });
                    });
                    await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                        [ 'onAttack' ]: itemPerks,
                    }, { merge: true });
                }

                // Send a message to the user saying that the bow has been equipped
                const equippedEmbed = new EmbedBuilder()
                    .setTitle('Se ha equipado el arco exitosamente!')
                    .setColor('Green')
                    .setDescription(`Se ha equipado ${bow.name}\n\n+${bowStats.atk} - ATK\n+${bowStats.spd} - SPD`);
                interaction.reply({ embeds: [ equippedEmbed ] });
            }
            return;
        }

        // This does the exact same time as the bow equiping but for armor plates
        if (interaction.customId.includes('inventoryArmorPlatesModal-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }
            const armorPlateID = interaction.values[ 0 ].split('-')[ 3 ];
            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (equipment.exists()) {
                const armorPlate = equipment.data().armorPlates[ `armorPlate${armorPlateID}` ];
                const armorPlateStats = armorPlate.stats;
                const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));

                if (equipped.exists()) {
                    if (equipped.data().sword?.id) {
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            [ 'stats.armor' ]: increment(-Math.abs(armorPlateStats.armor)),
                            [ 'stats.magicDurability' ]: increment(-Math.abs(armorPlateStats.magicDurability)),
                            [ 'stats.maxHp' ]: increment(-Math.abs(armorPlateStats.maxHp)),
                        }, { merge: true });

                    }
                }
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                    [ 'armorPlate' ]: { id: armorPlateID },
                }, { merge: true });

                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    [ 'stats.armor' ]: increment(armorPlateStats.armor),
                    [ 'stats.magicDurability' ]: increment(armorPlateStats.magicDurability),
                    [ 'stats.maxHp' ]: increment(Math.abs(armorPlateStats.maxHp)),
                }, { merge: true });


                if (armorPlate?.perks) {
                    const itemPerks = [];
                    Object.values(armorPlate.perks).forEach(async perk => {
                        itemPerks.push({ perkRatio: perk.ratio, perk: perk.perk });
                    });
                    await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                        [ 'onEnemyAttack' ]: itemPerks,
                    }, { merge: true });
                }

                const equippedEmbed = new EmbedBuilder()
                    .setTitle('Se ha equipado la armadura exitosamente!')
                    .setColor('Green')
                    .setDescription(`Se ha equipado ${armorPlate.name}\n\n+${armorPlateStats.armor} - Armor\n+${armorPlateStats.magicDurability} - Magic DURABILITY`);
                interaction.reply({ embeds: [ equippedEmbed ] });
            }
            return;
        }

        // This does the exact same as the bow equiping but for wands and so on with every 'inventory' modal
        if (interaction.customId.includes('inventoryWandsModal-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }
            const wandID = interaction.values[ 0 ].split('-')[ 3 ];
            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (equipment.exists()) {
                const wand = equipment.data().wands[ `wand${wandID}` ];
                const wandStats = wand.stats;
                const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));

                if (equipped.exists()) {
                    if (equipped.data().sword?.id) {
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            [ 'stats.manaPerAttack' ]: increment(-Math.abs(wandStats.mana)),
                        }, { merge: true });

                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            [ 'stats.magicStrength' ]: increment(-Math.abs(wandStats.magicStrength)),
                        }, { merge: true });
                    }
                }
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                    [ 'wand' ]: { id: wandID },
                }, { merge: true });

                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    [ 'stats.manaPerAttack' ]: increment(wandStats.mana),
                }, { merge: true });

                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    [ 'stats.magicStrength' ]: increment(wandStats.magicStrength),
                }, { merge: true });

                if (wand?.perks) {
                    const itemPerks = [];
                    Object.values(wand.perks).forEach(async perk => {
                        itemPerks.push({ perkRatio: perk.ratio, perk: perk.perk });
                    });
                    await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                        [ 'onAttack' ]: itemPerks,
                    }, { merge: true });
                }

                const equippedEmbed = new EmbedBuilder()
                    .setTitle('Se ha equipado la varita exitosamente!')
                    .setColor('Green')
                    .setDescription(`Se ha equipado ${wand.name}\n\n+${wandStats.manaPerAttack} - Mana PER ATTACK\n+${wandStats.magicStrength} - Magic STRENGTH`);
                interaction.reply({ embeds: [ equippedEmbed ] });
            }
            return;
        }

        // This is different than the others because it is related to ability orbs
        if (interaction.customId.includes('inventoryAbilityOrbsModal')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }
            // This is the ID of the ability orb
            const abilityOrbID = interaction.values[ 0 ].split('-')[ 4 ];
            // Get the equipment of the user
            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (equipment.exists()) {
                // Get the ability orb from the equipment
                const abilityOrb = equipment.data().abilityOrbs[ `abilityOrb${abilityOrbID}` ];
                // Get the equipped ID of the ability orb
                const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));

                if (equipped.exists()) {
                    if (equipped.data()?.abilityOrbs[ interaction.customId.split('-')[ 1 ] ]) {
                        const abilityOrbEquipped = equipment.data().abilityOrbs[ `abilityOrb${equipped.data()?.abilityOrbs[ interaction.customId.split('-')[ 1 ] ]}` ];
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                            [ `abilityOrbs.abilityOrb${equipped.data()?.abilityOrbs[ interaction.customId.split('-')[ 1 ] ]}.requiredMana` ]: abilityOrbEquipped?.staticMana,
                        }, { merge: true });
                    }
                }
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                    [ 'abilityOrbs' ]: { ...equipped.data().abilityOrbs, [ interaction.customId.split('-')[ 1 ] ]: abilityOrbID },
                }, { merge: true });

                const playerInfo = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
                let ratio = (playerInfo.data().class != 'enchanter') ? 0.7 : 0.65;
                if (interaction.customId.split('-')[ 1 ] == 'orb5') ratio -= 0.3;
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                    [ `abilityOrbs.abilityOrb${abilityOrbID}.requiredMana` ]: Math.round(abilityOrb.requiredMana * ratio),
                }, { merge: true });

                const equippedEmbed = new EmbedBuilder()
                    .setTitle('Se ha equipado el orbe de habilidad exitosamente!')
                    .setColor('Green')
                    .setDescription(`Se ha equipado ${abilityOrb.name}, en la ranura 1.\n\n${abilityOrb.desc}`);
                interaction.reply({ embeds: [ equippedEmbed ] });
            }
            return;
        }

        if (interaction.customId.includes('consumable-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }
            const consumableID = interaction.values[ 0 ].split('-')[ 2 ];
            const playerEquipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (playerEquipment.exists()) {
                const consumable = playerEquipment.data().consumables[ `consumable${consumableID}` ];
                switch (consumable.type) {
                    case 'heal': {
                        if (consumable.consumableAmount == 0) {
                            const noMoreConsumableEmbed = new EmbedBuilder()
                                .setTitle('Ya no tienes mas de este consumible')
                                .setColor('Red')
                                .setDescription(`Puedes usar ${chatInputApplicationCommandMention('shop', CommandIds.Shop)} para comprar mas`);
                            interaction.reply({ embeds: [ noMoreConsumableEmbed ] });
                            return;
                        }
                        const healEmbed = new EmbedBuilder()
                            .setTitle('Has usado el consumible')
                            .setColor('Green')
                            .setDescription(`Te has curado ${bold(consumable.amount)} ${formatEmoji(Icons.Heal)}`);
                        interaction.reply({ embeds: [ healEmbed ] });
                        const playerStats = await (await getDoc(doc(db, interaction.user.id, 'PlayerInfo'))).data().stats;
                        if (playerStats.hp + consumable.amount > playerStats.maxHp) {
                            await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                                [ 'stats.hp' ]: playerStats.maxHp,
                            }, { merge: true });
                            await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                                [ `consumables.consumable${consumableID}.consumableAmount` ]: (consumable.consumableAmount != 0) ? increment(-1) : 0,
                            }, { merge: true });
                            return;
                        }
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            [ 'stats.hp' ]: increment(consumable.amount),
                        }, { merge: true });
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                            [ `consumables.consumable${consumableID}.consumableAmount` ]: (consumable.consumableAmount != 0) ? increment(-1) : 0,
                        }, { merge: true });
                        if ((consumable.consumableAmount - 1) == 0) {
                            await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                                [ `consumables.consumable${consumableID}` ]: deleteField(),
                            }, { merge: true });
                        }
                        break;
                    }

                    case 'mana': {
                        if (consumable.consumableAmount == 0) {
                            const noMoreConsumableEmbed = new EmbedBuilder()
                                .setTitle('Ya no tienes mas de este consumible')
                                .setColor('Red')
                                .setDescription(`Puedes usar ${chatInputApplicationCommandMention('shop', CommandIds.Shop)} para comprar mas`);
                            interaction.reply({ embeds: [ noMoreConsumableEmbed ] });
                            return;
                        }

                        const manaEmbed = new EmbedBuilder()
                            .setTitle('Has usado el consumible')
                            .setColor('Blue')
                            .setDescription(`Has obtenido ${bold(consumable.amount)} ${formatEmoji(Icons.Mana)}`);
                        interaction.reply({ embeds: [ manaEmbed ] });
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            [ 'stats.mana' ]: increment(consumable.amount),
                        }, { merge: true });
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                            [ `consumables.consumable${consumableID}.consumableAmount` ]: (consumable.consumableAmount != 0) ? increment(-1) : 0,
                        }, { merge: true });
                        if ((consumable.consumableAmount - 1) == 0) {
                            await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                                [ `consumables.consumable${consumableID}` ]: deleteField(),
                            }, { merge: true });
                        }
                        break;
                    }
                }
            }
            return;
        }

        if (interaction.customId.includes('inventorySwordsModal-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }
            const swordID = interaction.values[ 0 ].split('-')[ 3 ];
            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (equipment.exists()) {
                const sword = equipment.data().swords[ `sword${swordID}` ];
                const swordStats = sword.stats;
                const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));

                if (equipped.exists()) {
                    if (equipped.data().sword?.id) {
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            [ 'stats.atk' ]: increment(-Math.abs(swordStats.atk)),
                        }, { merge: true });

                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            [ 'stats.speed' ]: increment(-Math.abs(swordStats.spd)),
                        }, { merge: true });
                    }
                }
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                    [ 'sword' ]: { id: swordID },
                }, { merge: true });

                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    [ 'stats.atk' ]: increment(swordStats.atk),
                }, { merge: true });

                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    [ 'stats.speed' ]: increment(swordStats.spd),
                }, { merge: true });

                if (sword?.perks) {
                    const itemPerks = [];
                    Object.values(sword.perks).forEach(async perk => {
                        itemPerks.push({ perkRatio: perk.ratio, perk: perk.perk });
                    });
                    await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                        [ 'onAttack' ]: itemPerks,
                    }, { merge: true });
                }

                const equippedEmbed = new EmbedBuilder()
                    .setTitle('Se ha equipado la espada exitosamente!')
                    .setColor('Green')
                    .setDescription(`Se ha equipado ${sword.name}\n\n+${swordStats.atk} - ATK\n+${swordStats.spd} - SPD`);
                interaction.reply({ embeds: [ equippedEmbed ] });
            }
            return;
        }


        if (interaction.customId.includes('battleFlow-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }
            const playerInfo = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
            const idSplit = interaction.values[ 0 ].split('-');
            const enemy = idSplit[ 3 ];
            const enemyHp = idSplit[ 4 ];
            const enemyAtk = idSplit[ 5 ];
            const enemySpd = idSplit[ 6 ];
            const enemyArmor = idSplit[ 7 ];
            const enemyMagicDurability = idSplit[ 8 ];
            const enemyElite = idSplit[ 9 ];
            const enemyXp = Number(idSplit[ 10 ]);
            const enemyGold = Number(idSplit[ 11 ]);
            let turn = idSplit[ 12 ];
            const keywords = idSplit[ 13 ].split('/').filter(element => element != '');
            const keywordsArray = [];
            keywords.forEach(element => {
                const keywordObj = {
                    type: element.split(':')[ 0 ] || 0,
                    subtype: element.split(':')[ 1 ] || 0,
                    ratio: element.split(':')[ 2 ] || 0,
                };
                if (keywordObj.type !== 0 && keywordObj.subtype !== 0) {
                    keywordsArray.push(keywordObj);
                }
            });
            let enemyUnique;

            const activeBattles = await getDoc(doc(db, interaction.user.id, 'ActiveBattles'));
            if (activeBattles.exists()) {

                if ((activeBattles.data()?.battles.amount + 1) > 3) {
                    const errorEmbed = ErrorEmbed(EventErrors.BattleLimitReached);
                    return interaction.reply({ embeds: [ errorEmbed ] });
                }

                enemyUnique = activeBattles.data().battles.amount;
            }

            const enemyAttackedEmbed = new EmbedBuilder()
                .setColor('Red')
                .addFields(
                    { name: `_                          _${formatEmoji(Icons.EnemyAttack)}                         _ _\n╔═════════════════╗\n█     ${bold('Tu enemigo ha atacado')}    █ \n▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`, value: '_ _' },
                );
            const messageEmbeds = [];
            const battleStartEmbed = new EmbedBuilder()
                .setTitle('Batalla empezada con el enemigo seleccionado!')
                .setDescription('Escribe "attack" de nuevo para atacar a este enemigo.')
                .setColor('Green');
            messageEmbeds.push(battleStartEmbed);
            await updateDoc(doc(db, interaction.user.id, 'ActiveBattles'), {
                [ 'battles.amount' ]: increment(1),
            }, { merge: true });
            const debuffs = [];
            if (playerInfo.data().class == 'archer') {
                turn = 'player';
                debuffs.push({ type: 'archerDebuff', turns: 1 });
            }

            await updateDoc(doc(db, interaction.user.id, 'ActiveBattles'), {
                [ `battles.battle${enemyUnique}` ]: {
                    enemyId: enemy,
                    enemyHp: enemyHp,
                    enemyMaxHp: enemyHp,
                    enemyAtk: enemyAtk,
                    enemyArmor: enemyArmor,
                    enemySpd: enemySpd,
                    enemyMagicDurability: enemyMagicDurability,
                    enemyElite: enemyElite,
                    enemyXp: enemyXp,
                    enemyGold: enemyGold,
                    turn: turn,
                    enemyUnique: enemyUnique,
                    keywords: keywordsArray,
                    debuffs: debuffs,
                    turnsUntilAbility: 3,
                },
            }, { merge: true }).then(async () => {
                if (turn == 'enemy') {
                    const channel = await getDoc(doc(db, interaction.guildId, 'FarmChannels'));
                    let farmChannel;
                    for await (const farmChnnl of Object.values(channel.data())) {
                        console.log('🚀 ~ file: interactionCreateSelectMenu.js:279 ~ forawait ~ farmChnnl', farmChnnl, interaction.channelId, farmChannel);
                        if (farmChnnl?.id == interaction?.channelId) {
                            farmChannel = farmChnnl;
                        }
                    }
                    console.log('🚀 ~ file: interactionCreateSelectMenu.js:284 ~ forawait ~ farmChannel', interaction.channelId, farmChannel);
                    await attack(interaction.user, enemyUnique, interaction.client, farmChannel).then(async (results) => {
                        if (results.enemyAttacked) {
                            enemyAttackedEmbed.addFields(
                                { name: bold('<             Daño recibido               >'), value: `${results.damageReceived}` },
                                { name: bold('<              Vida restante               >'), value: `${results.remainingHp}` },
                            );
                            messageEmbeds.push(enemyAttackedEmbed);
                        }
                    }).catch(async (results) => {
                        enemyAttackedEmbed.addFields(
                            { name: bold('<             Daño recibido               >'), value: `${results.damageReceived}` },
                            { name: bold('<              Vida restante               >'), value: '0' },
                        );
                        const deadEmbed = new EmbedBuilder()
                            .setTitle('Has muerto!')
                            .setColor('Red')
                            .setDescription(`No puedes hacer nada hasta que revivas.\n${bold('Reviviras en 8 mega-revers.')}`);
                        await interaction.user.send({ embeds: [ deadEmbed ] });
                        await updateDoc(doc(db, 'Event/Timeouts'), {
                            [ 'timestamps' ]: arrayUnion({
                                timeoutDate: Timestamp.fromMillis(new Date().setHours(new Date().getHours() + 4)),
                                type: 'revive',
                                target: interaction.user.id,
                            }),
                        }, { merge: true });

                        setTimeout(async (user, hpManager) => {
                            await hpManager('revive', user);
                            user.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Has revivido!')
                                        .setDescription('Ya puedes usar acciones de nuevo')
                                        .setColor('Green'),
                                ],
                            });
                        }, (36e5 * 4), interaction.user, healthManager);
                        messageEmbeds.push(enemyAttackedEmbed);
                    });
                }
            });
            return interaction.reply({ embeds: messageEmbeds });
        }
        if (interaction.customId.includes('battleFlow-selectMenu-activeBattle/')) {
            console.log(interaction.customId.split('-'), 'debug202');

            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }
            await interaction.deferReply();
            const idSplit = interaction.values[ 0 ].split('-');
            console.log(idSplit, 'interaction debug select flow');
            const enemyUnique = idSplit[ 4 ];
            console.log(enemyUnique, 'debugunique');
            const playerInfo = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
            if (playerInfo.data().attackOnCooldown) {
                return interaction.editReply({ embeds: [ ErrorEmbed(EventErrors.AttackOnCooldown, `Puedes atacar ${time(new Timestamp(playerInfo.data().attackCooldown.seconds, playerInfo.data().attackCooldown.nanoseconds).toDate(), TimestampStyles.RelativeTime)}`) ], ephemeral: true });
            }
            console.log(idSplit[ 1 ], 'love');
            if (idSplit[ 1 ] == 'chargeAttack') {
                await updateDoc(doc(db, interaction.user.id, 'ActiveBattles'), {
                    [ `battles.battle${idSplit[ 4 ]}.turn` ]: 'enemy',
                }, { merge: true });
                const playerAtk = await (await getDoc(doc(db, interaction.user.id, 'PlayerInfo'))).data().stats.atk;
                const bonus = playerAtk / 100 * 200;
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    [ 'stats.atk' ]: bonus,
                }, { merge: true });
                const activeBuffs = {
                    buff: `increasedAtk:${playerAtk}`,
                    attacks: 1,
                };
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    [ 'activeBuffs' ]: arrayUnion(activeBuffs),
                }, { merge: true });
                const replyEmbeds = [];
                const enemyAttackedEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .addFields(
                        { name: `_                          _${formatEmoji(Icons.EnemyAttack)}                         _ _\n╔═════════════════╗\n█     ${bold('Tu enemigo ha atacado')}    █ \n▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`, value: '_ _' },
                    );
                const chargeEmbed = new EmbedBuilder()
                    .setTitle('Has cargado un ataque poderoso contra el enemigo')
                    .setDescription('Atacalo de nuevo!')
                    .setColor('Red');
                replyEmbeds.push(chargeEmbed);
                const channel = await getDoc(doc(db, interaction.guildId, 'FarmChannels'));
                let farmChannel;
                for await (const farmChnnl of Object.values(channel.data())) {
                    if (farmChnnl.id == interaction.channelId) {
                        farmChannel = farmChnnl;
                    }
                }
                await attack(interaction.user, idSplit[ 4 ], interaction.client, farmChannel).then(async (results) => {
                    if (results.enemyAttacked) {
                        enemyAttackedEmbed.addFields(
                            { name: bold('<             Daño recibido               >'), value: `${results.damageReceived}` },
                            { name: bold('<              Vida restante               >'), value: `${results.remainingHp}` },
                        );
                        replyEmbeds.push(enemyAttackedEmbed);
                    }

                }).catch(async (results) => {
                    enemyAttackedEmbed.addFields(
                        { name: bold('<             Daño recibido               >'), value: `${results.damageReceived}` },
                        { name: bold('<              Vida restante               >'), value: '0' },
                    );
                    const deadEmbed = new EmbedBuilder()
                        .setTitle('Has muerto!')
                        .setColor('Red')
                        .setDescription(`No puedes hacer nada hasta que revivas.\n${bold('Reviviras en 8 mega-revers.')}`);
                    await interaction.user.send({ embeds: [ deadEmbed ] });
                    await updateDoc(doc(db, 'Event/Timeouts'), {
                        [ 'timestamps' ]: arrayUnion({
                            timeoutDate: Timestamp.fromMillis(new Date().setHours(new Date().getHours() + 4)),
                            type: 'revive',
                            target: interaction.user.id,
                        }),
                    }, { merge: true });

                    setTimeout(async (user, hpManager) => {
                        await hpManager('revive', user);
                        user.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Has revivido!')
                                    .setDescription('Ya puedes usar acciones de nuevo')
                                    .setColor('Green'),
                            ],
                        });
                    }, (36e5 * 4), interaction.user, healthManager);
                    replyEmbeds.push(enemyAttackedEmbed);
                });
                interaction.editReply({ embeds: replyEmbeds });
                return;
            }
            if (idSplit[ 1 ] === 'ability') {
                if (idSplit[ 6 ]?.trim() != '') {
                    const enemyAttackedEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .addFields(
                            { name: `_                          _${formatEmoji(Icons.EnemyAttack)}                         _ _\n╔═════════════════╗\n█     ${bold('Tu enemigo ha atacado')}    █ \n▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`, value: '_ _' },
                        );
                    const orbUsed = new EmbedBuilder()
                        .setTitle('Orbe usada')
                        .setDescription('Has usado el orbe seleccionada');
                    interaction.editReply({ embeds: [ orbUsed ] });
                    await ability(idSplit[ 6 ], idSplit[ 4 ], interaction.user);
                    await updateDoc(doc(db, interaction.user.id, 'ActiveBattles'), {
                        [ `battles.battle${idSplit[ 4 ]}.turn` ]: 'enemy',
                    }, { merge: true });

                    const channel = await getDoc(doc(db, interaction.guildId, 'FarmChannels'));
                    let farmChannel;
                    for await (const farmChnnl of Object.values(channel.data())) {
                        if (farmChnnl.id == interaction.channelId) {
                            farmChannel = farmChnnl;
                        }
                    }
                    await attack(interaction.user, idSplit[ 4 ], interaction.client, farmChannel).then(async (results) => {
                        if (results.enemyAttacked) {
                            enemyAttackedEmbed.addFields(
                                { name: bold('<             Daño recibido               >'), value: `${results.damageReceived}` },
                                { name: bold('<              Vida restante               >'), value: `${results.remainingHp}` },
                            );
                            messageEmbeds.push(enemyAttackedEmbed);
                        }
                    }).catch(async (results) => {
                        enemyAttackedEmbed.addFields(
                            { name: bold('<             Daño recibido               >'), value: `${results.damageReceived}` },
                            { name: bold('<              Vida restante               >'), value: '0' },
                        );
                        const deadEmbed = new EmbedBuilder()
                            .setTitle('Has muerto!')
                            .setColor('Red')
                            .setDescription(`No puedes hacer nada hasta que revivas.\n${bold('Reviviras en 8 mega-revers.')}`);
                        await interaction.user.send({ embeds: [ deadEmbed ] });
                        await updateDoc(doc(db, 'Event/Timeouts'), {
                            [ 'timestamps' ]: arrayUnion({
                                timeoutDate: Timestamp.fromMillis(new Date().setHours(new Date().getHours() + 4)),
                                type: 'revive',
                                target: interaction.user.id,
                            }),
                        }, { merge: true });

                        setTimeout(async (user, hpManager) => {
                            await hpManager('revive', user);
                            user.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle('Has revivido!')
                                        .setDescription('Ya puedes usar acciones de nuevo')
                                        .setColor('Green'),
                                ],
                            });
                        }, (36e5 * 4), interaction.user, healthManager);
                        messageEmbeds.push(enemyAttackedEmbed);
                    });
                    return;
                }
                const playerEquipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
                if (playerEquipment.exists()) {
                    if (playerInfo.exists()) {
                        const playerMana = playerInfo.data().stats.mana;
                        const abilityOrbs = playerEquipment.data().abilityOrbs;
                        const abilityOrbsArray = Object.values(abilityOrbs).filter(element => (typeof element != 'number'));
                        await pagination('abilityOrbs', abilityOrbsArray, 1, interaction.user, { currentMana: playerMana, enemyUnique: enemyUnique }).then(results => {
                            return interaction.editReply({ embeds: [ results.embed ], components: [ results.paginationRow, results.selectMenuRow ] });
                        });
                    }

                }
                return;
            }

            const messageEmbeds = [];

            const guildFarmChannels = await getDoc(doc(db, interaction.guildId, 'FarmChannels'));
            let farmChannel;
            for await (const farmChnnl of Object.values(guildFarmChannels.data())) {
                if (farmChnnl.id == interaction.channelId) {
                    farmChannel = farmChnnl;
                }
            }
            await attack(interaction.user, enemyUnique, interaction.client, farmChannel).then(async (results) => {
                console.log(results, 'debugresults');
                if (results?.enemyKilled) {
                    const killedEmbed = new EmbedBuilder()
                        .setTitle('Has matado al enemigo!')
                        .setColor('Random')
                        .addFields(
                            { name: bold('Daño hecho'), value: `${results.damageDone}` },
                            { name: bold(`Recompensas | ${underscore('XP')}:`), value: underscore(results.xp) },
                            { name: bold(`Recompensas | ${underscore('Oro')}:`), value: underscore(results.gold) },
                        );

                    if (results?.enemySplitted) {
                        const splitEmbed = new EmbedBuilder()
                            .setTitle('El enemigo se ha dividido en 2!')
                            .setDescription('Tienes dos nuevas batallas activas.')
                            .setColor('Red');
                        await interaction.editReply({ embeds: [ killedEmbed, splitEmbed ] });
                        return;
                    }
                    await interaction.editReply({ embeds: [ killedEmbed ] });
                    return;
                }


                const damageDone = `${results.damageDone}`;
                const damageEmbed = new EmbedBuilder()
                    // .setTitle(`Has atacado al enemigo! ${formatEmoji(Icons.PlayerAttack)}`)
                    .setColor('Blue')
                    .addFields(
                        { name: bold('<                Daño hecho                 >'), value: damageDone },
                        { name: bold('<   Vida restante del enemigo  >'), value: `${results.enemyHpRemaining}\n▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄` },
                        { name: `█   ${bold('Has atacado al enemigo')}    █\n╚═════════════════╝\n _                        _ ${formatEmoji(Icons.PlayerAttack)}                         _ _ \n`, value: '_ _' },
                    );


                messageEmbeds.push(damageEmbed);

                const enemyAttackedEmbed = new EmbedBuilder()
                    .setColor('Red')
                    .addFields(
                        { name: `_                          _${formatEmoji(Icons.EnemyAttack)}                         _ _\n╔═════════════════╗\n█     ${bold('Tu enemigo ha atacado')}    █ \n▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`, value: '_ _' },
                    );

                await attack(interaction.user, enemyUnique, interaction.client, farmChannel).then(async (resultsEnemy) => {
                    if (resultsEnemy.enemyAttacked) {
                        enemyAttackedEmbed.addFields(
                            { name: bold('<             Daño recibido               >'), value: `${resultsEnemy.damageReceived}` },
                            { name: bold('<              Vida restante               >'), value: `${resultsEnemy.remainingHp}` },
                        );
                        messageEmbeds.push(enemyAttackedEmbed);
                    }
                    else {
                        enemyAttackedEmbed
                            .setColor('#D4D4D4')
                            .setFields(
                                { name: `_                          _${formatEmoji(Icons.CantAttack)}                         _ _\n╔═════════════════╗\n█     ${bold('Tu enemigo no te ataco')}    █ \n▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`, value: '_ _' },
                                { name: bold('<             Daño recibido               >'), value: '0' },
                                { name: bold('<              Vida restante               >'), value: `${playerInfo.data().stats.hp}` },
                            );
                        messageEmbeds.push(enemyAttackedEmbed);
                    }
                }).catch(async (resultsDead) => {
                    enemyAttackedEmbed.addFields(
                        { name: bold('<             Daño recibido               >'), value: `${resultsDead.damageReceived}` },
                        { name: bold('<              Vida restante               >'), value: `${resultsDead.remainingHp}` },
                    );
                    const deadEmbed = new EmbedBuilder()
                        .setTitle('Has muerto!')
                        .setColor('Red')
                        .setDescription(`No puedes hacer nada hasta que revivas.\n${bold('Reviviras en 8 mega-revers.')}`);
                    await interaction.user.send({ embeds: [ deadEmbed ] });
                    await updateDoc(doc(db, 'Event/Timeouts'), {
                        [ 'timestamps' ]: arrayUnion({
                            timeoutDate: Timestamp.fromMillis(new Date().setHours(new Date().getHours() + 4)),
                            type: 'revive',
                            target: interaction.user.id,
                        }),
                    }, { merge: true });

                    setTimeout(async (user, hpManager) => {
                        await hpManager('revive', user);
                        user.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle('Has revivido!')
                                    .setDescription('Ya puedes usar acciones de nuevo')
                                    .setColor('Green'),
                            ],
                        });
                    }, (36e5 * 4), interaction.user, healthManager);
                    messageEmbeds.push(enemyAttackedEmbed);
                });
                return await interaction.editReply({ embeds: messageEmbeds });
            }).catch(async (results) => {
                const deadEmbed = new EmbedBuilder()
                    .setTitle('Has muerto!')
                    .setColor('Red')
                    .setDescription(`No puedes hacer nada hasta que revivas.\n${bold('Reviviras en 8 mega-revers.')}`);
                await interaction.user.send({ embeds: [ deadEmbed ] });
                await updateDoc(doc(db, 'Event/Timeouts'), {
                    [ 'timestamps' ]: arrayUnion({
                        timeoutDate: Timestamp.fromMillis(new Date().setHours(new Date().getHours() + 4)),
                        type: 'revive',
                        target: interaction.user.id,
                    }),
                }, { merge: true });

                setTimeout(async (user, hpManager) => {
                    await hpManager('revive', user);
                    user.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Has revivido!')
                                .setDescription('Ya puedes usar acciones de nuevo')
                                .setColor('Green'),
                        ],
                    });
                }, (36e5 * 4), interaction.user, healthManager);
            });
            return;
        }

        if (interaction.customId.includes('class-select/')) {
            if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
                return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
            }
            await interaction.deferUpdate();
            await classSelect(interaction);
            return;
        }
        if (interaction.user.id != interaction.customId.split('/')[ 1 ]) {
            return interaction.reply({ embeds: [ ErrorEmbed(EventErrors.NotOwnerOfInteraction) ], ephemeral: true });
        }
        await interaction.deferUpdate();
        contextMenuExecute(interaction, interaction.values[ 0 ]);
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    },
};

async function classSelect(interaction) {

    const selectedClass = interaction.values[ 0 ];

    const embed = new EmbedBuilder()
        .setTitle('El Destino te ha dado tu camino')
        .setAuthor({ name: 'Piedra del Destino' })
        .setDescription(`Te ha sido dado ${selectedClass}!`)
        .setColor('#ffffff');
    interaction.editReply({ embeds: [ embed ], components: [] });
    await dialogHandler('postRegisterTutorial', 1, interaction, '', 'register', { replied: true });
    const warriorStats = {
        atk: 50,
        hp: 200,
        maxHp: 200,
        armor: 25,
        magicDurability: 20,
        mana: 5,
        manaPerAttack: 20,
        speed: 15,
        xp: 0,
    };

    const archerStats = {
        atk: 40,
        hp: 190,
        maxHp: 190,
        armor: 20,
        mana: 5,
        manaPerAttack: 20,
        speed: 50,
        magicDurability: 15,
        xp: 0,
    };

    const enchanterStats = {
        atk: 20,
        hp: 180,
        maxHp: 180,
        armor: 20,
        magicDurability: 20,
        mana: 20,
        speed: 20,
        magicStrength: 30,
        manaPerAttack: 30,
        xp: 0,
    };
    await setDoc(doc(db, `${interaction.user.id}/EventDialogProgression`), {
        [ 'Nora' ]: { activeDialog: 'default' },
        [ 'Lyra' ]: { activeDialog: 'postRegisterTutorial' },
        [ 'Arissa' ]: { activeDialog: 'postRegisterTutorial' },
        [ 'Abe' ]: { activeDialog: 'postRegisterTutorial' },
    }, { merge: true });
    await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), {
        [ 'xpBonus' ]: 0,
        [ 'playerLvl' ]: 1,
        [ 'nextLvlXpGoal' ]: 400,
        [ 'dead' ]: false,
        [ 'activeBuffs' ]: [],
        [ 'eventPoints' ]: 0,
        [ 'attackOnCooldown' ]: false,
        [ 'attackCooldown' ]: 0,
    }, { merge: true });

    await setDoc(doc(db, `${interaction.user.id}/ActiveBattles`), { [ 'battles' ]: { amount: 0 } }, { merge: true });
    await setDoc(doc(db, 'Event/Players'), { [ 'members' ]: arrayUnion({ id: interaction.user.id }) }, { merge: true });


    const desc = 'Esta orbe te da **__+{ratio}% ATK__** (**25%** - **75%** ✳️) por tus siguientes **__{attacks}__** (**3** - **5** ✳️) ataques.';

    const empoweredAttacks = {
        ratio: '25/25-75',
        ability: Abilities.EmpoweredAttacks,
        attacks: '3/3-5',
        requiredMana: '150',
        staticMana: '150',
        innate: true,
        desc: desc,
        name: 'Arcanic Power',
        id: 1,
        minLvl: 1,
    };

    switch (selectedClass.toLowerCase()) {
        case 'warrior':
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { [ 'swords' ]: { amount: 0 } });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { [ 'gold' ]: (10) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipped`), { [ 'sword' ]: {} }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipped`), { [ 'abilityOrbs' ]: {} }, { merge: true });

            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { [ 'armorPlates' ]: { amount: 0 } }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { [ 'class' ]: (selectedClass.toLowerCase()) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { [ 'stats' ]: (warriorStats) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), {
                [ 'instructor' ]: {
                    level: {
                        currentStars: 0,
                        starsForNextTitle: 30,
                        titleLevel: 1,
                        titleName: 'Beginner',
                    },
                    name: 'Lyra',
                },
            }, { merge: true });

            break;

        case 'archer':
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { [ 'bows' ]: { amount: 0 } });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { [ 'gold' ]: (10) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipped`), { [ 'bow' ]: {} }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipped`), { [ 'abilityOrbs' ]: {} }, { merge: true });

            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { [ 'armorPlates' ]: { amount: 0 } }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { [ 'class' ]: (selectedClass.toLowerCase()) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { [ 'stats' ]: (archerStats) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), {
                [ 'instructor' ]: {
                    level: {
                        currentStars: 0,
                        starsForNextTitle: 30,
                        titleLevel: 1,
                        titleName: 'Beginner',
                    },
                    name: 'Arissa',
                },
            }, { merge: true });
            break;

        case 'enchanter':
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { [ 'wands' ]: { amount: 0 } });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { [ 'gold' ]: (15) }, { merge: true });

            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipped`), { [ 'wand' ]: {} }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipped`), { [ 'abilityOrbs' ]: {} }, { merge: true });

            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { [ 'abilityOrbs' ]: { amount: 1, abilityOrb1: empoweredAttacks } }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { [ 'armorPlates' ]: { amount: 0 } }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { [ 'class' ]: (selectedClass.toLowerCase()) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { [ 'stats' ]: (enchanterStats) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), {
                [ 'instructor' ]: {
                    level: {
                        currentStars: 0,
                        starsForNextTitle: 30,
                        titleLevel: 1,
                        titleName: 'Beginner',
                    },
                    name: 'Abe',
                },
            }, { merge: true });
            break;

        default:
            break;
    }
    for (let index = 1; index < 9; index++) {
        for (let mission = 0; mission < 6; mission++) {
            await setDoc(doc(db, `${interaction.user.id}/EventQuestProgression/Weekly/Week${index}`), { [ `mission${mission}` ]: (0) }, { merge: true });
        }
    }

}
