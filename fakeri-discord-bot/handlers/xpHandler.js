const { getFirestore, getDoc, doc, updateDoc, increment } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, underscore, bold, formatEmoji } = require('discord.js');
const { Icons } = require('../emums/icons.js');
const { Utils } = require('../utils.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Level Up Formula (Level / Constant) ^ Power
async function xpManager(action, amount, user) {
    amount = Number(amount);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        if (action == 'give') {
            const constant = 0.1;
            const power = 2;

            const statConstant = 0.3;
            const statPower = 1.1;

            const secondaryStatConstant = 0.3;
            const secondaryStatPower = 0.9;

            const playerInfo = await getDoc(doc(db, user.id, 'PlayerInfo'));
            if (playerInfo.exists()) {
                const xpBonus = playerInfo.data().xpBonus;
                amount = amount + ((amount / 100) * (xpBonus + 100));
                let currentXp = playerInfo.data().stats.xp + amount;
                let nextLvlGoal = Math.round(((playerInfo.data().playerLvl + 2) / constant) ** power);
                let currentLvlGoal = Math.round(((playerInfo.data().playerLvl + 1) / constant) ** power);

                while (currentXp >= currentLvlGoal) {
                    const updatedStats = await getDoc(doc(db, user.id, 'PlayerInfo'));
                    let maxHpCurrent = 0;
                    console.log(currentXp, currentLvlGoal, 'debuglevelup', amount);
                    const [ previousLvl, currentLvl ] = [ updatedStats.data().playerLvl, updatedStats.data().playerLvl + 1 ];
                    currentXp -= currentLvlGoal;
                    if (Math.sign(currentXp) == -1) currentXp = 0;
                    /* TODO if (docSnap.data().class = 'enchanter') {
                        docSnap.data().stats.magicStrength;
                    } */

                    const levelUpEmbed = new EmbedBuilder()
                        .setTitle('Felicidades!')
                        .setDescription(`Has subido de nivel!\n${bold('Tus stats han mejorado:')}`)
                        .setColor('Random')
                        .addFields(
                            {
                                name: `Nivel ${(previousLvl.toString())} > ${bold(currentLvl.toString())} ${formatEmoji(Icons.LevelUp)}`,
                                value: `XP Actual: ${bold(currentXp)}`,
                            },
                        );
                    for (const key in updatedStats.data().stats) {
                        if (key == 'xp') continue;
                        if (key == 'hp') continue;
                        if (key == 'mana') continue;

                        const currentOtherStat = Math.round(((updatedStats.data().playerLvl + 1) / secondaryStatConstant) ** secondaryStatPower);
                        if (updatedStats.data().class == 'enchanter') {
                            let currentMagic = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** statPower);
                            switch (key) {
                                case 'magicStrength':

                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        [ `stats.${key}` ]: updatedStats.data().stats[ key ] + currentMagic,
                                    }, { merge: true });
                                    levelUpEmbed.addFields(
                                        { name: bold(Utils.FormatStatName('magicStrength')), value: `${(updatedStats.data().stats[ key ].toString())} > ${bold((updatedStats.data().stats[ key ] + currentMagic).toString())}` },
                                    );
                                    break;

                                case 'speed':
                                    currentMagic = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** 0.5);

                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        [ `stats.${key}` ]: updatedStats.data().stats[ key ] + currentMagic,
                                    }, { merge: true });
                                    levelUpEmbed.addFields(
                                        { name: bold(Utils.FormatStatName(key)), value: `${(updatedStats.data().stats[ key ].toString())} > ${bold((updatedStats.data().stats[ key ] + currentMagic).toString())}` },
                                    );
                                    break;

                                case 'manaPerAttack':
                                    currentMagic = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** 0.7);

                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        [ `stats.${key}` ]: updatedStats.data().stats[ key ] + currentMagic,
                                    }, { merge: true });
                                    levelUpEmbed.addFields(
                                        { name: bold(Utils.FormatStatName(key)), value: `${updatedStats.data().stats[ key ].toString()} > ${bold((updatedStats.data().stats[ key ] + currentMagic).toString())}` },
                                    );
                                    break;

                                default:

                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        [ `stats.${key}` ]: updatedStats.data().stats[ key ] + currentOtherStat,
                                    }, { merge: true });

                                    levelUpEmbed.addFields(
                                        { name: Utils.FormatStatName(key), value: `${updatedStats.data().stats[ key ].toString()} > ${bold((updatedStats.data().stats[ key ] + currentOtherStat).toString())}` },
                                    );
                                    break;
                            }
                            continue;
                        }
                        let currentAtk = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** statPower);
                        switch (key) {
                            case 'atk':

                                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                    [ `stats.${key}` ]: updatedStats.data().stats[ key ] + currentAtk,
                                }, { merge: true });
                                levelUpEmbed.addFields(
                                    { name: bold(Utils.FormatStatName(key)), value: `${(updatedStats.data().stats[ key ].toString())} > ${bold((updatedStats.data().stats[ key ] + currentAtk).toString())}` },
                                );
                                break;

                            case 'speed':
                                currentAtk = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** 0.5);

                                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                    [ `stats.${key}` ]: updatedStats.data().stats[ key ] + currentAtk,
                                }, { merge: true });
                                levelUpEmbed.addFields(
                                    { name: bold(Utils.FormatStatName(key)), value: `${(updatedStats.data().stats[ key ].toString())} > ${bold((updatedStats.data().stats[ key ] + currentAtk).toString())}` },
                                );
                                break;

                            case 'mana':
                                currentAtk = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** 0.3);

                                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                    [ `stats.${key}` ]: updatedStats.data().stats[ key ] + currentAtk,
                                }, { merge: true });
                                levelUpEmbed.addFields(
                                    { name: bold(Utils.FormatStatName(key)), value: `${(updatedStats.data().stats[ key ].toString())} > ${bold((updatedStats.data().stats[ key ] + currentAtk).toString())}` },
                                );
                                break;

                            default:

                                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                    [ `stats.${key}` ]: updatedStats.data().stats[ key ] + currentOtherStat,
                                }, { merge: true });
                                levelUpEmbed.addFields(
                                    { name: Utils.FormatStatName(key), value: `${updatedStats.data().stats[ key ].toString()} > ${bold((updatedStats.data().stats[ key ] + currentOtherStat).toString())}` },
                                );
                                if (key == 'maxHp') maxHpCurrent = updatedStats.data().stats[ key ] + currentOtherStat;
                                break;
                        }
                    }


                    user.send({ embeds: [ levelUpEmbed ] });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'stats.xp' ]: increment(amount),
                    }, { merge: true });

                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'eventPoints' ]: increment(amount),
                    }, { merge: true });

                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'nextLvlXpGoal' ]: nextLvlGoal,
                    }, { merge: true });

                    if (playerInfo.data().stats.hp <= updatedStats.data().stats.maxHp) {
                        await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                            [ 'stats.hp' ]: maxHpCurrent,
                        }, { merge: true });
                    }

                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'playerLvl' ]: increment(1),
                    }, { merge: true });

                    // We emit the event to the client saying the user leveled up
                    user.client.emit('type9QuestProgress', user, user.client);

                    const equipment = await (await getDoc(doc(db, user.id, 'PlayerInfo/Inventory/Equipment'))).data().abilityOrbs;
                    // The following code snippet is for setting the new ratios
                    // Example 35/35-75 >> 37/35-75
                    // The number before the / is the actual ratio
                    // The numbers after the / are min-max for the ratio
                    if (equipment) {
                        for await (const orb of Object?.entries(equipment || {}) || []) {
                            if (typeof orb[ 1 ] != 'object') continue;
                            for await (const orbValues of Object.entries(orb[ 1 ])) {
                                if (typeof orbValues[ 1 ] != 'string' || !orbValues[ 1 ].includes('/')) continue;

                                // Ratio values = '35/35-75' (EXAMPLE)
                                const ratioValues = orbValues[ 1 ];
                                // Ratio split = ['35', '35-75'] (EXAMPLE)
                                const ratioSplit = ratioValues.split('/');
                                const ratio = ratioSplit[ 0 ];
                                // Ratio max = '75' (EXAMPLE)
                                const ratioMax = ratioSplit[ 1 ].split('-')[ 1 ];
                                // Ratio min = '35' (EXAMPLE)
                                // This variable is only defined for use in the newRatioValues variable
                                const ratioMin = ratioSplit[ 1 ].split('-')[ 0 ];
                                // Add 2 to the ratio
                                let newRatio = Number(ratio) + 2;
                                // Running a check for if the ratio goes over the max value
                                if (newRatio > Number(ratioMax)) newRatio = ratioMax;
                                // Set the ratio in DB (START)
                                const newRatioValues = `${newRatio}/${ratioMin}-${ratioMax}`;

                                await updateDoc(doc(db, user.id, 'PlayerInfo/Inventory/Equipment'), {
                                    [ `abilityOrbs.${orb[ 0 ]}.${orbValues[ 0 ]}` ]: newRatioValues,
                                }, { merge: true });
                                // (END)
                            }
                        }
                    }

                    nextLvlGoal += Math.round(((playerInfo.data().playerLvl + 1) / constant) ** power);
                    currentLvlGoal += Math.round(((playerInfo.data().playerLvl + 1) / constant) ** power);
                }
                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                    [ 'stats.xp' ]: currentXp,
                }, { merge: true });
                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                    [ 'eventPoints' ]: increment(amount),
                }, { merge: true });
                return resolve(currentXp - playerInfo.data().nextLvlXpGoal);
            }
        }
    });
}

module.exports = { xpManager };