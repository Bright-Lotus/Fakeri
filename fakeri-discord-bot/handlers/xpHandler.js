const { getFirestore, getDoc, doc, updateDoc, increment } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { EmbedBuilder, underscore, bold, formatEmoji } = require('discord.js');
const { Icons } = require('../emums/icons.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Level Up Formula (Level / Constant) ^ Power
async function xpManager(action, amount, user) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        if (action == 'give') {
            const constant = 0.1;
            const power = 2;

            const statConstant = 0.3;
            const statPower = 1.1;

            const secondaryStatConstant = 0.3;
            const secondaryStatPower = 0.9;

            const docSnap = await getDoc(doc(db, user.id, 'PlayerInfo'));
            if (docSnap.exists()) {
                const xpBonus = docSnap.data().xpBonus;
                amount = amount + ((amount / 100) * (xpBonus + 100));
                let currentXp = docSnap.data().stats.xp + amount;
                let nextLvlGoal = Math.round(((docSnap.data().playerLvl + 2) / constant) ** power);
                let currentLvlGoal = Math.round(((docSnap.data().playerLvl + 1) / constant) ** power);

                while (currentXp >= currentLvlGoal) {
                    const updatedStats = await getDoc(doc(db, user.id, 'PlayerInfo'));
                    let maxHpCurrent = 0;
                    console.log(currentXp, currentLvlGoal, 'debuglevelup', amount);
                    const [previousLvl, currentLvl] = [updatedStats.data().playerLvl, updatedStats.data().playerLvl + 1];
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
                                name: `Nivel ${underscore(previousLvl.toString())} > ${bold(underscore(currentLvl.toString()))} ${formatEmoji(Icons.LevelUp)}`,
                                value: `XP Actual: ${underscore(currentXp)}`,
                            },
                        );
                    for (const key in updatedStats.data().stats) {
                        if (key == 'xp') continue;
                        if (key == 'hp') continue;

                        const currentOtherStat = Math.round(((updatedStats.data().playerLvl + 1) / secondaryStatConstant) ** secondaryStatPower);
                        if (updatedStats.data().class == 'enchanter') {
                            let currentMagic = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** statPower);
                            switch (key) {
                                case 'magicStrength':

                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        [`stats.${key}`]: updatedStats.data().stats[key] + currentMagic,
                                    }, { merge: true });
                                    levelUpEmbed.addFields(
                                        { name: underscore('MAGIC STRENGTH'), value: `${underscore(updatedStats.data().stats[key].toString())} > ${underscore((updatedStats.data().stats[key] + currentMagic).toString())}` },
                                    );
                                    break;

                                case 'speed':
                                    currentMagic = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** 0.5);

                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        [`stats.${key}`]: updatedStats.data().stats[key] + currentMagic,
                                    }, { merge: true });
                                    levelUpEmbed.addFields(
                                        { name: underscore('SPEED'), value: `${underscore(updatedStats.data().stats[key].toString())} > ${underscore((updatedStats.data().stats[key] + currentMagic).toString())}` },
                                    );
                                    break;

                                case 'mana':
                                    currentMagic = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** 0.7);

                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        [`stats.${key}`]: updatedStats.data().stats[key] + currentMagic,
                                    }, { merge: true });
                                    levelUpEmbed.addFields(
                                        { name: underscore('MANA'), value: `${underscore(updatedStats.data().stats[key].toString())} > ${underscore((updatedStats.data().stats[key] + currentMagic).toString())}` },
                                    );
                                    break;

                                default:

                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        [`stats.${key}`]: updatedStats.data().stats[key] + currentOtherStat,
                                    }, { merge: true });

                                    levelUpEmbed.addFields(
                                        { name: underscore((key == 'magicDurability') ? 'MAGIC DURABILITY' : key.toUpperCase()), value: `${underscore(updatedStats.data().stats[key].toString())} > ${underscore((updatedStats.data().stats[key] + currentOtherStat).toString())}` },
                                    );
                                    break;
                            }
                            continue;
                        }
                        let currentAtk = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** statPower);
                        switch (key) {
                            case 'atk':

                                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                    [`stats.${key}`]: updatedStats.data().stats[key] + currentAtk,
                                }, { merge: true });
                                levelUpEmbed.addFields(
                                    { name: underscore(key.toUpperCase()), value: `${underscore(updatedStats.data().stats[key].toString())} > ${underscore((updatedStats.data().stats[key] + currentAtk).toString())}` },
                                );
                                break;

                            case 'speed':
                                currentAtk = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** 0.5);

                                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                    [`stats.${key}`]: updatedStats.data().stats[key] + currentAtk,
                                }, { merge: true });
                                levelUpEmbed.addFields(
                                    { name: underscore('SPEED'), value: `${underscore(updatedStats.data().stats[key].toString())} > ${underscore((updatedStats.data().stats[key] + currentAtk).toString())}` },
                                );
                                break;

                            case 'mana':
                                currentAtk = Math.round(((updatedStats.data().playerLvl + 1) / statConstant) ** 0.3);

                                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                    [`stats.${key}`]: updatedStats.data().stats[key] + currentAtk,
                                }, { merge: true });
                                levelUpEmbed.addFields(
                                    { name: underscore('MANA'), value: `${underscore(updatedStats.data().stats[key].toString())} > ${underscore((updatedStats.data().stats[key] + currentAtk).toString())}` },
                                );
                                break;

                            default:

                                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                    [`stats.${key}`]: updatedStats.data().stats[key] + currentOtherStat,
                                }, { merge: true });
                                levelUpEmbed.addFields(
                                    { name: underscore((key == 'magicDurability') ? 'MAGIC DURABILITY' : key.toUpperCase()), value: `${underscore(updatedStats.data().stats[key].toString())} > ${underscore((updatedStats.data().stats[key] + currentOtherStat).toString())}` },
                                );
                                if (key == 'maxHp') maxHpCurrent = updatedStats.data().stats[key] + currentOtherStat;
                                break;
                        }
                    }


                    user.send({ embeds: [levelUpEmbed] });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        ['stats.xp']: increment(amount),
                    }, { merge: true });

                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        ['eventPoints']: increment(amount),
                    }, { merge: true });

                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        ['nextLvlXpGoal']: nextLvlGoal,
                    }, { merge: true });

                    if (docSnap.data().stats.hp <= updatedStats.data().stats.maxHp) {
                        await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                            ['stats.hp']: maxHpCurrent,
                        }, { merge: true });
                    }

                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        ['playerLvl']: increment(1),
                    }, { merge: true });
                    nextLvlGoal += Math.round(((docSnap.data().playerLvl + 1) / constant) ** power);
                    currentLvlGoal += Math.round(((docSnap.data().playerLvl + 1) / constant) ** power);
                }
                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                    ['stats.xp']: currentXp,
                }, { merge: true });
                return resolve(currentXp - docSnap.data().nextLvlXpGoal);
            }
        }
    });
}

module.exports = { xpManager };