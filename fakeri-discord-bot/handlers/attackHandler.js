const { getFirestore, doc, getDoc, updateDoc, arrayRemove, arrayUnion, deleteField, increment } = require('firebase/firestore');
const { xpManager } = require('./xpHandler.js');
const { goldManager } = require('./goldHandler.js');
const { healthManager } = require('./healthHandler.js');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../firebaseConfig.js');
const { keywordHandler } = require('./keywordHandler.js');
const { Utils } = require('../utils.js');
const { formatEmoji, bold } = require('discord.js');
const { Icons } = require('../emums/icons.js');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function attack(user, enemy, client, farmChannel) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        const battles = await getDoc(doc(db, user.id, 'ActiveBattles'));
        if (battles.exists()) {
            const enemyObj = battles.data().battles[ `battle${enemy}` ];
            const enemyHp = enemyObj.enemyHp;
            const enemyAtk = enemyObj.enemyAtk;
            const enemySpd = enemyObj.enemySpd;
            const enemyArmor = Number(enemyObj.enemyArmor);
            const enemyMagicDurability = Number(enemyObj.enemyMagicDurability);
            const enemyElite = enemyObj.enemyElite;
            const enemyUnique = enemyObj.enemyUnique;
            const enemyId = enemyObj.enemyId;
            const enemyXp = enemyObj.enemyXp;
            const enemyGold = enemyObj.enemyGold;
            const turn = enemyObj.turn;
            const debuffs = enemyObj.debuffs;

            const playerInfo = await getDoc(doc(db, user.id, 'PlayerInfo'));
            let emojisDmg = '';
            if (playerInfo.exists()) {
                let playerAtk = Number(playerInfo.data().stats.atk);
                console.log('🚀 ~ file: attackHandler.js:37 ~ returnnewPromise ~ playerAt', playerAtk);
                if (Math.random() < 0.4) {
                    // CRIT HIT
                    playerAtk += playerAtk / 100 * 150;
                    emojisDmg += formatEmoji(Icons.Crit);
                }
                if (Math.random() < 0.2) {
                    // LUCKY HIT
                    playerAtk += playerAtk / 100 * 180;
                    emojisDmg += formatEmoji(Icons.Lucky);
                }

                for await (const bonus of farmChannel?.zoneBonuses || []) {
                    const bonusAmount = Number(bonus.amount.match(/\d+/g));
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ `stats.${bonus.type}` ]: increment(Number(playerInfo.data().stats[ bonus.type ] / 100 * bonusAmount)),
                    }, { merge: true });
                }
                let finalDamage = (Math.sign(playerAtk - enemyArmor) == -1) ? 0 : playerAtk - enemyArmor;


                const finalEnemy = {
                    enemyId: enemyId,
                    enemyHp: enemyHp,
                    enemyMaxHp: enemyObj.enemyMaxHp,
                    enemyAtk: Number(enemyAtk),
                    enemyArmor: enemyArmor,
                    enemySpd: enemySpd,
                    enemyMagicDurability: enemyMagicDurability,
                    enemyElite: enemyElite,
                    enemyUnique: enemyUnique,
                    enemyXp: enemyXp,
                    enemyGold: enemyGold,
                    turn: turn,
                    keywords: enemyObj.keywords,
                    debuffs: debuffs,
                    turnsUntilAbility: Number(enemyObj.turnsUntilAbility),
                };

                let lifesteal = '';
                if (turn == 'enemy') {
                    finalEnemy.turn = 'player';
                    if (finalEnemy.debuffs.length > 0) {
                        for (const debuff of finalEnemy.debuffs) {
                            switch (debuff.type) {
                                case 'archerDebuff': {
                                    if (debuff.turns - 1 == 0) {
                                        finalEnemy.debuffs = finalEnemy.debuffs.filter((e) => e.type != 'archerDebuff');
                                        await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                                            [ `battles.battle${enemy}` ]: finalEnemy,
                                        }, { merge: true });
                                        return resolve({ enemyAttacked: false, damageReceived: 0, remainingHp: playerInfo.data().stats.hp });
                                    }
                                }
                            }
                        }
                    }

                    let enemyDmg = enemyAtk - (playerInfo.data().stats.armor / 2);
                    const onEnemyAttack = await (await getDoc(doc(db, user.id, 'PlayerInfo/Inventory/Equipped'))).data().onEnemyAttack;
                    if (onEnemyAttack?.length > 0) {
                        for await (const effect of onEnemyAttack) {
                            switch (effect.perk) {
                                case 'thornmail': {
                                    const perkRatio = effect.perkRatio.split('/');
                                    const baseDamage = perkRatio[ 0 ];
                                    const percentageDamage = perkRatio[ 1 ];
                                    const effectDamage = baseDamage + (playerInfo.data().stats.armor / 100 * percentageDamage);
                                    finalEnemy.enemyHp -= effectDamage - (finalEnemy.enemyMagicDurability / 2);
                                    break;
                                }
                                case 'mark': {
                                    const markDamage = Math.ceil((playerInfo.data().stats.armor / 100) * effect.perkRatio);
                                    finalEnemy.debuffs.push({ type: 'mark', damage: markDamage });
                                    break;
                                }
                                case 'gainArmor': {
                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        [ 'stats.armor' ]: Number(effect.perkRatio),
                                    }, { merge: true });
                                    break;
                                }
                                case 'gainGold': {
                                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                        [ 'gold' ]: Number(effect.perkRatio),
                                    }, { merge: true });
                                    break;
                                }
                                case 'freeze': {
                                    finalEnemy.enemyArmor -= (playerInfo.data().stats.armor / 100) * effect.ratio;
                                    break;
                                }
                                case 'dodge': {
                                    if ((Math.random() * 100) < effect.ratio) {
                                        enemyDmg = -1;
                                    }
                                }
                            }
                        }
                    }
                    if (Math.sign(enemyDmg) == -1) {
                        await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                            [ `battles.battle${enemy}` ]: finalEnemy,
                        }, { merge: true });
                        for await (const bonus of farmChannel?.zoneBonuses || []) {
                            const bonusAmount = Number(bonus.amount.match(/\d+/g)[0]);
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                [ `stats.${bonus.type}` ]: increment(-(playerInfo.data().stats[ bonus.type ] / 100 * bonusAmount)),
                            }, { merge: true });
                        }
                        return resolve({ enemyAttacked: true, damageReceived: 0, remainingHp: playerInfo.data().stats.hp });
                    }

                    let remainingHp;
                    let dead = false;
                    await healthManager('damage', user, enemyDmg).then(results => {
                        if (results.dead) {
                            dead = true;
                        }
                        remainingHp = results.remainingHp;
                    });
                    if (dead) {
                        for await (const bonus of farmChannel?.zoneBonuses || []) {
                            const bonusAmount = Number(bonus.amount.match(/\d+/g)[0]);
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                [ `stats.${bonus.type}` ]: increment(-Math.abs((playerInfo.data().stats[ bonus.type ] / 100 * bonusAmount))),
                            }, { merge: true });
                        }
                        return reject({ damageReceived: enemyDmg, remainingHp: `0 / **${playerInfo.data().stats.maxHp}** ${Utils.HpEmoji(0, playerInfo.data().stats.maxHp)}` });
                    }

                    let emojisBonusDmg = '';
                    finalEnemy.turnsUntilAbility -= 1;
                    console.log('🚀 ~ file: attackHandler.js:98 ~ returnnewPromise ~ finalEnemy.turnsUntilAbility', finalEnemy.turnsUntilAbility);
                    if (finalEnemy.turnsUntilAbility == 0) {
                        for await (const keyword of Object.values(finalEnemy.keywords)) {
                            if (keyword.type != 'ability') continue;
                            // Handle ability keyword
                            await keywordHandler(keyword.type, keyword.subtype, finalEnemy, user, { ratio: keyword.ratio, damageDealt: enemyDmg }).then(results => {
                                if (results?.healed) {
                                    emojisBonusDmg += formatEmoji(Icons.Lifesteal);
                                    finalEnemy.enemyHp += results.healed;
                                    if (finalEnemy.enemyHp > finalEnemy.enemyMaxHp) results.healed = 0;
                                    lifesteal += `\n\n${bold('Enemy healed:')}\n ${lifesteal} ${results.healed} ${formatEmoji(Icons.Lifesteal)}`;
                                    return;
                                }
                                enemyDmg = enemyDmg + Math.round(results.damageReceived);
                                emojisBonusDmg += results.bonusDmgEmoji;
                            });
                        }
                    }
                    if (finalEnemy.keywords.length > 0) {
                        for await (const keyword of Object.values(finalEnemy.keywords)) {
                            if (keyword.type == 'Duelist') {
                                finalEnemy.enemyAtk = Number(finalEnemy.enemyAtk) + Number(keyword.ratio);
                                emojisBonusDmg += formatEmoji(Icons.Duelist);
                                continue;
                            }
                            if (keyword.type != 'FlameTouch' && keyword.type != 'Plasmatic' && keyword.type != 'PoisonousAttacks' && keyword.type != 'Vampiric') continue;
                            // Handle keywords that should trigger on enemy attack
                            await keywordHandler(keyword.type, keyword.subtype, finalEnemy, user, { ratio: keyword.ratio, damageDealt: enemyDmg }).then(results => {
                                if (results?.healed) {
                                    emojisBonusDmg += formatEmoji(Icons.Vampiric);
                                    finalEnemy.enemyHp += results.healed;
                                    if (finalEnemy.enemyHp > finalEnemy.enemyMaxHp) results.healed = 0;
                                    lifesteal += `\n\n${bold('Enemy healed:')}\n ${lifesteal} ${results.healed} ${formatEmoji(Icons.Lifesteal)}`;
                                    return;
                                }
                                enemyDmg = enemyDmg + Math.round(results.damageReceived);
                                emojisBonusDmg += results.bonusDmgEmoji;
                            });
                        }
                    }
                    if (finalEnemy.enemyHp > finalEnemy.enemyMaxHp) finalEnemy.enemyHp = finalEnemy.enemyMaxHp;
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [ `battles.battle${enemy}` ]: finalEnemy,
                    }, { merge: true });
                    for await (const bonus of farmChannel?.zoneBonuses || []) {
                        const bonusAmount = Number(bonus.amount.match(/\d+/g)[0]);
                        await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                            [ `stats.${bonus.type}` ]: increment(-Math.abs((playerInfo.data().stats[ bonus.type ] / 100 * bonusAmount))),
                        }, { merge: true });
                    }
                    return resolve({ enemyAttacked: true, damageReceived: `${Math.round(enemyDmg)} ${emojisBonusDmg}`, remainingHp: `${Math.round(remainingHp)} / **${playerInfo.data().stats.maxHp}** ${Utils.HpEmoji(remainingHp, playerInfo.data().stats.maxHp)} ${lifesteal}` });
                }

                console.log('🚀 ~ file: attackHandler.js:125 ~ returnnewPromise ~ finalEnemy.enemyHp', finalEnemy.enemyHp);
                if (finalEnemy.debuffs.length > 0) {
                    for (let i = 0; i < finalEnemy.debuffs.length; i++) {
                        const debuff = finalEnemy.debuffs[ i ];
                        switch (debuff.type) {
                            case 'burn': {
                                const burnDamage = Math.floor(debuff.damage - (finalEnemy.enemyMagicDurability / 2));
                                if (Math.sign(burnDamage) == -1) {
                                    break;
                                }
                                else {
                                    finalEnemy.enemyHp -= burnDamage;
                                }
                                break;
                            }
                            case 'mark': {
                                const markDamage = Math.floor(debuff.damage - (finalEnemy.enemyMagicDurability * 0.7));
                                if (Math.sign(markDamage) == -1) {
                                    break;
                                }
                                else {
                                    finalEnemy.enemyHp -= markDamage;
                                    finalEnemy.debuffs.splice(i, 1);
                                }
                            }
                        }
                    }
                }
                console.log('🚀 ~ file: attackHandler.js:136 ~ returnnewPromise ~ finalEnemy.enemyHp', finalEnemy.enemyHp);


                if (playerInfo.exists()) {
                    const activeBuffs = playerInfo.data().activeBuffs;
                    if (activeBuffs.length > 0) {
                        activeBuffs.forEach(async element => {
                            const buff = {
                                buff: element.buff,
                                attacks: element.attacks - 1,
                            };
                            console.log('🚀 ~ file: attackHandler.js:140 ~ returnnewPromise ~ buff debug', element, buff);
                            switch (buff.buff.split(':')[ 0 ]) {
                                case 'increasedAtk': {
                                    if (element?.attacks) {
                                        emojisDmg += formatEmoji(Icons.BuffedAtk);
                                        if (buff.attacks == 0) {
                                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                                [ 'stats.atk' ]: Number(element.buff.split(':')[ 1 ]),
                                            }, { merge: true });
                                        }
                                        await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                            [ 'activeBuffs' ]: arrayRemove(element),
                                        }, { merge: true });

                                        if (buff.attacks > 0) {
                                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                                [ 'activeBuffs' ]: arrayUnion(buff),
                                            }, { merge: true });
                                        }
                                    }
                                    break;
                                }
                            }
                        });
                    }
                    const onAttack = await (await getDoc(doc(db, user.id, 'PlayerInfo/Inventory/Equipped'))).data().onAttack;
                    if (onAttack) {
                        if (onAttack?.length > 0) {
                            for await (const effect of onAttack) {
                                switch (effect.perk) {
                                    case 'burn': {
                                        const burnDamage = Math.ceil((playerAtk / 100) * effect.perkRatio);
                                        finalEnemy.debuffs.push({ type: 'burn', damage: burnDamage });
                                        break;
                                    }

                                    case 'mark': {
                                        const markDamage = Math.ceil((playerAtk / 100) * effect.perkRatio);
                                        finalEnemy.debuffs.push({ type: 'mark', damage: markDamage });
                                        break;
                                    }

                                    case 'execute': {
                                        const ratio = effect.perkRatio;
                                        if ((finalEnemy.enemyHp - finalDamage) < (100 / (finalEnemy.enemyHp / ratio))) {
                                            finalDamage = 9999;
                                            emojisDmg += formatEmoji(Icons.Execute);
                                        }
                                        break;
                                    }

                                    case 'freeze':
                                        if (typeof effect.perkRatio == 'string') {
                                            const ratio = Number(effect.perkRatio.split('/')[ 0 ]) + playerInfo.data().stats.atk;
                                            finalEnemy.enemyArmor -= ratio;
                                            emojisDmg += '❄️';
                                        }
                                        break;

                                    case 'gainSpd': {
                                        await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                            [ 'stats.spd' ]: Number(effect.perkRatio),
                                        }, { merge: true });
                                        emojisDmg += '➕';
                                        break;
                                    }

                                    case 'gainAtk': {
                                        await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                            [ 'stats.atk' ]: Number(effect.perkRatio),
                                        }, { merge: true });
                                        emojisDmg += '➕';
                                        break;
                                    }

                                    case 'gainGold': {
                                        await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                            [ 'gold' ]: Number(effect.perkRatio),
                                        }, { merge: true });
                                        emojisDmg += '🪙';
                                        break;
                                    }

                                    case 'freezeFire': {
                                        const stat = (playerInfo.data().playerClass == 'enchanter') ? playerInfo.data().stats.magicStrength : playerInfo.data().stats.atk;
                                        const ratioFreeze = effect.perkRatio.split('/')[ 0 ];
                                        const ratioExtraDmg = effect.perkRatio.split('/')[ 1 ];

                                        finalDamage += Utils.ClampNumber((stat / 100 * ratioExtraDmg) - (finalEnemy.enemyMagicDurability / 2), 0, 9999);
                                        finalEnemy.enemyArmor -= stat / 100 * ratioFreeze;
                                        break;
                                    }

                                    case 'sharp': {
                                        finalDamage += effect.perkRatio / finalEnemy.enemyArmor * 0.5;
                                        break;
                                    }

                                    default:
                                        break;
                                }
                                if (effect.perk.includes('Strike')) {
                                    const stat = (playerInfo.data().playerClass == 'enchanter') ? playerInfo.data().stats.magicStrength : playerInfo.data().stats.atk;
                                    finalDamage += (stat / 100 * effect.perkRatio) - finalEnemy.enemyMagicDurability * 0.4;
                                }
                            }
                        }
                    }

                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'stats.mana' ]: increment(playerInfo.data().stats.manaPerAttack),
                    }, { merge: true });
                }

                if (finalEnemy.keywords.length > 0) {
                    for await (const keyword of Object.values(finalEnemy.keywords)) {
                        if (keyword.type != 'Hardened' && keyword.type != 'Elusive') continue;
                        console.log('🚀 ~ file: attackHandler.js:170 ~ forawait ~ keyword', keyword);
                        // Handle keywords that should trigger on player attack
                        await keywordHandler(keyword.type, keyword.subtype, finalEnemy, user, { ratio: keyword.ratio }).then(results => {
                            console.log('🚀 ~ file: attackHandler.js:172 ~ awaitkeywordHandler ~ results', results);
                            if (results?.dodged) {
                                finalDamage = 0;
                                emojisDmg += formatEmoji(Icons.Elusive);
                                return;
                            }
                            finalDamage += Math.round(results.damageDone);
                            emojisDmg += results.reducedDmgEmoji;
                        });
                    }
                }
                if (Math.sign(finalDamage) == -1) finalDamage = 0;
                // Attack the enemy
                finalEnemy.enemyHp -= finalDamage;
                if (!playerInfo.attackOnCooldown) {
                    const attackCooldown = 40;
                    const reducedAttackCdValue = attackCooldown / (1 + (playerInfo.data().stats.speed / 100));
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'attackOnCooldown' ]: true,
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ 'attackCooldown' ]: new Date(new Date().getTime() + (reducedAttackCdValue * 1000)),
                    }, { merge: true });
                    setTimeout(async () => {
                        await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                            [ 'attackOnCooldown' ]: false,
                        }, { merge: true });
                    }, reducedAttackCdValue * 1000);
                }
                finalEnemy.turn = (finalEnemy.turn == 'player') ? 'enemy' : 'player';
                console.log(finalEnemy, 'debugattackenemy');
                if (finalEnemy.enemyHp <= 0) {
                    client.emit('type8QuestProgress', user, client);

                    await xpManager('give', Number(enemyXp), user).then(console.log);
                    await goldManager('give', Number(enemyGold), user);
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [ `battles.battle${enemy}` ]: deleteField(),
                    }, { merge: true });
                    await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                        [ 'battles.amount' ]: increment(-1),
                    }, { merge: true });
                    if (finalEnemy.keywords.length > 0) {
                        let resolveResults = {};
                        await Promise.all(finalEnemy.keywords.map(async keyword => {
                            if (keyword.type != 'LastBreath') return;
                            await keywordHandler(keyword.type, keyword.subtype, finalEnemy, user, { ratio: keyword.ratio }).then(results => {
                                resolveResults = { enemyKilled: true, xp: Math.round((enemyXp / 100) * (playerInfo.data().xpBonus + 100)), gold: enemyGold, damageDone: `${(emojisDmg.trim() == '') ? Math.round(finalDamage) : bold(Math.round(finalDamage))} ${emojisDmg}`, enemySplitted: results.enemySplitted };
                            });
                            return true;
                        }));

                        for await (const bonus of farmChannel?.zoneBonuses || []) {
                            const bonusAmount = Number(bonus.amount.match(/\d+/g)[0]);
                            await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                                [ `stats.${bonus.type}` ]: increment(-Math.abs((playerInfo.data().stats[ bonus.type ] / 100 * bonusAmount))),
                            }, { merge: true });
                        }
                        if (resolveResults?.enemyKilled) return resolve(resolveResults);
                    }
                    for await (const bonus of farmChannel?.zoneBonuses || []) {
                        const bonusAmount = Number(bonus.amount.match(/\d+/g)[0]);
                        await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                            [ `stats.${bonus.type}` ]: increment(-Math.abs((playerInfo.data().stats[ bonus.type ] / 100 * bonusAmount))),
                        }, { merge: true });
                    }
                    return resolve({ enemyKilled: true, xp: Math.round((enemyXp / 100) * (playerInfo.data().xpBonus + 100)), gold: enemyGold, damageDone: `${(emojisDmg.trim() == '') ? Math.round(finalDamage) : bold(Math.round(finalDamage))} ${emojisDmg}` });
                }

                if (finalEnemy.enemyHp > finalEnemy.enemyMaxHp) finalEnemy.enemyHp = finalEnemy.enemyMaxHp;
                await updateDoc(doc(db, user.id, 'ActiveBattles'), {
                    [ `battles.battle${enemy}` ]: finalEnemy,
                }, { merge: true });
                for await (const bonus of farmChannel?.zoneBonuses || []) {
                    const bonusAmount = Number(bonus.amount.match(/\d+/g)[0]);
                    await updateDoc(doc(db, user.id, 'PlayerInfo'), {
                        [ `stats.${bonus.type}` ]: increment(-Math.abs((playerInfo.data().stats[ bonus.type ] / 100 * bonusAmount))),
                    }, { merge: true });
                }
                return resolve({ damageDone: `${(emojisDmg.trim() == '') ? Math.round(finalDamage) : bold(Math.round(finalDamage))} ${emojisDmg}`, enemyHpRemaining: `${finalEnemy.enemyHp} / **${finalEnemy.enemyMaxHp}** ${Utils.HpEmoji(finalEnemy.enemyHp, finalEnemy.enemyMaxHp)}` });
            }
        }
    });
}

module.exports = { attack };