const { getFirestore, updateDoc, getDoc, doc, increment, arrayUnion } = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { Abilities } = require('../emums/abilities.js');
const { ErrorEmbed, EventErrors } = require('../errors/errors.js');
const { formatEmoji } = require('discord.js');
const { Icons } = require('../emums/icons.js');
const { Utils } = require('../utils.js');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function ability(abilityID, target, user) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const playerInfo = await getDoc(doc(db, user.id, 'PlayerInfo'));
        let abilityOrb;
        const playerEquipment = await getDoc(doc(db, user.id, 'PlayerInfo/Inventory/Equipment'));
        const enemy = await getDoc(doc(db, user.id, 'ActiveBattles'))?.battles?.[ `battle${target}` ] || {};
        if (playerEquipment.exists()) {
            abilityOrb = playerEquipment.data().abilityOrbs[ `abilityOrb${abilityID}` ];
            if (playerInfo.data().stats.mana < abilityOrb.requiredMana) {
                return reject({ manaEmbed: ErrorEmbed(EventErrors.NotEnoughMana, `Necesitas **${abilityOrb.requiredMana - playerInfo.data().stats.mana}** ${formatEmoji(Icons.Mana)} mas para cargar este orbe.`) });
            }
        }
        if (playerInfo.exists()) {
            switch (abilityOrb.ability) {
                case Abilities.EmpoweredAttacks: {
                    const playerAtk = playerInfo.data().stats.atk;
                    const attacks = Number(abilityOrb.attacks.split('/')[ 0 ]);
                    const atkRatio = Number(abilityOrb.ratio.split('/')[ 0 ]) + 100;
                    const finalAtkAmount = Math.round((playerAtk / 100) * atkRatio);
                    const activeBuffs = {
                        buff: `increasedAtk:${playerAtk}`,
                        attacks: attacks,
                    };
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'stats.atk' ]: finalAtkAmount,
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'activeBuffs' ]: arrayUnion(activeBuffs),
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'stats.mana' ]: increment(-Math.abs(abilityOrb.requiredMana)),
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }

                case Abilities.Heal: {
                    const playerMgcStr = playerInfo.data().stats.magicStrength;
                    const healRatio = Number(abilityOrb.ratio.split('/')[ 0 ]) + 100;
                    const healAmount = 10 + Math.round((playerMgcStr / 100) * healRatio);
                    console.log(healAmount, healRatio, playerMgcStr);

                    await updateDoc(doc(db, target, 'PlayerInfo'), {
                        [ 'stats.hp' ]: increment(healAmount),
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'stats.mana' ]: increment(-Math.abs(abilityOrb.requiredMana)),
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }

                case 'strike': {
                    const playerMgcStrength = playerInfo.data().stats.magicStrength;
                    const enemyMagicDurability = enemy.enemyMagicDurability;
                    const finalDamage = (abilityOrb.ratio.split('/')[ 0 ] / 100) * playerMgcStrength - (enemyMagicDurability * 0.7);
                    enemy.enemyHp -= finalDamage;
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [ `battle${target}` ]: enemy,
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }

                case 'burnStrike': {
                    const playerMgcStrength = playerInfo.data().stats.magicStrength;
                    const enemyMagicDurability = enemy.enemyMagicDurability;
                    const finalDamage = (abilityOrb.ratio.split('/')[ 0 ] / 100) * playerMgcStrength - (enemyMagicDurability * 0.7);
                    enemy.enemyHp -= finalDamage;
                    const burnDamage = (abilityOrb.burnRatio / 100) * playerMgcStrength - (enemyMagicDurability * 0.6);
                    enemy.debuffs.push({ type: 'burn', damage: burnDamage });
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [ `battle${target}` ]: enemy,
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }

                case 'healUpgraded': {
                    const playerMgcStr = playerInfo.data().stats.magicStrength;
                    const healRatio = Number(abilityOrb.ratio.split('/')[ 0 ]);
                    let healAmount = 10 + Math.round((playerMgcStr / 100) * healRatio);
                    const targetStats = playerInfo.data().stats;
                    if (targetStats.maxHp * 30 / 100 < targetStats.hp) {
                        healAmount += healAmount * 0.3;
                    }
                    console.log(healAmount, healRatio, playerMgcStr);

                    await updateDoc(doc(db, target, 'PlayerInfo'), {
                        [ 'stats.hp' ]: increment(healAmount),
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'stats.mana' ]: increment(-Math.abs(abilityOrb.requiredMana)),
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }

                case 'healRevive': {
                    const playerMgcStr = playerInfo.data().stats.magicStrength;
                    const healRatio = Number(abilityOrb.ratio.split('/')[ 0 ]);
                    const healAmount = Math.round((playerMgcStr / 100) * healRatio);

                    await updateDoc(doc(db, target, 'PlayerInfo'), {
                        [ 'stats.hp' ]: healAmount,
                        [ 'dead' ]: false,
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }

                case 'empowerAlly': {
                    const playerMgcStr = playerInfo.data().stats.magicStrength;
                    const empowerRatio = Number(abilityOrb.ratio.split('/')[ 0 ]);
                    const mainStat = (playerInfo.class === 'warrior') ? 'atk' : 'magicStrength';
                    const oldMainStat = await (await getDoc(doc(db, target, 'PlayerInfo'))).data().stats[ mainStat ];
                    const activeBuffs = {
                        buff: `increased${Utils.CapitalizeFirstLetter(mainStat)}:${oldMainStat}`,
                        attacks: Number(abilityOrb.attacks),
                    };
                    await updateDoc(doc(db, target, 'PlayerInfo'), {
                        [ 'activeBuffs' ]: arrayUnion(activeBuffs),
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ `stats.${mainStat}` ]: increment((playerMgcStr / 100) * empowerRatio),
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }

                case 'weaken': {
                    const playerMgcStr = playerInfo.data().stats.magicStrength;
                    const weakenRatio = (playerMgcStr / 100) * Number(abilityOrb.ratio.split('/')[ 0 ]);
                    enemy.enemyArmor -= weakenRatio;
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [ `battle${target}` ]: enemy,
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }

                case 'weakenPower': {
                    const playerMgcStr = playerInfo.data().stats.magicStrength;
                    const weakenRatio = (playerMgcStr / 100) * Number(abilityOrb.ratio.split('/')[ 0 ]);
                    enemy.enemyAtk -= weakenRatio;
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [ `battle${target}` ]: enemy,
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }
                case 'empowerMana': {
                    const playerMgcStr = playerInfo.data().stats.magicStrength;
                    const empowerRatio = Number(abilityOrb.ratio.split('/')[ 0 ]);
                    const oldMana = await (await getDoc(doc(db, user.id, 'PlayerInfo'))).data().stats.mana;
                    const activeBuffs = {
                        buff: `increasedMana:${oldMana}`,
                        attacks: Number(abilityOrb.attacks),
                    };
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'activeBuffs' ]: arrayUnion(activeBuffs),
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'stats.manaPerAttack' ]: increment((playerMgcStr / 100) * empowerRatio),
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }
                case 'empowerAllyMana': {
                    const playerMgcStr = playerInfo.data().stats.magicStrength;
                    const empowerRatio = Number(abilityOrb.ratio.split('/')[ 0 ]);
                    const oldMana = await (await getDoc(doc(db, target, 'PlayerInfo'))).data().stats.mana;
                    const activeBuffs = {
                        buff: `increasedMana:${oldMana}`,
                        attacks: Number(abilityOrb.attacks),
                    };
                    await updateDoc(doc(db, target, 'PlayerInfo'), {
                        [ 'activeBuffs' ]: arrayUnion(activeBuffs),
                    }, { merge: true });
                    await updateDoc(doc(db, target, 'PlayerInfo'), {
                        [ 'stats.manaPerAttack' ]: increment((playerMgcStr / 100) * empowerRatio),
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }

                case 'protectAlly': {
                    const playerMgcStr = playerInfo.data().stats.magicStrength;
                    const protectRatio = Number(abilityOrb.ratio.split('/')[ 0 ]);
                    const oldArmor = await (await getDoc(doc(db, target, 'PlayerInfo'))).data().stats.armor;
                    const activeBuffs = {
                        buff: `increasedArmor:${oldArmor}`,
                        attacks: Number(abilityOrb.attacks),
                    };
                    await updateDoc(doc(db, target, 'PlayerInfo'), {
                        [ 'activeBuffs' ]: arrayUnion(activeBuffs),
                    }, { merge: true });
                    await updateDoc(doc(db, target, 'PlayerInfo'), {
                        [ 'stats.armor' ]: increment((playerMgcStr / 100) * protectRatio),
                    }, { merge: true });
                    return resolve({ manaRemaining: (playerInfo.data().stats.mana) + (-Math.abs(abilityOrb.requiredMana)) });
                }

                default:
                    break;
            }
        }
    });
}

module.exports = { ability };