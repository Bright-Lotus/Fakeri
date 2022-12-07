const { getFirestore, doc, getDoc, updateDoc, arrayRemove, arrayUnion, deleteDoc, deleteField, increment } = require('firebase/firestore');
const { xpManager } = require('./xpHandler.js');
const { goldManager } = require('./goldHandler.js');
const { healthManager } = require('./healthHandler.js');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../main.js');
const { keywordHandler } = require('./keywordHandler.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function attack(user, enemy) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const battles = await getDoc(doc(db, user.id, 'ActiveBattles'));
        if (battles.exists()) {
            const enemyObj = battles.data().battles[`battle${enemy}`];
            console.log(enemyObj, enemy, 'debugAttack');
            const enemyHp = enemyObj.enemyHp;
            const enemyAtk = enemyObj.enemyAtk;
            const enemySpd = enemyObj.enemySpd;
            const enemyArmor = enemyObj.enemyArmor;
            const enemyMagicDurability = enemyObj.enemyMagicDurability;
            const enemyElite = enemyObj.enemyElite;
            const enemyUnique = enemyObj.enemyUnique;
            const enemyId = enemyObj.enemyId;
            const enemyXp = enemyObj.enemyXp;
            const enemyGold = enemyObj.enemyGold;
            const turn = enemyObj.turn;

            const playerInfoSnap = await getDoc(doc(db, user.id, 'PlayerInfo'));
            if (playerInfoSnap.exists()) {
                const playerAtk = playerInfoSnap.data().stats.atk;
                const finalDamage = (Math.sign(playerAtk - enemyArmor) == -1) ? 0 : playerAtk - enemyArmor;

                const finalEnemy = {
                    enemyId: enemyId,
                    enemyHp: enemyHp,
                    enemyMaxHp: enemyObj.enemyMaxHp,
                    enemyAtk: enemyAtk,
                    enemyArmor: enemyArmor,
                    enemySpd: enemySpd,
                    enemyMagicDurability: enemyMagicDurability,
                    enemyElite: enemyElite,
                    enemyUnique: enemyUnique,
                    enemyXp: enemyXp,
                    enemyGold: enemyGold,
                    turn: turn,
                    keywords: enemyObj.keywords,
                };

                if (turn == 'enemy') {
                    finalEnemy.turn = 'player';
                    const enemyDmg = enemyAtk - playerInfoSnap.data().stats.armor;
                    if (Math.sign(enemyDmg) == -1) {
                        return resolve({ enemyAttacked: true, damageReceived: 0, remainingHp: playerInfoSnap.data().stats.hp });
                    }
                    let remainingHp;
                    let dead;
                    await healthManager('damage', user, enemyDmg).then(results => {
                        if (results.dead) {
                            dead = true;
                        }
                        remainingHp = results.remainingHp;
                    });
                    if (dead) {
                        return reject({ damageReceived: enemyDmg });
                    }

                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [`battles.battle${enemy}`]: finalEnemy,
                    }, { merge: true });
                    return resolve({ enemyAttacked: true, damageReceived: enemyDmg, remainingHp: remainingHp });
                }

                const playerInfo = await getDoc(doc(db, user.id, 'PlayerInfo'));
                if (playerInfo.exists()) {
                    const activeBuffs = playerInfo.data().activeBuffs;
                    if (activeBuffs.length > 0) {
                        activeBuffs.forEach(async element => {
                            if (element?.attacks) {
                                const buff = {
                                    buff: element.buff,
                                    attacks: element.attacks - 1,
                                };

                                if (buff.attacks == 0) {
                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        ['stats.atk']: element.buff.split(':')[1],
                                    }, { merge: true });
                                }
                                await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                    ['activeBuffs']: arrayRemove(element),
                                }, { merge: true });

                                if (element.attacks > 0) {
                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        ['activeBuffs']: arrayUnion(buff),
                                    }, { merge: true });
                                }
                            }
                        });
                    }
                }

                finalEnemy.enemyHp = finalEnemy.enemyHp - finalDamage;
                finalEnemy.turn = (finalEnemy.turn == 'player') ? 'enemy' : 'player';
                if (finalEnemy.enemyHp <= 0) {
                    await xpManager('give', enemyXp, user);
                    await goldManager('give', enemyGold, user);
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [`battles.battle${enemy}`]: deleteField(),
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        ['battles.amount']: increment(-1),
                    }, { merge: true });
                    if (finalEnemy.keywords.length > 0) {
                        let resolveResults = {};
                        await Promise.all(finalEnemy.keywords.map(async keyword => {
                            if (keyword.type != 'LastBreath') return;
                            await keywordHandler(keyword.type, keyword.subtype, finalEnemy, user, { ratio: keyword.ratio }).then(results => {
                                resolveResults = { enemyKilled: true, xp: enemyXp, gold: enemyGold, damageDone: finalDamage, enemySplitted: results.enemySplitted };
                            });
                            return true;
                        }));

                        if (resolveResults?.enemyKilled) return resolve(resolveResults);
                    }
                    return resolve({ enemyKilled: true, xp: enemyXp, gold: enemyGold, damageDone: finalDamage });
                }

                await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                    [`battles.battle${enemy}`]: finalEnemy,
                }, { merge: true });
                return resolve({ damageDone: finalDamage, enemyHpRemaining: finalEnemy.enemyHp });
            }
        }
    });
}

module.exports = { attack };