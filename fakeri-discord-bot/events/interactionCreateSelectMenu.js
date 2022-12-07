const { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc, increment } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../main.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const { contextMenuExecute } = require('../commands/christmas.js');
const { EmbedBuilder, bold, underscore, Embed } = require('discord.js');
const { attack } = require('../handlers/attackHandler.js');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const { healthManager } = require('../handlers/healthHandler.js');
const { Abilities } = require('../emums/abilities.js');
const { pagination } = require('../handlers/paginationHandler.js');
const { ability } = require('../handlers/abilityHandler.js');
const { execute } = require('../commands/inventory.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isSelectMenu()) return;
        if (interaction.customId.includes('shopModal-selectMenu')) return;

        if (interaction.customId.includes('abilityModal-selectMenu/')) {
            // Interaction values: interaction.reply(interaction.values[0]);
            await ability(1, 1, interaction.user).catch((embed) => {
                interaction.reply({ embeds: [embed] });
            });
            return;
        }

        if (interaction.customId.includes('inventoryAbilityOrbsModal-orb1-selectMenu/') || interaction.customId.includes('inventoryAbilityOrbsModal-orb2-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[1]) {
                return interaction.reply({ embeds: [ErrorEmbed(EventErrors.NotOwnerOfInteraction)], ephemeral: true });
            }
            const abilityOrbID = interaction.values[0].split('-')[4];
            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (equipment.exists()) {
                const abilityOrb = equipment.data().abilityOrbs[`abilityOrb${abilityOrbID}`];
                const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));

                if (equipped.exists()) {
                    if (equipped.data()?.abilityOrbs[interaction.customId.split('-')[1]]) {
                        const abilityOrbEquipped = equipment.data().abilityOrbs[`abilityOrb${equipped.data()?.abilityOrbs[interaction.customId.split('-')[1]]}`];
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                            [`abilityOrbs.abilityOrb${equipped.data()?.abilityOrbs[interaction.customId.split('-')[1]]}.requiredMana`]: abilityOrbEquipped?.staticMana,
                        }, { merge: true });
                    }
                }
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                    ['abilityOrbs']: { ...equipped.data().abilityOrbs, [interaction.customId.split('-')[1]]: abilityOrbID },
                }, { merge: true });

                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'), {
                    [`abilityOrbs.abilityOrb${abilityOrbID}.requiredMana`]: Math.round(abilityOrb.requiredMana * 0.7),
                }, { merge: true });

                const equippedEmbed = new EmbedBuilder()
                    .setTitle('Se ha equipado el orbe de habilidad exitosamente!')
                    .setColor('Green')
                    .setDescription(`Se ha equipado ${abilityOrb.name}, en la ranura 1.\n\n${abilityOrb.desc}`);
                interaction.reply({ embeds: [equippedEmbed] });
            }
            return;
        }

        if (interaction.customId.includes('inventorySwordsModal-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[1]) {
                return interaction.reply({ embeds: [ErrorEmbed(EventErrors.NotOwnerOfInteraction)], ephemeral: true });
            }
            const swordID = interaction.values[0].split('-')[3];
            const equipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
            if (equipment.exists()) {
                const sword = equipment.data().swords[`sword${swordID}`];
                const swordStats = sword.stats;
                const equipped = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'));

                if (equipped.exists()) {
                    if (equipped.data().sword?.id) {
                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            ['stats.atk']: increment(-Math.abs(swordStats.atk)),
                        }, { merge: true });

                        await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                            ['stats.speed']: increment(-Math.abs(swordStats.spd)),
                        }, { merge: true });
                    }
                }
                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipped'), {
                    ['sword']: { id: swordID },
                }, { merge: true });

                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    ['stats.atk']: increment(swordStats.atk),
                }, { merge: true });

                await updateDoc(doc(db, interaction.user.id, 'PlayerInfo'), {
                    ['stats.speed']: increment(swordStats.spd),
                }, { merge: true });

                const equippedEmbed = new EmbedBuilder()
                    .setTitle('Se ha equipado la espada exitosamente!')
                    .setColor('Green')
                    .setDescription(`Se ha equipado ${sword.name}\n\n+${swordStats.atk} - ATK\n+${swordStats.spd} - SPD`);
                interaction.reply({ embeds: [equippedEmbed] });
            }
            return;
        }

        if (interaction.customId.includes('battleFlow-selectMenu/')) {
            if (interaction.user.id != interaction.customId.split('/')[1]) {
                return interaction.reply({ embeds: [ErrorEmbed(EventErrors.NotOwnerOfInteraction)], ephemeral: true });
            }
            const idSplit = interaction.values[0].split('-');
            const enemy = idSplit[3];
            const enemyHp = idSplit[4];
            const enemyAtk = idSplit[5];
            const enemySpd = idSplit[6];
            const enemyArmor = idSplit[7];
            const enemyMagicDurability = idSplit[8];
            const enemyElite = idSplit[9];
            const enemyXp = Number(idSplit[10]);
            const enemyGold = Number(idSplit[11]);
            const turn = idSplit[12];
            const keywords = idSplit[13].split('/').filter(element => element != '');
            const keywordsArray = [];
            keywords.forEach(element => {
                const keywordObj = {
                    type: element.split(':')[0],
                    subtype: element.split(':')[1],
                    ratio: element.split(':')[2],
                };
                keywordsArray.push(keywordObj);
            });
            let enemyUnique;

            const activeBattles = await getDoc(doc(db, interaction.user.id, 'ActiveBattles'));
            if (activeBattles.exists()) {

                if ((activeBattles.data()?.battles.amount + 1) > 3) {
                    const errorEmbed = ErrorEmbed(EventErrors.BattleLimitReached);
                    return interaction.reply({ embeds: [errorEmbed] });
                }

                enemyUnique = activeBattles.data().battles.amount;
            }

            const enemyAttackedEmbed = new EmbedBuilder()
                .setTitle('Tu enemigo te ha atacado!')
                .setColor('Red');
            const messageEmbeds = [];
            const battleStartEmbed = new EmbedBuilder()
                .setTitle('Batalla empezada con el enemigo seleccionado!')
                .setDescription('Escribe "attack" de nuevo para atacar a este enemigo.')
                .setColor('Green');
            messageEmbeds.push(battleStartEmbed);
            await updateDoc(doc(db, interaction.user.id, 'ActiveBattles'), {
                ['battles.amount']: increment(1),
            }, { merge: true });

            await updateDoc(doc(db, interaction.user.id, 'ActiveBattles'), {
                [`battles.battle${enemyUnique}`]: {
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
                },
            }, { merge: true }).then(async () => {
                if (turn == 'enemy') {
                    await attack(interaction.user, enemyUnique).then(async (results) => {
                        if (results.enemyAttacked) {
                            enemyAttackedEmbed.addFields(
                                { name: bold('Daño recibido'), value: underscore(results.damageReceived) },
                                { name: bold('Vida restante'), value: underscore(results.remainingHp) },
                            );
                            messageEmbeds.push(enemyAttackedEmbed);
                        }
                    }).catch(async (results) => {
                        enemyAttackedEmbed.addFields(
                            { name: bold('Daño recibido'), value: underscore(results.damageReceived) },
                            { name: bold('Vida restante'), value: underscore(0) },
                        );
                        const deadEmbed = new EmbedBuilder()
                            .setTitle('Has muerto!')
                            .setColor('Red')
                            .setDescription(`No puedes hacer nada hasta que revivas.\n${bold('Reviviras en 8 mega-revers.')}`);
                        await interaction.user.send({ embeds: [deadEmbed] });

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
            if (interaction.user.id != interaction.customId.split('/')[1]) {
                return interaction.reply({ embeds: [ErrorEmbed(EventErrors.NotOwnerOfInteraction)], ephemeral: true });
            }
            await interaction.deferReply();
            const idSplit = interaction.values[0].split('-');
            const enemyUnique = idSplit[4];
            console.log(enemyUnique, 'debugunique');

            console.log(idSplit[1], 'love');
            if (idSplit[1] === 'ability') {
                if (idSplit[6]?.trim() != '') {
                    interaction.editReply(`DEBUG: Selected orb: ${idSplit[6]}`);
                    await ability(idSplit[6], 1, interaction.user);
                    return;
                }
                const playerEquipment = await getDoc(doc(db, interaction.user.id, 'PlayerInfo/Inventory/Equipment'));
                if (playerEquipment.exists()) {
                    const playerInfo = await getDoc(doc(db, interaction.user.id, 'PlayerInfo'));
                    if (playerInfo.exists()) {
                        const playerMana = playerInfo.data().stats.mana;
                        const abilityOrbs = playerEquipment.data().abilityOrbs;
                        const abilityOrbsArray = Object.values(abilityOrbs).filter(element => (typeof element != 'number'));
                        await pagination('abilityOrbs', abilityOrbsArray, 1, interaction.user, { currentMana: playerMana, enemyUnique: enemyUnique }).then(results => {
                            return interaction.editReply({ embeds: [results.embed], components: [results.paginationRow, results.selectMenuRow] });
                        });
                    }

                }
                return;
            }

            const messageEmbeds = [];

            await attack(interaction.user, enemyUnique).then(async (results) => {
                console.log(results, 'debugresults');
                if (results?.enemyKilled) {
                    const killedEmbed = new EmbedBuilder()
                        .setTitle('Has matado al enemigo!')
                        .setColor('Random')
                        .addFields(
                            { name: bold('Daño hecho'), value: underscore(results.damageDone) },
                            { name: bold(`Recompensas | ${underscore('XP')}:`), value: underscore(results.xp) },
                            { name: bold(`Recompensas | ${underscore('Oro')}:`), value: underscore(results.gold) },
                        );

                    if (results?.enemySplitted) {
                        const splitEmbed = new EmbedBuilder()
                            .setTitle('El enemigo se ha dividido en 2!')
                            .setDescription('Tienes dos nuevas batallas activas.')
                            .setColor('Red');
                        await interaction.editReply({ embeds: [killedEmbed, splitEmbed] });
                        return;
                    }
                    await interaction.editReply({ embeds: [killedEmbed] });
                    return;
                }


                const damageEmbed = new EmbedBuilder()
                    .setTitle('Has atacado al enemigo!')
                    .addFields(
                        { name: bold('Daño hecho'), value: underscore(results.damageDone) },
                        { name: bold('Vida restante del enemigo'), value: underscore(results.enemyHpRemaining) },
                    );


                messageEmbeds.push(damageEmbed);

                const enemyAttackedEmbed = new EmbedBuilder()
                    .setTitle('Tu enemigo te ha atacado!')
                    .setColor('Red');

                await attack(interaction.user, enemyUnique).then(async (resultsEnemy) => {
                    if (resultsEnemy.enemyAttacked) {
                        enemyAttackedEmbed.addFields(
                            { name: bold('Daño recibido'), value: underscore(resultsEnemy.damageReceived) },
                            { name: bold('Vida restante'), value: underscore(resultsEnemy.remainingHp) },
                        );
                        messageEmbeds.push(enemyAttackedEmbed);
                    }
                }).catch(async (resultsDead) => {
                    enemyAttackedEmbed.addFields(
                        { name: bold('Daño recibido'), value: underscore(resultsDead.damageReceived) },
                        { name: bold('Vida restante'), value: underscore(0) },
                    );
                    const deadEmbed = new EmbedBuilder()
                        .setTitle('Has muerto!')
                        .setColor('Red')
                        .setDescription(`No puedes hacer nada hasta que revivas.\n${bold('Reviviras en 8 mega-revers.')}`);
                    await interaction.user.send({ embeds: [deadEmbed] });

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
            });
            return;
        }
        await interaction.deferUpdate();

        if (interaction.customId == 'class-select') {
            await classSelect(interaction);
            return;
        }
        contextMenuExecute(interaction, interaction.values[0]);
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
    },
};

async function classSelect(interaction) {
    const warriorStats = {
        atk: 30,
        hp: 40,
        maxHp: 40,
        armor: 15,
        magicDurability: 10,
        mana: 50,
        speed: 15,
        xp: 0,
    };

    const archerStats = {
        atk: 20,
        hp: 30,
        maxHp: 30,
        armor: 15,
        mana: 50,
        speed: 50,
        magicDurability: 10,
        xp: 0,
    };

    const enchanterStats = {
        atk: 10,
        hp: 35,
        maxHp: 35,
        armor: 15,
        magicDurability: 15,
        mana: 20,
        speed: 20,
        magicStrength: 30,
        xp: 0,
    };

    const selectedClass = interaction.values[0];
    await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['gold']: (0) }, { merge: true });
    await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['xpBonus']: (0) }, { merge: true });
    await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['playerLvl']: (1) }, { merge: true });
    await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['nextLvlXpGoal']: (400) }, { merge: true });
    await setDoc(doc(db, `${interaction.user.id}/ActiveBattles`), { ['battles']: { amount: 0 } }, { merge: true });
    await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['dead']: false }, { merge: true });
    await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['activeBuffs']: [] }, { merge: true });
    await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['eventPoints']: 0 }, { merge: true });



    const desc = 'Esta orbe te da **__+25% ATK__** (**25%** - **75%** ✳️) por tus siguientes **__3__** (**3** - **5** ✳️) ataques.';
    const empoweredAttacks = {
        ratio: '25/25-75',
        ability: Abilities.EmpoweredAttacks,
        attacks: '3/3-5',
        requiredMana: '150',
        staticMana: '150',
        innate: true,
        desc: desc,
        name: 'Furia del Tigre',
        id: 1,
        minLvl: 1,
    };


    switch (selectedClass.toLowerCase()) {
        case 'warrior':
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { ['swords']: { amount: 0 } });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipped`), { ['sword']: {} }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipped`), { ['abilityOrbs']: {} }, { merge: true });

            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { ['armorPlates']: { amount: 0 } }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { ['abilityOrbs']: { amount: 1, abilityOrb1: empoweredAttacks } }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['class']: (selectedClass.toLowerCase()) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['stats']: (warriorStats) }, { merge: true });
            break;

        case 'archer':
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['class']: (selectedClass.toLowerCase()) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['stats']: (archerStats) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { ['bows']: { amount: 0 } }, { merge: true });
            break;

        case 'enchanter':
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['class']: (selectedClass.toLowerCase()) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo`), { ['stats']: (enchanterStats) }, { merge: true });
            await setDoc(doc(db, `${interaction.user.id}/PlayerInfo/Inventory/Equipment`), { ['wands']: { amount: 0 } }, { merge: true });
            break;

        default:
            break;
    }
    const embed = new EmbedBuilder()
        .setTitle('Destiny has given you your path.')
        .setDescription(`You have been given ${selectedClass}!`)
        .setColor('#ffffff');
    interaction.editReply({ embeds: [embed], components: [] });
}
